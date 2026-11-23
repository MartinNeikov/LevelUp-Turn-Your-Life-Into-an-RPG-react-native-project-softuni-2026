import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "../../theme/theme";

export default function QuestTabs({ sections, activeSectionId, onSelect }) {
  return (
    <View style={styles.tabs}>
      {sections.map((section) => {
        const isSelected = section.id === activeSectionId;

        return (
          <Pressable
            key={section.id}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onSelect(section)}
            style={[styles.tab, isSelected && styles.selectedTab]}
          >
            <Text style={[styles.label, isSelected && styles.selectedLabel]}>
              {section.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    gap: theme.spacing.xs,
    padding: theme.spacing.xs,
    borderRadius: 14,
    backgroundColor: theme.colors.tabsBackground,
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 6,
    borderRadius: 10,
  },
  selectedTab: {
    backgroundColor: theme.colors.selectedTabBackground,
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  selectedLabel: {
    color: theme.colors.textBright,
  },
});