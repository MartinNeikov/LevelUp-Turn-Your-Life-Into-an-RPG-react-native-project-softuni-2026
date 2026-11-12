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

export async function getDailyQuests() {
  const { data: dailyQuests, error: dailyError } = await supabase.rpc(
    "get_daily_quests",
  );

  if (dailyError) throw dailyError;
  if (dailyQuests.length === 0) return [];

  const questIds = dailyQuests.map((dailyQuest) => dailyQuest.quest_id);

  const { data: quests, error: questsError } = await supabase
    .from("quests")
    .select("id, title")
    .in("id", questIds);

  if (questsError) throw questsError;

  const titlesById = new Map(quests.map((quest) => [quest.id, quest.title]));

  return dailyQuests.map((dailyQuest) => ({
    ...dailyQuest,
    title: titlesById.get(dailyQuest.quest_id) ?? "Quest",
  }));
}

export async function getDailyQuestStatus(questId, questDate) {
  const { data, error } = await supabase
    .from("daily_quests")
    .select("completed_at")
    .eq("quest_id", questId)
    .eq("quest_date", questDate)
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function completeDailyQuest(questId, questDate) {
  const { data, error } = await supabase.rpc("complete_daily_quest", {
    p_quest_id: questId,
    p_quest_date: questDate,
  });

  if (error) throw error;

  return data;
}