import { Pressable, StyleSheet, Text, View } from "react-native";

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
    gap: 4,
    padding: 4,
    borderRadius: 14,
    backgroundColor: "#1C1A2B",
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 4,
    paddingVertical: 6,
    borderRadius: 10,
  },
  selectedTab: {
    backgroundColor: "#382A53",
  },
  label: {
    color: "#B6AEC8",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  selectedLabel: {
    color: "#F3EAFF",
  },
});