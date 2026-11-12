import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppButton from "../../components/app-button/AppButton";
import { getDailyQuests } from "../../services/questService";

export default function QuestsScreen({ navigation }) {
  const [quests, setQuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadQuests = useCallback(async () => {
    setErrorMessage("");

    try {
      const data = await getDailyQuests();
      setQuests(data);
    } catch (error) {
      console.error("Failed to load quests:", error);
      setErrorMessage("Could not load quests. Pull down to try again.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadQuests();
  }, [loadQuests]);

  function refreshHandler() {
    setIsRefreshing(true);
    loadQuests();
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Text style={styles.title}>Quests</Text>

      {isLoading && <Text style={styles.message}>Loading quests...</Text>}

      {errorMessage !== "" && (
        <Text style={styles.message}>{errorMessage}</Text>
      )}

      {!isLoading && (
        <FlatList
          data={quests}
          keyExtractor={(quest) => quest.quest_id}
          refreshing={isRefreshing}
          onRefresh={refreshHandler}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            errorMessage ? null : (
              <Text style={styles.message}>No quests available yet.</Text>
            )
          }
          renderItem={({ item }) => (
            <AppButton
              title={item.title}
              variant="secondary"
              onPress={() =>
                navigation.navigate("QuestDetails", {
                  questId: item.quest_id,
                  questDate: item.quest_date,
                  title: item.title,
                })
              }
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#12121F",
    padding: 24,
  },
  title: {
    color: "#A78BFA",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
  },
  message: {
    color: "#D1D5DB",
    fontSize: 16,
  },
  list: {
    flexGrow: 1,
    gap: 12,
  },
});
