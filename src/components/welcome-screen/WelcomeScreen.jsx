import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>LevelUp</Text>
      <Text style={styles.subtitle}>Turn Your Life Into an RPG</Text>

      <Text style={styles.description}>
        Complete quests, earn XP, and level up your everyday life.
      </Text>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.primaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() =>
            Alert.alert("Register", "Your adventure starts soon!")
          }
        >
          <Text style={styles.primaryButtonText}>Create Account</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.secondaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => Alert.alert("Login", "Welcome back, adventurer!")}
        >
          <Text style={styles.secondaryButtonText}>Login</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#12121F",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    color: "#A78BFA",
    fontSize: 42,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#D1D5DB",
    fontSize: 18,
    textAlign: "center",
    marginTop: 12,
  },
  description: {
    color: "#9CA3AF",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginTop: 24,
    maxWidth: 320,
  },
  actions: {
    width: "100%",
    maxWidth: 320,
    marginTop: 32,
    gap: 12,
  },
  button: {
    minHeight: 52,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: "#A78BFA",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#A78BFA",
  },
  primaryButtonText: {
    color: "#12121F",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButtonText: {
    color: "#A78BFA",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonPressed: {
    opacity: 0.7,
  },
});