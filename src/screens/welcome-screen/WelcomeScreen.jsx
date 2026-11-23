import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppButton from "../../components/app-button/AppButton";
import { commonStyles } from "../../theme/commonStyles";
import { theme } from "../../theme/theme";

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={[commonStyles.screen, styles.container]}>
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
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.xl,
  },
  title: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.brand,
    fontWeight: "bold",
  },
  subtitle: {
    color: theme.colors.text,
    fontSize: theme.fontSize.subtitle,
    textAlign: "center",
    marginTop: theme.spacing.md,
  },
  description: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.body,
    textAlign: "center",
    lineHeight: 24,
    marginTop: theme.spacing.xl,
    maxWidth: 320,
  },
  actions: {
    width: "100%",
    maxWidth: 320,
    marginTop: theme.spacing.xxl,
    gap: theme.spacing.md,
  },
});
