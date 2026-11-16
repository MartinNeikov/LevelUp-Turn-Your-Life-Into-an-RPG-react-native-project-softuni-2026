import { supabase } from "../../../lib/supabase";

export function logout() {
  return supabase.auth.signOut({ scope: "local" });
}