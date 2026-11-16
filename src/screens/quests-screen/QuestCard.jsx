import { Pressable, StyleSheet, Text, View } from "react-native";

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
      <Text style={styles.chevron} accessible={false}>›</Text>
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
    borderColor: "#373149",
    backgroundColor: "#1E1E30",
  },
  body: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: "#F3F0FF",
    fontSize: 16,
    fontWeight: "700",
  },
  attribute: {
    color: "#C4B5FD",
    fontSize: 13,
  },
  completed: {
    color: "#86EFAC",
    fontSize: 12,
  },
  xp: {
    color: "#FCD34D",
    fontSize: 13,
    fontWeight: "700",
  },
  chevron: {
    color: "#B6AEC8",
    fontSize: 24,
  },
  pressed: {
    opacity: 0.8,
  },
});