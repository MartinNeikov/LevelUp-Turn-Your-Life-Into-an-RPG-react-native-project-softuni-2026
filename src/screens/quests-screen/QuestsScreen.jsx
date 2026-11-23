import { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  getDailyQuests,
  getFinishedQuests,
  getPersonalQuests,
} from "../../services/questService";
import QuestCard from "./QuestCard";
import QuestTabs from "./QuestTabs";
import { commonStyles } from "../../theme/commonStyles";
import { theme } from "../../theme/theme";

const SECTIONS = [
  { id: "daily", label: "Daily Quests", empty: "You're all caught up." },
  {
    id: "personal",
    label: "Personal Quests",
    empty: "No personal quests yet.",
  },
  {
    id: "finished",
    label: "Finished Quests",
    empty: "No quests finished in the last 7 days.",
  },
];

export default function QuestsScreen({ navigation }) {
  const [activeSection, setActiveSection] = useState(SECTIONS[0]);
  const [quests, setQuests] = useState({
    daily: [],
    personal: [],
    finished: [],
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const requestId = useRef(0);

  const loadQuests = useCallback(async () => {
    const currentRequest = ++requestId.current;

    const results = await Promise.allSettled([
      getDailyQuests(),
      getPersonalQuests(),
      getFinishedQuests(),
    ]);

    if (currentRequest !== requestId.current) return;

    const loadedQuests = {};
    const nextErrors = {};

    SECTIONS.forEach(({ id }, index) => {
      const result = results[index];

      if (result.status === "fulfilled") {
        loadedQuests[id] = result.value;
      } else {
        console.error(`Failed to load ${id} quests:`, result.reason);
        nextErrors[id] = "Could not load quests. Pull down to try again.";
      }
    });

    setQuests((previous) => ({ ...previous, ...loadedQuests }));
    setErrors(nextErrors);
    setIsLoading(false);
    setIsRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setIsRefreshing(false);
      loadQuests();

      return () => {
        requestId.current += 1;
      };
    }, [loadQuests]),
  );

  const isDaily = activeSection.id === "daily";
  const isFinished = activeSection.id === "finished";
  const pendingDaily = quests.daily.filter((quest) => !quest.completed_at);
  const completedToday = quests.daily.length - pendingDaily.length;
  const visibleQuests = isDaily ? pendingDaily : quests[activeSection.id];
  const errorMessage = errors[activeSection.id];

  function handleRefresh() {
    setIsRefreshing(true);
    loadQuests();
  }

  function handleCreateQuest() {
    setActiveSection(SECTIONS[1]);
    navigation.navigate("CreateQuest");
  }

  function openQuest(quest) {
    navigation.navigate("QuestDetails", {
      questId: quest.quest_id ?? quest.id,
      questDate: quest.quest_date,
      title: quest.title,
    });
  }

  return (
    <SafeAreaView
      style={[commonStyles.screen, styles.container]}
      edges={["top", "left", "right"]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Quests</Text>

        <Pressable
          accessibilityRole="button"
          onPress={handleCreateQuest}
          style={({ pressed }) => [
            styles.createButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.createLabel}>＋ Create Quest</Text>
        </Pressable>
      </View>

      <QuestTabs
        sections={SECTIONS}
        activeSectionId={activeSection.id}
        onSelect={setActiveSection}
      />

      <FlatList
        key={activeSection.id}
        data={isLoading ? [] : visibleQuests}
        keyExtractor={(quest) =>
          quest.quest_id ? `${quest.quest_date}-${quest.quest_id}` : quest.id
        }
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            {isDaily && quests.daily.length > 0 && (
              <Text style={styles.message}>
                {completedToday} / {quests.daily.length} completed
              </Text>
            )}
            {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
          </>
        }
        ListEmptyComponent={
          errorMessage ? null : (
            <Text style={styles.message}>
              {isLoading ? "Loading quests..." : activeSection.empty}
            </Text>
          )
        }
        renderItem={({ item }) => (
          <QuestCard
            quest={item}
            showCompletion={isFinished}
            onPress={() => openQuest(item)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md,
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    color: theme.colors.textBright,
    fontSize: theme.fontSize.title,
    fontWeight: "700",
  },
  createButton: {
    justifyContent: "center",
    minHeight: 44,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.primary,
  },
  createLabel: {
    color: theme.colors.onPrimary,
    fontSize: theme.fontSize.small,
    fontWeight: "700",
  },
  list: {
    flexGrow: 1,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    gap: 10,
  },
  message: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.small,
  },
  error: {
    color: theme.colors.error,
    fontSize: theme.fontSize.small,
  },
  pressed: {
    opacity: 0.8,
  },
});
