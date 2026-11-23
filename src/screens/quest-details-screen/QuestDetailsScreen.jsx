import { useIsFocused } from "@react-navigation/native";
import { Alert, ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import StepQuestTracker from "../../components/quest-progress/StepQuestTracker";
import QuestDetailsCard from "./QuestDetailsCard";
import useQuestDetails from "./useQuestDetails";
import { commonStyles } from "../../theme/commonStyles";
import { theme } from "../../theme/theme";

export default function QuestDetailsScreen({ route, navigation }) {
  const questId = route.params?.questId;
  const questDate = route.params?.questDate;
  const isFocused = useIsFocused();

  const {
    quest,
    isLoading,
    errorMessage,
    isStepQuest,
    startedAt,
    completedAt,
    savedProgress,
    canManage,
    canStart,
    canComplete,
    pendingAction,
    handleStartQuest,
    handleSaveProgress,
    handleCompleteQuest,
    handleDeleteQuest,
  } = useQuestDetails(questId, questDate);

  const showStepTracker =
    isFocused &&
    !isLoading &&
    isStepQuest &&
    Boolean(startedAt) &&
    !completedAt;

  function handleEditQuest() {
    if (!canManage || pendingAction) return;

    navigation.navigate("CreateQuest", {
      quest: {
        id: quest.id,
        title: quest.title,
        description: quest.description,
        attribute: quest.attribute,
        target_type: quest.target_type,
        target_value: quest.target_value,
      },
    });
  }

  function confirmDeleteQuest() {
    if (!canManage || pendingAction) return;

    Alert.alert(
      "Delete quest?",
      "This will permanently delete this quest.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const deleted = await handleDeleteQuest();

            if (deleted && navigation.isFocused()) {
              navigation.goBack();
            }
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView style={commonStyles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        {isLoading ? (
          <Text style={styles.message}>Loading quest...</Text>
        ) : quest ? (
          <>
            <QuestDetailsCard
              quest={quest}
              completedAt={completedAt}
              canManage={canManage}
              canStart={canStart}
              canComplete={canComplete}
              pendingAction={pendingAction}
              onStart={handleStartQuest}
              onComplete={handleCompleteQuest}
              onEdit={handleEditQuest}
              onDelete={confirmDeleteQuest}
            />

            {showStepTracker && (
              <StepQuestTracker
                key={`${questId}-${questDate ?? "personal"}`}
                targetSteps={quest.target_value}
                savedProgress={savedProgress}
                onSaveProgress={handleSaveProgress}
              />
            )}
          </>
        ) : (
          <Text style={styles.message}>
            {errorMessage || "Quest not found."}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  message: {
    color: theme.colors.text,
    fontSize: theme.fontSize.body,
  },
});