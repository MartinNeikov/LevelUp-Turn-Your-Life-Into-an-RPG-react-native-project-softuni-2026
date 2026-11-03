import { useState } from "react";
import { StyleSheet, Text, Alert } from "react-native";
import AuthLayout from "../auth-layout/AuthLayout";
import AttributeCard from "../attribute-card/AttributeCard";
import AppButton from "../app-button/AppButton";

export default function ChoosePathScreen() {
  const [isStrengthFocused, setIsStrengthFocused] = useState(false);
  const [isIntelligenceFocused, setIsIntelligenceFocused] = useState(false);
  const [isDisciplineFocused, setIsDisciplineFocused] = useState(false);
  const [isEnduranceFocused, setIsEnduranceFocused] = useState(false);
  const [isCharismaFocused, setIsCharismaFocused] = useState(false);
  const [isCreativityFocused, setIsCreativityFocused] = useState(false);

  const selectedCount = [
    isStrengthFocused,
    isIntelligenceFocused,
    isDisciplineFocused,
    isEnduranceFocused,
    isCharismaFocused,
    isCreativityFocused,
  ].filter(Boolean).length;

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
        disabled={selectedCount >= 3 && !isStrengthFocused}
      />
      <AttributeCard
        title="Intelligence"
        description="Learning, reading, and new skills"
        value={isIntelligenceFocused}
        onValueChange={setIsIntelligenceFocused}
        disabled={selectedCount >= 3 && !isIntelligenceFocused}
      />
      <AttributeCard
        title="Discipline"
        description="Habits, consistency, and productivity"
        value={isDisciplineFocused}
        onValueChange={setIsDisciplineFocused}
        disabled={selectedCount >= 3 && !isDisciplineFocused}
      />
      <AttributeCard
        title="Endurance"
        description="Stamina, walking, and sustained activity"
        value={isEnduranceFocused}
        onValueChange={setIsEnduranceFocused}
        disabled={selectedCount >= 3 && !isEnduranceFocused}
      />

      <AttributeCard
        title="Charisma"
        description="Communication and social skills"
        value={isCharismaFocused}
        onValueChange={setIsCharismaFocused}
        disabled={selectedCount >= 3 && !isCharismaFocused}
      />

      <AttributeCard
        title="Creativity"
        description="Art, imagination, and creative projects"
        value={isCreativityFocused}
        onValueChange={setIsCreativityFocused}
        disabled={selectedCount >= 3 && !isCreativityFocused}
      />

      <AppButton
        title="Continue"
        disabled={selectedCount < 2 || selectedCount > 3}
        onPress={() =>
          Alert.alert("Choose Your Path", "Your priorities are selected!")
        }
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
