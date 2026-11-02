import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppButton from "../app-button/AppButton";
import AppInput from "../app-input/AppInput";

export default function RegisterScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            <Text style={styles.title}>Create your account</Text>

            <Text style={styles.subtitle}>
              Your next adventure starts here.
            </Text>

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
                onPress={() =>
                  Alert.alert("Register", "Registration is coming soon.")
                }
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#12121F",
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  form: {
    width: "100%",
    maxWidth: 360,
  },
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
