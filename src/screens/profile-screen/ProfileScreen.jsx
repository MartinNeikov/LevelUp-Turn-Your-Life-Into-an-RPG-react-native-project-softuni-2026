import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { logout } from "../../api/auth/logout/logout";
import AppButton from "../../components/app-button/AppButton";
import { commonStyles } from "../../theme/commonStyles";
import { theme } from "../../theme/theme";

export default function ProfileScreen({ navigation }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function logoutHandler() {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      const { error } = await logout();

      if (error) {
        Alert.alert("Logout failed", error.message);
        return;
      }

      navigation.getParent().reset({
        index: 0,
        routes: [{ name: "Welcome" }],
      });
    } catch {
      Alert.alert("Logout failed", "Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <SafeAreaView
      style={[commonStyles.screen, styles.container]}
      edges={["top", "left", "right"]}
    >
      <Text style={styles.title}>Profile</Text>

      <View style={styles.actions}>
        <AppButton
          title={isLoggingOut ? "Logging out..." : "Logout"}
          variant="secondary"
          onPress={logoutHandler}
          disabled={isLoggingOut}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.xl,
  },
  title: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.title,
    fontWeight: "bold",
  },
  actions: {
    marginTop: theme.spacing.xl,
  },
});
