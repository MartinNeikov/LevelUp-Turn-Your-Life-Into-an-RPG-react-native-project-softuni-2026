import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import AppButton from "../../components/app-button/AppButton";
import AppInput from "../../components/app-input/AppInput";
import AuthLayout from "../../components/auth-layout/AuthLayout";
import { supabase } from "../../lib/supabase";

export default function RegisterScreen({ navigation }) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegister() {
    if (isSubmitting) {
      return;
    }

    const trimmedName = displayName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !password || !confirmPassword) {
      Alert.alert("Missing information", "Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Passwords do not match",
        "Please enter the same password twice.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            display_name: trimmedName,
          },
        },
      });

      if (error) {
        Alert.alert("Registration failed", error.message);
        return;
      }

      if (data.session) {
        const { error: signOutError } = await supabase.auth.signOut({
          scope: "local",
        });

        if (signOutError) {
          Alert.alert(
            "Account created",
            "Could not end the automatic session. Please restart the app.",
          );
          return;
        }

        navigation.replace("Login");
        return;
      }

      Alert.alert(
        "Check your email",
        "Confirm your email address before logging in.",
        [{ text: "OK", onPress: () => navigation.replace("Login") }],
      );
    } catch {
      Alert.alert("Registration failed", "Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <Text style={styles.title}>Create your account</Text>
      <Text style={styles.subtitle}>Your next adventure starts here.</Text>

      <AppInput
        label="Display name"
        placeholder="Enter your display name"
        autoCapitalize="words"
        autoCorrect={false}
        value={displayName}
        onChangeText={setDisplayName}
      />

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

      <AppInput
        label="Confirm password"
        placeholder="Repeat your password"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <View style={styles.actions}>
        <AppButton
          title={isSubmitting ? "Creating account..." : "Create Account"}
          onPress={handleRegister}
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