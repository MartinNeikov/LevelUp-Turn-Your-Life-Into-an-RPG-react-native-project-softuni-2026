import { supabase } from "../../../lib/supabase";

export function register({ displayName, email, password }) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });
}