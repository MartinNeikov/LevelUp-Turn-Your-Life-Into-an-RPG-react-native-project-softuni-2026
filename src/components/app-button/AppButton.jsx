import { Pressable, StyleSheet, Text } from "react-native";

import { theme } from "../../theme/theme"

export default function AppButton({
  title,
  onPress,
  variant = "primary",
  disabled = false,
}) {
  const isSecondary = variant === "secondary";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isSecondary ? styles.secondaryButton : styles.primaryButton,
        pressed && styles.buttonPressed,
        disabled && styles.buttonDisabled,
      ]}
    >
      <Text
        style={[
          styles.text,
          isSecondary ? styles.secondaryText : styles.primaryText,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  text: {
    fontSize: theme.fontSize.body,
    fontWeight: "bold",
  },
  primaryText: {
    color: theme.colors.onPrimary,
  },
  secondaryText: {
    color: theme.colors.primary,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
});