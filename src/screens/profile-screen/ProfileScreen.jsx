import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppButton from "../../components/app-button/AppButton";
import { supabase } from "../../lib/supabase";

export default function ProfileScreen({ navigation }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      const { error } = await supabase.auth.signOut({ scope: "local" });

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
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.actions}>
        <AppButton
          title={isLoggingOut ? "Logging out..." : "Logout"}
          variant="secondary"
          onPress={handleLogout}
          disabled={isLoggingOut}
        />
      </View>
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
  actions: {
    marginTop: 24,
  },
});