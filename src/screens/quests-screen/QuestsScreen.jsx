import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppButton from "../../components/app-button/AppButton";

export default function QuestsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Text style={styles.title}>Quests</Text>
      <AppButton
        title="Walk for 10 minutes"
        onPress={() =>
          navigation.navigate("QuestDetails", {
            questId: "walk-10",
            title: "Walk for 10 minutes",
          })
        }
      />
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
  },
});
