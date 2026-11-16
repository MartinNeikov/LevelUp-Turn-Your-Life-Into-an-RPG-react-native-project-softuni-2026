import { StyleSheet, Text, View } from "react-native";

import AppButton from "../../components/app-button/AppButton";

function formatTarget(targetType, targetValue) {
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
  const isCompletedPersonalQuest = Boolean(quest.owner_id && completedAt);
  const isBusy = pendingAction !== null;

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
          <Text style={[styles.badge, styles.xpBadge]}>+{quest.xp} XP</Text>
        )}
      </View>

      {completedAt && (
        <Text style={styles.completed}>
          {isCompletedPersonalQuest ? `Completed · +${quest.xp} XP` : "Completed"}
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

      {canComplete && (
        <AppButton
          title={pendingAction === "complete" ? "Completing..." : "Complete Quest"}
          onPress={onComplete}
          disabled={isBusy}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1E1E30",
    borderWidth: 1,
    borderColor: "#35354D",
    borderRadius: 20,
    padding: 20,
    gap: 16,
  },
  title: {
    color: "#A78BFA",
    fontSize: 32,
    fontWeight: "bold",
  },
  description: {
    color: "#D1D5DB",
    fontSize: 16,
  },
  goalCard: {
    backgroundColor: "#12121F",
    borderRadius: 12,
    padding: 16,
    gap: 4,
  },
  goalLabel: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  goalValue: {
    color: "#F3F0FF",
    fontSize: 28,
    fontWeight: "700",
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  badge: {
    backgroundColor: "#302449",
    color: "#C4B5FD",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontWeight: "600",
  },
  xpBadge: {
    backgroundColor: "#3A2D1C",
    color: "#FCD34D",
  },
  completed: {
    color: "#86EFAC",
    fontSize: 16,
    fontWeight: "700",
  },
});