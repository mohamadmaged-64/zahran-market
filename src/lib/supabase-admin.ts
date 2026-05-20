import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

function createAdminClient() {
  if (!supabaseUrl || !supabaseServiceKey) {
    // Return a mock during build/SSR without env vars
    return createClient(
      "https://placeholder.supabase.co",
      "placeholder-key",
      {
        auth: { autoRefreshToken: false, persistSession: false },
      }
    );
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export const supabaseAdmin = createAdminClient();
