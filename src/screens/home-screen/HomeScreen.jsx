import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { supabase } from "../../lib/supabase";

import { getPlayerProgress } from "../../services/playerProgressService";

const XP_PER_LEVEL = 100;

export default function HomeScreen({ route }) {
  const selectedAttributes = route.params?.selectedAttributes ?? [];
  const [totalXp, setTotalXp] = useState(null);
  const [xpError, setXpError] = useState("");

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadProgress() {
        setXpError("");

        try {
          const xp = await getPlayerProgress();

          if (isActive) {
            setTotalXp(xp);
          }
        } catch {
          if (isActive) {
            setXpError("Could not load XP.");
          }
        }
      }

      loadProgress();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const xp = totalXp ?? 0;
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const xpInLevel = xp % XP_PER_LEVEL;
  const progressPercent = (xpInLevel / XP_PER_LEVEL) * 100;
  const avatarLevel = Math.min(level, 6);
  const { data: avatar } = supabase.storage
    .from("level-avatars")
    .getPublicUrl(`level-${avatarLevel}.png`);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Adventure</Text>

      <View style={styles.xpSection}>
        {xpError || totalXp === null ? (
          <Text style={styles.xpText}>{xpError || "Loading XP..."}</Text>
        ) : (
          <>
            <Image
              source={{ uri: avatar.publicUrl }}
              style={styles.avatar}
              resizeMode="contain"
              accessible
              accessibilityLabel={`Adventurer cat, equipment level ${avatarLevel}`}
            />
            <View style={styles.xpHeader}>
              <Text style={styles.levelText}>Level {level}</Text>
              <Text style={styles.xpText}>Total XP: {totalXp}</Text>
            </View>

            <View
              accessible
              accessibilityRole="progressbar"
              accessibilityLabel="Progress to next level"
              accessibilityValue={{ min: 0, max: XP_PER_LEVEL, now: xpInLevel }}
              style={styles.xpTrack}
            >
              <View style={[styles.xpFill, { width: `${progressPercent}%` }]} />
            </View>

            <Text style={styles.xpCaption}>
              {xpInLevel} / {XP_PER_LEVEL} XP
            </Text>
          </>
        )}
      </View>

      {selectedAttributes.length > 0 && (
        <View style={styles.focusSection}>
          <Text style={styles.focusLabel}>Your Focus</Text>

          <View style={styles.focusList}>
            {selectedAttributes.map((attribute) => (
              <View key={attribute} style={styles.focusBadge}>
                <Text style={styles.focusBadgeText}>{attribute}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#12121F",
    padding: 24,
  },
  title: {
    color: "#A78BFA",
    fontSize: 32,
    fontWeight: "bold",
  },
  xpSection: {
    marginTop: 16,
    gap: 8,
  },
  xpHeader: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  levelText: {
    color: "#A78BFA",
    fontSize: 20,
    fontWeight: "700",
  },
  xpText: {
    color: "#FCD34D",
    fontSize: 16,
    fontWeight: "700",
  },
  xpTrack: {
    height: 12,
    backgroundColor: "#35354D",
    borderRadius: 6,
    overflow: "hidden",
  },
  xpFill: {
    height: "100%",
    backgroundColor: "#A78BFA",
  },
  xpCaption: {
    color: "#D1D5DB",
    fontSize: 14,
    textAlign: "right",
  },
  focusSection: {
    marginTop: 20,
  },
  focusLabel: {
    color: "#D1D5DB",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  focusList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  focusBadge: {
    backgroundColor: "#251D3A",
    borderWidth: 1,
    borderColor: "#57447A",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  focusBadgeText: {
    color: "#C4B5FD",
    fontSize: 14,
    fontWeight: "600",
  },
  avatar: {
  width: "100%",
  maxWidth: 240,
  aspectRatio: 1,
  alignSelf: "center",
  borderRadius: 16,
  marginBottom: 8,
},
});
