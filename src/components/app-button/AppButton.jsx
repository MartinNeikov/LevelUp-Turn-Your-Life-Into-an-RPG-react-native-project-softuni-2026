import { Pressable, StyleSheet, Text } from "react-native";

export default function AppButton({
  title,
  onPress,
  variant = "primary",
}) {
  const isSecondary = variant === "secondary";

  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        isSecondary ? styles.secondaryButton : styles.primaryButton,
        pressed && styles.buttonPressed,
      ]}
      onPress={onPress}
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
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: "#A78BFA",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#A78BFA",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  primaryText: {
    color: "#12121F",
  },
  secondaryText: {
    color: "#A78BFA",
  },
  buttonPressed: {
    opacity: 0.7,
  },
});