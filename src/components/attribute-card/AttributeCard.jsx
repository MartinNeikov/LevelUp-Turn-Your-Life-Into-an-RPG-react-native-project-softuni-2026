import { StyleSheet, Switch, Text, View } from "react-native";

import { theme } from "../../theme/theme";

export default function AttributeCard({
  title,
  description,
  value,
  onValueChange,
  disabled = false,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          false: theme.colors.border,
          true: theme.colors.primary,
        }}
        thumbColor={theme.colors.inputText}
        accessibilityLabel={`Focus on ${title}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  info: {
    flex: 1,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.fontSize.subtitle,
    fontWeight: "bold",
  },
  description: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.small,
    lineHeight: 20,
    marginTop: 6,
  },
});