import { useRef, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { Alert, StyleSheet, Text, View } from "react-native";

import AppButton from "../../components/app-button/AppButton";
import AppInput from "../../components/app-input/AppInput";
import AuthLayout from "../../layouts/auth-layout/AuthLayout";
import {
  createPersonalQuest,
  updatePersonalQuest,
} from "../../services/questService";

const ATTRIBUTES = [
  "Strength",
  "Intelligence",
  "Discipline",
  "Endurance",
  "Charisma",
  "Creativity",
];

export default function CreateQuestScreen({ navigation, route }) {
  const quest = route.params?.quest;
  const isEditing = Boolean(quest?.id);
  const [title, setTitle] = useState(quest?.title ?? "");
  const [description, setDescription] = useState(quest?.description ?? "");
  const [attribute, setAttribute] = useState(quest?.attribute ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const saving = useRef(false);

  const canSave = Boolean(
    title.trim() && description.trim() && ATTRIBUTES.includes(attribute),
  );
  const saveLabel = isEditing ? "Save Changes" : "Save Quest";

  async function handleSave() {
    if (!canSave || saving.current) return;

    saving.current = true;
    setIsSaving(true);

    try {
      const values = { title, description, attribute };

      if (isEditing) {
        await updatePersonalQuest(quest.id, values);
      } else {
        await createPersonalQuest(values);
      }

      if (navigation.isFocused()) {
        navigation.goBack();
      }
    } catch (error) {
      if (navigation.isFocused()) {
        Alert.alert("Could not save quest", error.message || "Please try again.");
      }
    } finally {
      saving.current = false;
      setIsSaving(false);
    }
  }

  return (
    <AuthLayout>
      <Text style={styles.title}>{isEditing ? "Edit Quest" : "Create Quest"}</Text>

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
        title={isSaving ? "Saving..." : saveLabel}
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