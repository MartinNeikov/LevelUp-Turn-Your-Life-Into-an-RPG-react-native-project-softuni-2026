import { useState } from "react";
import { Alert, Text, View } from "react-native";

import { login } from "../../api/auth/login/login";
import AppButton from "../../components/app-button/AppButton";
import AppInput from "../../components/app-input/AppInput";
import AuthLayout from "../../layouts/auth-layout/AuthLayout";
import { commonStyles } from "../../theme/commonStyles";

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
      const { data, error } = await login({
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
      <Text style={commonStyles.formTitle}>Welcome back</Text>

      <Text style={commonStyles.formSubtitle}>
        Log in to continue your adventure.
      </Text>

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

      <View style={commonStyles.formActions}>
        <AppButton
          title={isSubmitting ? "Logging in..." : "Login"}
          onPress={loginHandler}
          disabled={isSubmitting}
        />
      </View>
    </AuthLayout>
  );
}

