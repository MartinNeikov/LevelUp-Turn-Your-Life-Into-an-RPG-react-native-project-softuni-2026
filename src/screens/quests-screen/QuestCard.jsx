import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "../../theme/theme";

export default function QuestCard({ quest, showCompletion, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.body}>
        <Text style={styles.title}>{quest.title}</Text>

        {quest.attribute && (
          <Text style={styles.attribute}>{quest.attribute}</Text>
        )}

        {showCompletion && (
          <Text style={styles.completed}>✓ Completed · {quest.quest_date}</Text>
        )}
      </View>

      {quest.xp != null && <Text style={styles.xp}>+{quest.xp} XP</Text>}
      <Text style={styles.chevron} accessible={false}></Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    backgroundColor: theme.colors.surface,
  },
  body: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  title: {
    color: theme.colors.textBright,
    fontSize: theme.fontSize.body,
    fontWeight: "700",
  },
  attribute: {
    color: theme.colors.badgeText,
    fontSize: 13,
  },
  completed: {
    color: theme.colors.success,
    fontSize: theme.fontSize.caption,
  },
  xp: {
    color: theme.colors.xp,
    fontSize: 13,
    fontWeight: "700",
  },
  chevron: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.heading,
  },
  pressed: {
    opacity: 0.8,
  },
});
