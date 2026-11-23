import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Alert } from "react-native";

import {
  completeDailyQuest,
  completePersonalQuest,
  deletePersonalQuest,
  getDailyQuestStatus,
  getQuestById,
  startPersonalQuest,
} from "../../services/questService";

import {
  completeStepQuest,
  saveStepProgress,
  startStepQuest,
} from "../../services/stepQuestService";

export default function useQuestDetails(questId, questDate) {
  const [quest, setQuest] = useState(null);
  const [dailyQuest, setDailyQuest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingAction, setPendingAction] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const activeAction = useRef(null);
  const requestVersion = useRef(0);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      const version = ++requestVersion.current;

      async function loadQuest() {
        setIsLoading(true);
        setErrorMessage("");
        setQuest(null);
        setDailyQuest(null);
        setPendingAction(activeAction.current?.name ?? null);

        try {
          // Ако се връщаме по време на действие, изчакваме го,
          // преди да заредим актуалните данни.
          if (activeAction.current) {
            try {
              await activeAction.current.promise;
            } catch {
              // Зареждаме състоянието и при неуспешно действие.
            }
          }

          if (version !== requestVersion.current) return;

          const [questData, dailyQuestData] = await Promise.all([
            questId ? getQuestById(questId) : null,
            questId && questDate
              ? getDailyQuestStatus(questId, questDate)
              : null,
          ]);

          if (version !== requestVersion.current) return;

          setQuest(questData);
          setDailyQuest(dailyQuestData);
        } catch (error) {
          if (version !== requestVersion.current) return;

          console.error("Failed to load quest:", error);
          setErrorMessage("Could not load this quest.");
        } finally {
          if (version === requestVersion.current) {
            setIsLoading(false);
          }
        }
      }

      loadQuest();

      return () => {
        requestVersion.current += 1;
      };
    }, [questId, questDate]),
  );

  const isPersonal = Boolean(quest?.owner_id);
  const isStepQuest = quest?.target_type === "steps";

  const isManualQuest =
    Boolean(quest) &&
    quest.target_type == null &&
    quest.target_value == null;

  const status = isPersonal ? quest : dailyQuest;
  const startedAt = status?.started_at ?? null;
  const completedAt = status?.completed_at ?? null;
  const savedProgress = status?.progress_value ?? 0;

  const hasQuestAccess =
    Boolean(quest) && (isPersonal || Boolean(dailyQuest));

  const canManage = isPersonal && !startedAt && !completedAt;

  const canStart =
    hasQuestAccess &&
    !startedAt &&
    !completedAt &&
    (isStepQuest || isPersonal);

  const canComplete =
    hasQuestAccess &&
    !completedAt &&
    (
      (isManualQuest && (isPersonal ? Boolean(startedAt) : true)) ||
      (
        isStepQuest &&
        Boolean(startedAt) &&
        quest.target_value > 0 &&
        savedProgress >= quest.target_value
      )
    );

  function updateStatus(changes) {
    if (isPersonal) {
      setQuest((current) =>
        current?.id === questId
          ? { ...current, ...changes }
          : current,
      );
    } else {
      setDailyQuest((current) =>
        current ? { ...current, ...changes } : current,
      );
    }
  }

  async function runAction(name, errorTitle, operation) {
    if (activeAction.current) return false;

    const version = requestVersion.current;

    const action = {
      name,
      promise: Promise.resolve().then(() => operation(version)),
    };

    activeAction.current = action;
    setPendingAction(name);

    try {
      await action.promise;
      return true;
    } catch (error) {
      if (isMounted.current && version === requestVersion.current) {
        Alert.alert(errorTitle, error.message || "Please try again.");
      }

      return false;
    } finally {
      if (activeAction.current === action) {
        activeAction.current = null;

        if (isMounted.current) {
          setPendingAction(null);
        }
      }
    }
  }

  async function handleStartQuest() {
    if (!canStart) return false;

    return runAction("start", "Could not start quest", async (version) => {
      const startTime = isStepQuest
        ? await startStepQuest(questId, isPersonal ? null : questDate)
        : await startPersonalQuest(questId);

      if (version === requestVersion.current) {
        updateStatus({ started_at: startTime });
      }
    });
  }

  async function handleSaveProgress(progress) {
    if (
      !isStepQuest ||
      !hasQuestAccess ||
      !startedAt ||
      completedAt
    ) {
      throw new Error("This quest is not available for step tracking.");
    }

    const version = requestVersion.current;

    const saved = await saveStepProgress(
      questId,
      progress,
      isPersonal ? null : questDate,
    );

    if (version === requestVersion.current) {
      if (isPersonal) {
        setQuest((current) =>
          current?.id === questId
            ? {
                ...current,
                progress_value: Math.max(
                  current.progress_value ?? 0,
                  saved,
                ),
              }
            : current,
        );
      } else {
        setDailyQuest((current) =>
          current
            ? {
                ...current,
                progress_value: Math.max(
                  current.progress_value ?? 0,
                  saved,
                ),
              }
            : current,
        );
      }
    }

    return saved;
  }

  async function handleCompleteQuest() {
    if (!canComplete) return false;

    return runAction(
      "complete",
      "Could not complete quest",
      async (version) => {
        let completionTime;

        if (isStepQuest) {
          completionTime = await completeStepQuest(
            questId,
            isPersonal ? null : questDate,
          );
        } else if (isPersonal) {
          completionTime = await completePersonalQuest(questId);
        } else {
          completionTime = await completeDailyQuest(questId, questDate);
        }

        if (version === requestVersion.current) {
          updateStatus({ completed_at: completionTime });
        }
      },
    );
  }

  async function handleDeleteQuest() {
    if (!canManage) return false;

    return runAction("delete", "Could not delete quest", () =>
      deletePersonalQuest(questId),
    );
  }

  return {
    quest,
    isLoading,
    errorMessage,
    isPersonal,
    isStepQuest,
    startedAt,
    completedAt,
    savedProgress,
    canManage,
    canStart,
    canComplete,
    pendingAction,
    handleStartQuest,
    handleSaveProgress,
    handleCompleteQuest,
    handleDeleteQuest,
  };
}