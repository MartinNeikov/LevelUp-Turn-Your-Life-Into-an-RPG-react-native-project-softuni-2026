import { StyleSheet, Text, View } from "react-native";

import { theme } from "../../theme/theme";

export default function QuestProgress({
  steps,
  targetSteps,
  isChecking,
  errorMessage,
}) {
  const safeTarget = Math.max(1, targetSteps);
  const progress = Math.min(Math.max(steps / safeTarget, 0), 1);
  const percentage = Math.floor(progress * 100);
  const isCompleted = steps >= safeTarget;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Walking progress</Text>
        <Text style={styles.percentage}>{percentage}%</Text>
      </View>

      <View
        style={styles.track}
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel="Walking quest progress"
        accessibilityValue={{
          min: 0,
          max: safeTarget,
          now: Math.min(steps, safeTarget),
        }}
      >
        <View
          style={[
            styles.fill,
            { width: `${progress * 100}%` },
            isCompleted && styles.completedFill,
          ]}
        />
      </View>

      <Text style={styles.steps}>
        {steps} / {safeTarget} steps
      </Text>

      {isChecking && (
        <Text style={styles.message}>Checking step counter...</Text>
      )}

      {errorMessage !== "" && (
        <Text style={styles.error}>{errorMessage}</Text>
      )}

      {!isChecking && !errorMessage && (
        <Text style={styles.message}>
          {isCompleted
            ? "Goal reached! You can complete your quest."
            : "Keep the app open while walking to count your steps."}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  label: {
    color: theme.colors.text,
    fontSize: theme.fontSize.body,
    fontWeight: "600",
    flex: 1,
  },
  percentage: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.body,
    fontWeight: "700",
  },
  track: {
    height: 12,
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
  },
  completedFill: {
    backgroundColor: theme.colors.success,
  },
  steps: {
    color: theme.colors.textBright,
    fontSize: theme.fontSize.subtitle,
    fontWeight: "700",
  },
  message: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.small,
    lineHeight: 20,
  },
  error: {
    color: theme.colors.error,
    fontSize: theme.fontSize.small,
    lineHeight: 20,
  },
});