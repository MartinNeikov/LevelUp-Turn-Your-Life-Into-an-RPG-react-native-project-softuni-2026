import { StyleSheet, Switch, Text, View } from "react-native";

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
        trackColor={{ false: "#45455E", true: "#A78BFA" }}
        thumbColor="#FFFFFF"
        accessibilityLabel={`Focus on ${title}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    backgroundColor: "#1E1E30",
    borderWidth: 1,
    borderColor: "#45455E",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    color: "#D1D5DB",
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    color: "#9CA3AF",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
});