import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppButton from "../../components/app-button/AppButton";
import { getQuests } from "../../services/questService";

export default function QuestsScreen({ navigation }) {
  const [quests, setQuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadQuests() {
      try {
        const data = await getQuests();
        setQuests(data);
      } catch (error) {
        console.error("Failed to load quests:", error);
        setErrorMessage("Could not load quests.");
      } finally {
        setIsLoading(false);
      }
    }

    loadQuests();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Text style={styles.title}>Quests</Text>

      {isLoading && <Text style={styles.message}>Loading quests...</Text>}
      {errorMessage && <Text style={styles.message}>{errorMessage}</Text>}

      {!isLoading && !errorMessage && (
        <FlatList
          data={quests}
          keyExtractor={(quest) => quest.id}
          ListEmptyComponent={
            <Text style={styles.message}>No quests available yet.</Text>
          }
          renderItem={({ item }) => (
            <AppButton
              title={item.title}
              variant="secondary"
              onPress={() =>
                navigation.navigate("QuestDetails", {
                  questId: item.id,
                  title: item.title,
                })
              }
            />
          )}
          contentContainerStyle={styles.list}
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
    gap: 12,
  },
});
