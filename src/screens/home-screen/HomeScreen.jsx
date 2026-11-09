import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen({ route }) {
  const selectedAttributes = route.params?.selectedAttributes ?? [];
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Adventure</Text>
      {selectedAttributes.length > 0 && (
        <View style={styles.focusSection}>
          <Text style={styles.focusLabel}>Your Focus</Text>

          <View style={styles.focusList}>
            {selectedAttributes.map((attribute) => (
              <View key={attribute} style={styles.focusBadge}>
                <Text style={styles.focusBadgeText}>{attribute}</Text>
              </View>
            ))}
          </View>
        </View>
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
  },
  focusSection: {
    marginTop: 20,
  },
  focusLabel: {
    color: "#D1D5DB",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  focusList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  focusBadge: {
    backgroundColor: "#251D3A",
    borderWidth: 1,
    borderColor: "#57447A",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  focusBadgeText: {
    color: "#C4B5FD",
    fontSize: 14,
    fontWeight: "600",
  },
});
