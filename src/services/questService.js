import { supabase } from "../lib/supabase";

export async function getQuests() {
  const { data, error } = await supabase
    .from("quests")
    .select("id, title, description, attribute, xp, target_type, target_value")
    .order("title");

  if (error) throw error;

  return data;
}

export async function getQuestById(questId) {
  const { data, error } = await supabase
    .from("quests")
    .select(
      "id, title, description, attribute, xp, target_type, target_value, owner_id, started_at, completed_at, progress_value",
    )
    .eq("id", questId)
    .single();

  if (error) throw error;

  return data;
}

export async function getDailyQuests() {
  const { data: dailyQuests, error: dailyError } =
    await supabase.rpc("get_daily_quests");

  if (dailyError) throw dailyError;
  if (dailyQuests.length === 0) return [];

  const questIds = dailyQuests.map((entry) => entry.quest_id);

  const { data: quests, error: questsError } = await supabase
    .from("quests")
    .select("id, title, attribute, xp")
    .in("id", questIds);

  if (questsError) throw questsError;

  const questsById = new Map(quests.map((quest) => [quest.id, quest]));

  return dailyQuests.map((entry) => {
    const quest = questsById.get(entry.quest_id);

    return {
      ...entry,
      title: quest?.title ?? "Quest",
      attribute: quest?.attribute,
      xp: quest?.xp,
    };
  });
}

export async function getDailyQuestStatus(questId, questDate) {
  const { data, error } = await supabase
    .from("daily_quests")
    .select("started_at, completed_at, progress_value")
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

export async function createPersonalQuest({
  title,
  description,
  attribute,
  targetType = null,
  targetValue = null,
}) {
  validateQuestTarget(targetType, targetValue);

  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError) throw authError;

  const user = authData.user;

  if (!user) {
    throw new Error("Sign in to create a quest.");
  }

  const { error } = await supabase.from("quests").insert({
    title: title.trim(),
    description: description.trim(),
    attribute,
    owner_id: user.id,
    xp: 10,
    target_type: targetType,
    target_value: targetValue,
  });

  if (error) throw error;
}

export async function getPersonalQuests() {
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError) throw authError;

  const user = authData.user;

  if (!user) {
    throw new Error("Sign in to view your quests.");
  }

  const { data, error } = await supabase
    .from("quests")
    .select("id, title, attribute, xp")
    .eq("owner_id", user.id)
    .order("title")
    .order("id");

  if (error) throw error;

  return data;
}

export async function getFinishedQuests() {
  const dateParts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Sofia",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date());

  const { year, month, day } = Object.fromEntries(
    dateParts.map(({ type, value }) => [type, value]),
  );

  const today = new Date(
    Date.UTC(Number(year), Number(month) - 1, Number(day)),
  );

  const firstDay = new Date(today);
  firstDay.setUTCDate(firstDay.getUTCDate() - 6);

  const { data, error } = await supabase
    .from("daily_quests")
    .select(
      "quest_id, quest_date, completed_at, xp_awarded, quests(title, attribute)",
    )
    .not("completed_at", "is", null)
    .gte("quest_date", firstDay.toISOString().slice(0, 10))
    .lte("quest_date", today.toISOString().slice(0, 10))
    .order("completed_at", { ascending: false });

  if (error) throw error;

  return data.map(({ quests: quest, ...entry }) => ({
    ...entry,
    title: quest?.title ?? "Quest",
    attribute: quest?.attribute,
    xp: entry.xp_awarded,
  }));
}

export async function startPersonalQuest(questId) {
  const { data, error } = await supabase.rpc("start_personal_quest", {
    p_quest_id: questId,
  });

  if (error) throw error;

  return data;
}

export async function completePersonalQuest(questId) {
  const { data, error } = await supabase.rpc("complete_personal_quest", {
    p_quest_id: questId,
  });

  if (error) throw error;

  return data;
}

export async function updatePersonalQuest(
  questId,
  {
    title,
    description,
    attribute,
    targetType = null,
    targetValue = null,
  },
) {
  validateQuestTarget(targetType, targetValue);

  const { data, error } = await supabase
    .from("quests")
    .update({
      title: title.trim(),
      description: description.trim(),
      attribute,
      target_type: targetType,
      target_value: targetValue,
    })
    .eq("id", questId)
    .not("owner_id", "is", null)
    .is("started_at", null)
    .is("completed_at", null)
    .select("id")
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    throw new Error("This quest is no longer available to edit.");
  }
}

export async function deletePersonalQuest(questId) {
  const { data, error } = await supabase
    .from("quests")
    .delete()
    .eq("id", questId)
    .not("owner_id", "is", null)
    .is("started_at", null)
    .is("completed_at", null)
    .select("id")
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    throw new Error("This quest is no longer available to delete.");
  }
}

function validateQuestTarget(targetType, targetValue) {
  if (targetType === null && targetValue === null) {
    return;
  }

  if (
    targetType !== "steps" ||
    !Number.isSafeInteger(targetValue) ||
    targetValue < 1 ||
    targetValue > 2147483647
  ) {
    throw new Error("Enter a valid positive whole number of steps.");
  }
}