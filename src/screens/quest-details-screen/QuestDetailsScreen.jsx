import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function QuestDetailsScreen({ route }) {
  const { questId, title } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>Quest ID: {questId}</Text>
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
  description: {
    color: "#D1D5DB",
    fontSize: 16,
    marginTop: 12,
  },
});