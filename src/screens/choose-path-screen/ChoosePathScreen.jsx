import { useState } from "react";
import { Alert, StyleSheet, Text } from "react-native";

import AuthLayout from "../../components/auth-layout/AuthLayout";
import AttributeCard from "../../components/attribute-card/AttributeCard";
import AppButton from "../../components/app-button/AppButton";
import { supabase } from "../../lib/supabase";

export default function ChoosePathScreen({ navigation }) {
  const [isStrengthFocused, setIsStrengthFocused] = useState(false);
  const [isIntelligenceFocused, setIsIntelligenceFocused] = useState(false);
  const [isDisciplineFocused, setIsDisciplineFocused] = useState(false);
  const [isEnduranceFocused, setIsEnduranceFocused] = useState(false);
  const [isCharismaFocused, setIsCharismaFocused] = useState(false);
  const [isCreativityFocused, setIsCreativityFocused] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const selectedAttributes = Object.entries({
    Strength: isStrengthFocused,
    Intelligence: isIntelligenceFocused,
    Discipline: isDisciplineFocused,
    Endurance: isEnduranceFocused,
    Charisma: isCharismaFocused,
    Creativity: isCreativityFocused,
  })
    .filter(([, isFocused]) => isFocused)
    .map(([name]) => name);

  const selectedCount = selectedAttributes.length;
  const canContinue = selectedCount >= 2 && selectedCount <= 3;

  async function handleContinue() {
    if (!canContinue || isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          focus_attributes: selectedAttributes,
        },
      });

      if (error) {
        Alert.alert("Could not save your choices", error.message);
        return;
      }

      navigation.reset({
        index: 0,
        routes: [{ name: "Home", params: { selectedAttributes } }],
      });
    } catch {
      Alert.alert("Could not save your choices", "Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AuthLayout>
      <Text style={styles.title}>Choose Your Path</Text>

      <Text style={styles.description}>
        Choose 2 or 3 attributes to focus on. All six attributes will grow
        throughout your journey.
      </Text>

      <Text style={styles.counter}>Selected: {selectedCount}/3</Text>

      <AttributeCard
        title="Strength"
        description="Fitness, sports, and movement"
        value={isStrengthFocused}
        onValueChange={setIsStrengthFocused}
        disabled={isSaving || (selectedCount >= 3 && !isStrengthFocused)}
      />

      <AttributeCard
        title="Intelligence"
        description="Learning, reading, and new skills"
        value={isIntelligenceFocused}
        onValueChange={setIsIntelligenceFocused}
        disabled={isSaving || (selectedCount >= 3 && !isIntelligenceFocused)}
      />

      <AttributeCard
        title="Discipline"
        description="Habits, consistency, and productivity"
        value={isDisciplineFocused}
        onValueChange={setIsDisciplineFocused}
        disabled={isSaving || (selectedCount >= 3 && !isDisciplineFocused)}
      />

      <AttributeCard
        title="Endurance"
        description="Stamina, walking, and sustained activity"
        value={isEnduranceFocused}
        onValueChange={setIsEnduranceFocused}
        disabled={isSaving || (selectedCount >= 3 && !isEnduranceFocused)}
      />

      <AttributeCard
        title="Charisma"
        description="Communication and social skills"
        value={isCharismaFocused}
        onValueChange={setIsCharismaFocused}
        disabled={isSaving || (selectedCount >= 3 && !isCharismaFocused)}
      />

      <AttributeCard
        title="Creativity"
        description="Art, imagination, and creative projects"
        value={isCreativityFocused}
        onValueChange={setIsCreativityFocused}
        disabled={isSaving || (selectedCount >= 3 && !isCreativityFocused)}
      />

      <AppButton
        title={isSaving ? "Saving..." : "Continue"}
        disabled={!canContinue || isSaving}
        onPress={handleContinue}
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
  },
  description: {
    color: "#9CA3AF",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 32,
  },
  counter: {
    color: "#A78BFA",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
});