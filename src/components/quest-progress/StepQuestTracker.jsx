import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, StyleSheet, View } from "react-native";

import AppButton from "../app-button/AppButton";
import usePedometer from "../../hooks/usePedometer";
import QuestProgress from "./QuestProgress";
import { theme } from "../../theme/theme";

export default function StepQuestTracker({
  targetSteps,
  savedProgress,
  onSaveProgress,
}) {
  const { steps, isChecking, errorMessage } = usePedometer(true);

  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const initialProgress = useRef(savedProgress);
  const lastSavedProgress = useRef(savedProgress);
  const saveHandler = useRef(onSaveProgress);
  const isMounted = useRef(false);
  const pendingSave = useRef(null);
  const saveRequested = useRef(false);

  saveHandler.current = onSaveProgress;

  const currentProgress = Math.min(
    targetSteps,
    initialProgress.current + steps,
  );

  const latestProgress = useRef(currentProgress);
  latestProgress.current = currentProgress;

  const saveProgress = useCallback(() => {
    saveRequested.current = true;

    if (pendingSave.current) {
      return pendingSave.current;
    }

    async function savePendingProgress() {
      if (isMounted.current) {
        setIsSaving(true);
      }

      try {
        while (saveRequested.current) {
          saveRequested.current = false;

          const progressToSave = latestProgress.current;

          if (progressToSave <= lastSavedProgress.current) {
            continue;
          }

          const saved = await saveHandler.current(progressToSave);

          lastSavedProgress.current = Math.max(
            lastSavedProgress.current,
            saved,
          );

          if (isMounted.current) {
            setSaveError("");
          }
        }
      } catch (error) {
        console.error("Failed to save step progress:", error);

        if (isMounted.current) {
          setSaveError(
            "Could not save your steps. Check your connection and try again.",
          );
        }
      } finally {
        if (isMounted.current) {
          setIsSaving(false);
        }
      }
    }

    const task = savePendingProgress();
    pendingSave.current = task;

    task.finally(() => {
      if (pendingSave.current === task) {
        pendingSave.current = null;
      }
    });

    return task;
  }, []);

  useEffect(() => {
    isMounted.current = true;

    const interval = setInterval(() => {
      saveProgress();
    }, 5000);

    const appStateSubscription = AppState.addEventListener(
      "change",
      (nextState) => {
        if (nextState !== "active") {
          saveProgress();
        }
      },
    );

    return () => {
      isMounted.current = false;
      clearInterval(interval);
      appStateSubscription.remove();
      saveProgress();
    };
  }, [saveProgress]);

  useEffect(() => {
    if (currentProgress >= targetSteps) {
      saveProgress();
    }
  }, [currentProgress, targetSteps, saveProgress]);

  const message = [errorMessage, saveError].filter(Boolean).join("\n");

  return (
    <View style={styles.container}>
      <QuestProgress
        steps={currentProgress}
        targetSteps={targetSteps}
        isChecking={isChecking}
        errorMessage={message}
      />

      {saveError !== "" && (
        <AppButton
          title={isSaving ? "Saving..." : "Retry saving"}
          variant="secondary"
          disabled={isSaving}
          onPress={saveProgress}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
});