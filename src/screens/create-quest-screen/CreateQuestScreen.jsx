import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { Alert, StyleSheet, Text, View } from "react-native";

import AppButton from "../../components/app-button/AppButton";
import AppInput from "../../components/app-input/AppInput";
import AuthLayout from "../../layouts/auth-layout/AuthLayout";
import { createPersonalQuest } from "../../services/questService";

const ATTRIBUTES = [
  "Strength",
  "Intelligence",
  "Discipline",
  "Endurance",
  "Charisma",
  "Creativity",
];

export default function CreateQuestScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attribute, setAttribute] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const canSave = Boolean(
    title.trim() && description.trim() && ATTRIBUTES.includes(attribute),
  );

  async function handleSave() {
    if (!canSave || isSaving) return;

    setIsSaving(true);

    try {
      await createPersonalQuest({ title, description, attribute });
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Could not save quest",
        error.message || "Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AuthLayout>
      <Text style={styles.title}>Create Quest</Text>

      <AppInput
        label="Title"
        placeholder="Enter a quest title"
        value={title}
        onChangeText={setTitle}
        editable={!isSaving}
      />

      <AppInput
        label="Description"
        placeholder="What will you do?"
        value={description}
        onChangeText={setDescription}
        editable={!isSaving}
        multiline
      />

      <Text style={styles.label}>Attribute</Text>
      <View style={styles.pickerContainer}>
        <Picker
          accessibilityLabel="Attribute"
          selectedValue={attribute}
          onValueChange={setAttribute}
          enabled={!isSaving}
          style={styles.picker}
          dropdownIconColor="#A78BFA"
        >
          <Picker.Item label="Choose an attribute" value="" />
          {ATTRIBUTES.map((name) => (
            <Picker.Item key={name} label={name} value={name} />
          ))}
        </Picker>
      </View>

      <Text style={styles.reward}>Reward: 10 XP</Text>

      <AppButton
        title={isSaving ? "Saving..." : "Save Quest"}
        onPress={handleSave}
        disabled={!canSave || isSaving}
      />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "#A78BFA",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  label: {
    color: "#D1D5DB",
    fontSize: 16,
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: "#1E1E30",
    borderColor: "#45455E",
    borderWidth: 1,
    borderRadius: 12,
  },
  picker: {
    color: "#D1D5DB",
  },
  reward: {
    color: "#FCD34D",
    fontSize: 16,
    fontWeight: "700",
    marginVertical: 16,
  },
});