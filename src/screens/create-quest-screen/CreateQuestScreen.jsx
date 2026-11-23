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

  const initialIsStepQuest =
    quest?.attribute === "Endurance" &&
    quest?.target_type === "steps";

  const [title, setTitle] = useState(quest?.title ?? "");
  const [description, setDescription] = useState(quest?.description ?? "");
  const [attribute, setAttribute] = useState(quest?.attribute ?? "");

  const [questType, setQuestType] = useState(
    initialIsStepQuest ? "steps" : "manual",
  );

  const [targetSteps, setTargetSteps] = useState(
    initialIsStepQuest ? String(quest.target_value) : "",
  );

  const [isSaving, setIsSaving] = useState(false);
  const saving = useRef(false);

  const isEndurance = attribute === "Endurance";
  const isStepQuest = isEndurance && questType === "steps";

  const trimmedSteps = targetSteps.trim();
  const stepsNumber = Number(trimmedSteps);

  const hasValidSteps =
    /^\d+$/.test(trimmedSteps) &&
    Number.isSafeInteger(stepsNumber) &&
    stepsNumber > 0 &&
    stepsNumber <= 2147483647;

  const showStepsError =
    isStepQuest && trimmedSteps !== "" && !hasValidSteps;

  const canSave = Boolean(
    title.trim() &&
    description.trim() &&
    ATTRIBUTES.includes(attribute) &&
    (!isStepQuest || hasValidSteps),
  );

  const saveLabel = isEditing ? "Save Changes" : "Save Quest";

  function handleAttributeChange(value) {
    setAttribute(value);

    if (value !== "Endurance") {
      setQuestType("manual");
      setTargetSteps("");
    }
  }

  function handleQuestTypeChange(value) {
    setQuestType(value);

    if (value !== "steps") {
      setTargetSteps("");
    }
  }

  async function handleSave() {
    if (!canSave || saving.current) return;

    saving.current = true;
    setIsSaving(true);

    try {
      const values = {
        title,
        description,
        attribute,
        targetType: isStepQuest ? "steps" : null,
        targetValue: isStepQuest ? stepsNumber : null,
      };

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
          onValueChange={handleAttributeChange}
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

      {isEndurance && (
        <>
          <Text style={styles.label}>Quest type</Text>

          <View style={styles.pickerContainer}>
            <Picker
              accessibilityLabel="Quest type"
              selectedValue={questType}
              onValueChange={handleQuestTypeChange}
              enabled={!isSaving}
              style={styles.picker}
              dropdownIconColor={theme.colors.primary}
            >
              <Picker.Item label="Manual" value="manual" />
              <Picker.Item label="Steps" value="steps" />
            </Picker>
          </View>

          <Text style={styles.hint}>
            {isStepQuest
              ? "Reach your step goal with LevelUp open on the quest details screen."
              : "Mark the quest as completed after finishing your task."}
          </Text>
        </>
      )}

      {isStepQuest && (
        <>
          <AppInput
            label="Step goal"
            placeholder="For example, 500"
            value={targetSteps}
            onChangeText={setTargetSteps}
            keyboardType="number-pad"
            editable={!isSaving}
            maxLength={10}
          />

          {showStepsError && (
            <Text style={styles.error}>
              Enter a positive whole number up to 2147483647.
            </Text>
          )}
        </>
      )}

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
    marginBottom: theme.spacing.lg,
  },
  picker: {
    color: theme.colors.text,
  },
  hint: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.small,
    lineHeight: 20,
    marginBottom: theme.spacing.lg,
  },
  error: {
    color: theme.colors.error,
    fontSize: theme.fontSize.small,
    marginBottom: theme.spacing.md,
  },
  reward: {
    color: theme.colors.xp,
    fontSize: theme.fontSize.body,
    fontWeight: "700",
    marginVertical: theme.spacing.lg,
  },
});