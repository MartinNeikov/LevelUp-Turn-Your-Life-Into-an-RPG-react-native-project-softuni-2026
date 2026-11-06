import { Alert, StyleSheet, Text, View } from "react-native";
import AppButton from "../../components/app-button/AppButton";
import AppInput from "../../components/app-input/AppInput";
import AuthLayout from "../../components/auth-layout/AuthLayout";

export default function RegisterScreen({ navigation }) {
  return (
    <AuthLayout>
      <Text style={styles.title}>Create your account</Text>

      <Text style={styles.subtitle}>Your next adventure starts here.</Text>

      <AppInput
        label="Display name"
        placeholder="Enter your display name"
        autoCapitalize="words"
        autoCorrect={false}
      />

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

      <AppInput
        label="Confirm password"
        placeholder="Repeat your password"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
      />

      <View style={styles.actions}>
        <AppButton
          title="Create Account"
          onPress={() => navigation.navigate("ChoosePath")}
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
