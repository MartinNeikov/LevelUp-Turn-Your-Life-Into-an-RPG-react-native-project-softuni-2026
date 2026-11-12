import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppButton from "../../components/app-button/AppButton";
import {
  completeDailyQuest,
  getDailyQuestStatus,
  getQuestById,
} from "../../services/questService";

export default function QuestDetailsScreen({ route }) {
  const questId = route.params?.questId;
  const questDate = route.params?.questDate;
  const [dailyQuest, setDailyQuest] = useState(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [quest, setQuest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadQuest() {
      setIsLoading(true);
      setErrorMessage("");
      setQuest(null);
      setDailyQuest(null);

      try {
        const [questData, dailyQuestData] = await Promise.all([
          questId ? getQuestById(questId) : null,
          questId && questDate ? getDailyQuestStatus(questId, questDate) : null,
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
  }, [questId, questDate]);
  async function handleCompleteQuest() {
    if (!dailyQuest || dailyQuest.completed_at || isCompleting) {
      return;
    }

    setIsCompleting(true);

    try {
      const completedAt = await completeDailyQuest(questId, questDate);
      setDailyQuest({ completed_at: completedAt });
    } catch (error) {
      Alert.alert("Could not complete quest", error.message);
    } finally {
      setIsCompleting(false);
    }
  }

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
            {dailyQuest?.completed_at ? (
              <Text style={styles.text}>Completed</Text>
            ) : dailyQuest &&
              quest.target_type == null &&
              quest.target_value == null ? (
              <AppButton
                title={isCompleting ? "Completing..." : "Complete Quest"}
                onPress={handleCompleteQuest}
                disabled={isCompleting}
              />
            ) : null}

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
