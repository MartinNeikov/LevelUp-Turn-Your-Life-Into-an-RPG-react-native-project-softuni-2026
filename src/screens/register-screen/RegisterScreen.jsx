import { useState } from "react";
import { Alert, Text, View } from "react-native";

import AppButton from "../../components/app-button/AppButton";
import AppInput from "../../components/app-input/AppInput";
import AuthLayout from "../../layouts/auth-layout/AuthLayout";

import { register } from "../../api/auth/register/register";
import { logout } from "../../api/auth/logout/logout";
import { validateRegistration } from "../../validation/registerValidation";
import { commonStyles } from "../../theme/commonStyles";

export default function RegisterScreen({ navigation }) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function registerHandler() {
    if (isSubmitting) {
      return;
    }

    const trimmedName = displayName.trim();
    const trimmedEmail = email.trim();

    const validationError = validateRegistration({
      displayName: trimmedName,
      email: trimmedEmail,
      password,
      confirmPassword,
    });

    if (validationError) {
      Alert.alert(validationError.title, validationError.message);
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await register({
        displayName: trimmedName,
        email: trimmedEmail,
        password,
      });

      if (error) {
        Alert.alert("Registration failed", error.message);
        return;
      }

      if (data.session) {
        const { error: signOutError } = await logout();

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
      <Text style={commonStyles.formTitle}>Create your account</Text>

      <Text style={commonStyles.formSubtitle}>
        Your next adventure starts here.
      </Text>

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

      <View style={commonStyles.formActions}>
        <AppButton
          title={isSubmitting ? "Creating account..." : "Create Account"}
          onPress={registerHandler}
          disabled={isSubmitting}
        />
      </View>
    </AuthLayout>
  );
}

