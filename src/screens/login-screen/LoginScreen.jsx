import { Alert, StyleSheet, Text, View } from "react-native";
import AppButton from "../../components/app-button/AppButton";
import AppInput from "../../components/app-input/AppInput";
import AuthLayout from "../../components/auth-layout/AuthLayout";

export default function LoginScreen() {
  return (
    <AuthLayout>
      <Text style={styles.title}>Welcome back</Text>

      <Text style={styles.subtitle}>
        Log in to continue your adventure.
      </Text>

      <AppInput
        label="Email"
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <AppInput
        label="Password"
        placeholder="Enter your password"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
      />

      <View style={styles.actions}>
        <AppButton
          title="Login"
          onPress={() =>
            Alert.alert("Login", "Authentication is coming soon.")
          }
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