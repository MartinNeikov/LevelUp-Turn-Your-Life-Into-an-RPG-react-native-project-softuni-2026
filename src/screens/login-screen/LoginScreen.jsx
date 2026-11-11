import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import AppButton from "../../components/app-button/AppButton";
import AppInput from "../../components/app-input/AppInput";
import AuthLayout from "../../components/auth-layout/AuthLayout";
import { supabase } from "../../lib/supabase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loginHandler() {
    if (isSubmitting) {
      return;
    }

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      Alert.alert(
        "Missing information",
        "Please enter your email and password.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        Alert.alert("Login failed", error.message);
        return;
      }

      const selectedAttributes = data.user?.user_metadata?.focus_attributes;
      const hasChosenPath =
        Array.isArray(selectedAttributes) &&
        (selectedAttributes.length === 2 || selectedAttributes.length === 3);

      navigation.reset({
        index: 0,
        routes: [
          hasChosenPath
            ? { name: "Home", params: { selectedAttributes } }
            : { name: "ChoosePath" },
        ],
      });
    } catch {
      Alert.alert("Login failed", "Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Log in to continue your adventure.</Text>

      <AppInput
        label="Email"
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
      />

      <AppInput
        label="Password"
        placeholder="Enter your password"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        value={password}
        onChangeText={setPassword}
      />

      <View style={styles.actions}>
        <AppButton
          title={isSubmitting ? "Logging in..." : "Login"}
          onPress={loginHandler}
          disabled={isSubmitting}
        />
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "#A78BFA",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    color: "#9CA3AF",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 32,
  },
  actions: {
    marginTop: 12,
  },
});