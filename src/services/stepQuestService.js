import { supabase } from "../lib/supabase";

export async function startStepQuest(questId, questDate = null) {
  const { data, error } = await supabase.rpc("start_step_quest", {
    p_quest_id: questId,
    p_quest_date: questDate,
  });

  if (error) throw error;

  return data;
}

export async function saveStepProgress(
  questId,
  progress,
  questDate = null,
) {
  if (!Number.isSafeInteger(progress) || progress < 0) {
    throw new Error("Step progress must be a non-negative integer.");
  }

  const { data, error } = await supabase.rpc("save_step_progress", {
    p_quest_id: questId,
    p_progress: progress,
    p_quest_date: questDate,
  });

  if (error) throw error;

  return data;
}

export async function completeStepQuest(questId, questDate = null) {
  const { data, error } = await supabase.rpc("complete_step_quest", {
    p_quest_id: questId,
    p_quest_date: questDate,
  });

  if (error) throw error;

  return data;
}