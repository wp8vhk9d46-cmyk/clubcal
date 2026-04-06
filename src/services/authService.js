import { supabase } from "./supabaseClient.js";
import { mapClub, setError } from "../utils/helpers.js";
import { store } from "../state/store.js";

export async function fetchClubByEmail(email) {
  const { data, error } = await supabase
    .from("clubs")
    .select("*")
    .eq("email", email)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data || null;
}

export async function fetchPendingClubs() {
  const { data, error } = await supabase
    .from("clubs")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data || []).map(mapClub);
}

export async function signUpClub(payload, signupForm) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password
  });

  if (authError) {
    setError(signupForm, "email", authError.message);
    return null;
  }

  const userId = authData?.user?.id;
  if (!userId) {
    setError(signupForm, "email", "Signup failed. Please try again.");
    return null;
  }

  const { error: insertError } = await supabase.from("clubs").insert({
    user_id: userId,
    club_name: payload.clubName,
    school: payload.school,
    email: payload.email,
    status: "pending"
  });

  if (insertError) {
    setError(signupForm, "email", insertError.message);
    return null;
  }

  return authData;
}

export async function signInClub(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw new Error("Invalid email or password.");
  }

  const clubRow = await fetchClubByEmail(email);
  if (!clubRow) {
    throw new Error("No approved club found for this email.");
  }

  store.setAuth(data?.session || null, mapClub(clubRow));
  return store.state.activeClub;
}

export async function restoreSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data?.session?.user?.email) return;

  const clubRow = await fetchClubByEmail(data.session.user.email).catch(() => null);
  if (!clubRow) return;
  store.setAuth(data.session, mapClub(clubRow));
}

export async function signOutClub() {
  await supabase.auth.signOut();
  store.clearAuth();
}

export async function updateClubProfile(clubId, updates) {
  const { data, error } = await supabase
    .from("clubs")
    .update(updates)
    .eq("id", clubId)
    .select()
    .single();

  if (error) throw error;
  return mapClub(data);
}

export async function approveClub(clubId) {
  const { error } = await supabase
    .from("clubs")
    .update({ status: "active" })
    .eq("id", clubId);

  if (error) throw error;
}

export async function rejectClub(clubId) {
  const { error } = await supabase
    .from("clubs")
    .delete()
    .eq("id", clubId);

  if (error) throw error;
}
