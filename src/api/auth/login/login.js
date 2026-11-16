import { supabase } from "../../../lib/supabase";

export function login({ email, password }) {
  return supabase.auth.signInWithPassword({ email, password });
}