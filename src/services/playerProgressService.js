import { supabase } from "../lib/supabase";

export async function getPlayerProgress() {
  const { data, error } = await supabase
    .from("player_progress")
    .select("total_xp")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data?.total_xp ?? 0;
}