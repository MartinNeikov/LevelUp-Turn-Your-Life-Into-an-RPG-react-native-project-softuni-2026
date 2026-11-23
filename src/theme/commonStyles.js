import { StyleSheet } from "react-native";

import { theme } from "./theme";

export const commonStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  formTitle: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.title,
    fontWeight: "bold",
    textAlign: "center",
  },
  formSubtitle: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.body,
    lineHeight: 24,
    textAlign: "center",
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xxl,
  },
  formActions: {
    marginTop: theme.spacing.md,
  },
});