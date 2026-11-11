import { supabase } from "../lib/supabase";

export async function getQuests() {
  const { data, error } = await supabase
    .from("quests")
    .select("id, title, description, attribute, xp, target_type, target_value")
    .order("title");

  if (error) {
    throw error;
  }

  return data;
};

export async function getQuestById(questId) {
  const { data, error } = await supabase
    .from("quests")
    .select("id, title, description, attribute, xp, target_type, target_value")
    .eq("id", questId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
};