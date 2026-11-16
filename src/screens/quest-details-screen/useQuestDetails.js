import { useCallback, useRef, useState } from "react";
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

export default function useQuestDetails(questId, questDate) {
  const [quest, setQuest] = useState(null);
  const [dailyQuest, setDailyQuest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingAction, setPendingAction] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const activeAction = useRef(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadQuest() {
        setIsLoading(true);
        setErrorMessage("");
        setQuest(null);
        setDailyQuest(null);

        try {
          const [questData, dailyQuestData] = await Promise.all([
            questId ? getQuestById(questId) : null,
            questId && questDate
              ? getDailyQuestStatus(questId, questDate)
              : null,
          ]);

          if (isActive) {
            setQuest(questData);
            setDailyQuest(dailyQuestData);
          }
        } catch (error) {
          if (isActive) {
            console.error("Failed to load quest:", error);
            setErrorMessage("Could not load this quest.");
          }
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      }

      loadQuest();

      return () => {
        isActive = false;
      };
    }, [questId, questDate]),
  );

  const isPersonal = Boolean(quest?.owner_id);
  const isManualQuest =
    quest?.target_type == null && quest?.target_value == null;
  const completedAt = isPersonal
    ? quest?.completed_at
    : dailyQuest?.completed_at;

  const canManage = isPersonal && !quest.started_at && !completedAt;
  const canStart = canManage;
  const canComplete =
    isManualQuest &&
    !completedAt &&
    (isPersonal ? Boolean(quest?.started_at) : Boolean(dailyQuest));

  async function runAction(action, errorTitle, operation) {
    if (activeAction.current) return false;

    activeAction.current = action;
    setPendingAction(action);

    try {
      await operation();
      return true;
    } catch (error) {
      Alert.alert(errorTitle, error.message || "Please try again.");
      return false;
    } finally {
      activeAction.current = null;
      setPendingAction(null);
    }
  }

  async function handleStartQuest() {
    if (!canStart) return;

    await runAction("start", "Could not start quest", async () => {
      const startedAt = await startPersonalQuest(questId);

      setQuest((current) =>
        current?.id === questId ? { ...current, started_at: startedAt } : current,
      );
    });
  }

  async function handleCompleteQuest() {
    if (!canComplete) return;

    await runAction("complete", "Could not complete quest", async () => {
      if (isPersonal) {
        const completedAt = await completePersonalQuest(questId);

        setQuest((current) =>
          current?.id === questId
            ? { ...current, completed_at: completedAt }
            : current,
        );
      } else {
        const completedAt = await completeDailyQuest(questId, questDate);
        setDailyQuest({ completed_at: completedAt });
      }
    });
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
    completedAt,
    canManage,
    canStart,
    canComplete,
    pendingAction,
    handleStartQuest,
    handleCompleteQuest,
    handleDeleteQuest,
  };
}