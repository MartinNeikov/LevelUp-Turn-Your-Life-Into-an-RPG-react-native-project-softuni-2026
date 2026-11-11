import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getQuestById } from "../../services/questService";

export default function QuestDetailsScreen({ route }) {
  const questId = route.params?.questId;
  const [quest, setQuest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadQuest() {
      setIsLoading(true);
      setErrorMessage("");
      setQuest(null);

      try {
        const data = questId ? await getQuestById(questId) : null;

        if (isActive) {
          setQuest(data);
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
  }, [questId]);

  let target = "";

  if (quest?.target_type === "duration") {
    const seconds = quest.target_value;
    target = seconds % 60 === 0 ? `${seconds / 60} min` : `${seconds} sec`;
  }

  if (quest?.target_type === "distance") {
    const meters = quest.target_value;
    target = meters >= 1000 ? `${meters / 1000} km` : `${meters} m`;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {isLoading && <Text style={styles.text}>Loading quest...</Text>}

        {!isLoading && errorMessage !== "" && (
          <Text style={styles.text}>{errorMessage}</Text>
        )}

        {!isLoading && !errorMessage && !quest && (
          <Text style={styles.text}>Quest not found.</Text>
        )}

        {quest && (
          <View style={styles.questCard}>
            <Text style={styles.title}>{quest.title}</Text>
            <Text style={styles.text}>{quest.description}</Text>

            {target !== "" && (
              <View style={styles.goalCard}>
                <Text style={styles.goalLabel}>Goal</Text>
                <Text style={styles.goalValue}>{target}</Text>
              </View>
            )}

            <View style={styles.badges}>
              <Text style={styles.badge}>{quest.attribute}</Text>
              <Text style={[styles.badge, styles.xpBadge]}>+{quest.xp} XP</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#12121F",
  },
  content: {
    padding: 24,
    gap: 12,
  },
  title: {
    color: "#A78BFA",
    fontSize: 32,
    fontWeight: "bold",
  },
  text: {
    color: "#D1D5DB",
    fontSize: 16,
  },
  questCard: {
    backgroundColor: "#1E1E30",
    borderWidth: 1,
    borderColor: "#35354D",
    borderRadius: 20,
    padding: 20,
    gap: 16,
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
});
