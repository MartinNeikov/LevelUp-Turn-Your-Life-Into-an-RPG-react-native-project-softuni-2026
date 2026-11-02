import { StyleSheet, Text, TextInput, View } from "react-native";

export default function AppInput({ label, ...inputProps }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        placeholderTextColor="#9CA3AF"
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
    color: "#D1D5DB",
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#1E1E30",
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#45455E",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
});