import { StyleSheet, Text, TextInput, View } from "react-native";

import { theme } from "../../theme/theme.js";

export default function AppInput({ label, ...inputProps }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        placeholderTextColor={theme.colors.textMuted}
        {...inputProps}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    color: theme.colors.text,
    fontSize: theme.fontSize.body,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.surface,
    color: theme.colors.inputText,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 14,
    fontSize: theme.fontSize.body,
  },
});