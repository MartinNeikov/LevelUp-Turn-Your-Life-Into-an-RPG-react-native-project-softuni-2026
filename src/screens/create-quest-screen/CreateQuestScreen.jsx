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
import { commonStyles } from "../../theme/commonStyles";
import { theme } from "../../theme/theme";

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
        Alert.alert(
          "Could not save quest",
          error.message || "Please try again.",
        );
      }
    } finally {
      saving.current = false;
      setIsSaving(false);
    }
  }

  return (
    <AuthLayout>
      <Text style={[commonStyles.formTitle, styles.title]}>
        {isEditing ? "Edit Quest" : "Create Quest"}
      </Text>

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
          dropdownIconColor={theme.colors.primary}
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
    marginBottom: theme.spacing.xl,
  },
  label: {
    color: theme.colors.text,
    fontSize: theme.fontSize.body,
    marginBottom: theme.spacing.sm,
  },
  pickerContainer: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.md,
  },
  picker: {
    color: theme.colors.text,
  },
  reward: {
    color: theme.colors.xp,
    fontSize: theme.fontSize.body,
    fontWeight: "700",
    marginVertical: theme.spacing.lg,
  },
});