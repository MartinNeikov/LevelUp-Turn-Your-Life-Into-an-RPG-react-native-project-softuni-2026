import { StyleSheet, Text, View } from "react-native";

import AppButton from "../../components/app-button/AppButton";
import { theme } from "../../theme/theme";

function formatTarget(targetType, targetValue) {
  if (targetType === "steps") {
    return `${targetValue} steps`;
  }

  if (targetType === "duration") {
    return targetValue % 60 === 0
      ? `${targetValue / 60} min`
      : `${targetValue} sec`;
  }

  if (targetType === "distance") {
    return targetValue >= 1000
      ? `${targetValue / 1000} km`
      : `${targetValue} m`;
  }

  return "";
}

export default function QuestDetailsCard({
  quest,
  completedAt,
  canManage,
  canStart,
  canComplete,
  pendingAction,
  onStart,
  onComplete,
  onEdit,
  onDelete,
}) {
  const target = formatTarget(quest.target_type, quest.target_value);
  const isStepQuest = quest.target_type === "steps";
  const isCompletedPersonalQuest = Boolean(quest.owner_id && completedAt);
  const isBusy = pendingAction !== null;

  const showCompleteButton =
    canComplete || (isStepQuest && !canStart && !completedAt);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{quest.title}</Text>
      <Text style={styles.description}>{quest.description}</Text>

      {target !== "" && (
        <View style={styles.goalCard}>
          <Text style={styles.goalLabel}>Goal</Text>
          <Text style={styles.goalValue}>{target}</Text>
        </View>
      )}

      <View style={styles.badges}>
        <Text style={styles.badge}>{quest.attribute}</Text>

        {!isCompletedPersonalQuest && (
          <Text style={[styles.badge, styles.xpBadge]}>
            +{quest.xp} XP
          </Text>
        )}
      </View>

      {completedAt && (
        <Text style={styles.completed}>
          {isCompletedPersonalQuest
            ? `Completed · +${quest.xp} XP`
            : "Completed"}
        </Text>
      )}

      {canStart && (
        <AppButton
          title={pendingAction === "start" ? "Starting..." : "Start Quest"}
          onPress={onStart}
          disabled={isBusy}
        />
      )}

      {canManage && (
        <>
          <AppButton
            title="Edit Quest"
            variant="secondary"
            onPress={onEdit}
            disabled={isBusy}
          />

          <AppButton
            title={pendingAction === "delete" ? "Deleting..." : "Delete Quest"}
            variant="secondary"
            onPress={onDelete}
            disabled={isBusy}
          />
        </>
      )}

      {showCompleteButton && (
        <>
          <AppButton
            title={
              pendingAction === "complete"
                ? "Completing..."
                : "Complete Quest"
            }
            onPress={onComplete}
            disabled={isBusy || !canComplete}
          />

          {isStepQuest && !canComplete && (
            <Text style={styles.hint}>
              Reach the step goal and save your progress to complete this quest.
            </Text>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    borderRadius: theme.radius.xl,
    padding: 20,
    gap: theme.spacing.lg,
  },
  title: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.title,
    fontWeight: "bold",
  },
  description: {
    color: theme.colors.text,
    fontSize: theme.fontSize.body,
    lineHeight: 24,
  },
  goalCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    gap: theme.spacing.xs,
  },
  goalLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.small,
  },
  goalValue: {
    color: theme.colors.textBright,
    fontSize: 28,
    fontWeight: "700",
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  badge: {
    backgroundColor: theme.colors.badgeBackground,
    color: theme.colors.badgeText,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    fontWeight: "600",
  },
  xpBadge: {
    backgroundColor: theme.colors.xpBadgeBackground,
    color: theme.colors.xp,
  },
  completed: {
    color: theme.colors.success,
    fontSize: theme.fontSize.body,
    fontWeight: "700",
  },
  hint: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.small,
    lineHeight: 20,
  },
});