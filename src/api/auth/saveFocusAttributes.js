import { supabase } from "../../lib/supabase";

export function saveFocusAttributes(selectedAttributes) {
  return supabase.auth.updateUser({
    data: {
      focus_attributes: selectedAttributes,
    },
  });
}