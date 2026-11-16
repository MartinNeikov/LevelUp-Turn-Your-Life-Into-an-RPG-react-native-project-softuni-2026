import { Alert, ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import QuestDetailsCard from "./QuestDetailsCard";
import useQuestDetails from "./useQuestDetails";

export default function QuestDetailsScreen({ route, navigation }) {
  const questId = route.params?.questId;
  const questDate = route.params?.questDate;

  const {
    quest,
    isLoading,
    errorMessage,
    completedAt,
    canManage,
    canStart,
    canComplete,
    pendingAction,
    handleStartQuest,
    handleCompleteQuest,
    handleDeleteQuest,
  } = useQuestDetails(questId, questDate);

  function handleEditQuest() {
    if (!canManage || pendingAction) return;

    navigation.navigate("CreateQuest", {
      quest: {
        id: quest.id,
        title: quest.title,
        description: quest.description,
        attribute: quest.attribute,
      },
    });
  }

  function confirmDeleteQuest() {
    if (!canManage || pendingAction) return;

    Alert.alert("Delete quest?", "This will permanently delete this quest.", [
      { text: "Cancel", style: "cancel" },
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
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {isLoading ? (
          <Text style={styles.message}>Loading quest...</Text>
        ) : quest ? (
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
        ) : (
          <Text style={styles.message}>{errorMessage || "Quest not found."}</Text>
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
  message: {
    color: "#D1D5DB",
    fontSize: 16,
  },
});