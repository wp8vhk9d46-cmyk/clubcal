export const SUPABASE_URL = "https://edcnllalkavncijrewno.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_TGCM03zUEwuO7ibEXBWNfA_VJt-jHOC";

export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export function isSupabaseConfigured() {
  return SUPABASE_URL.startsWith("https://")
    && !SUPABASE_URL.includes("YOUR_PROJECT")
    && SUPABASE_ANON_KEY
    && !SUPABASE_ANON_KEY.includes("YOUR_SUPABASE");
}
