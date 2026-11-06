import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppButton from "../../components/app-button/AppButton";

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>LevelUp</Text>
      <Text style={styles.subtitle}>Turn Your Life Into an RPG</Text>

      <Text style={styles.description}>
        Complete quests, earn XP, and level up your everyday life.
      </Text>

      <View style={styles.actions}>
        <AppButton
          title="Create Account"
          onPress={() => navigation.navigate("Register")}
        />

        <AppButton
          title="Login"
          variant="secondary"
          onPress={() => navigation.navigate("Login")}
        />
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
});
