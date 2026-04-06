export function escapeICS(text) {
  return String(text || "")
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

export function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function getClubFeedUrl(clubId) {
  return `https://clubcal.vercel.app/api/calendar/${clubId}`;
}

export function clearErrors(scope) {
  scope.querySelectorAll("[data-error-for]").forEach((el) => {
    el.textContent = "";
  });
}

export function setError(scope, key, message) {
  const el = scope.querySelector(`[data-error-for="${key}"]`);
  if (el) el.textContent = message;
}

export function formatLocalDate(dateString) {
  if (!dateString) return "TBD";
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(dateString));
}

export function formatTimestamp(dateString) {
  if (!dateString) return "TBD";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(dateString));
}

export function formatTimeRange(dateString, startTime, endTime) {
  if (!dateString || !startTime || !endTime) return "Select a date and time.";
  const start = new Date(`${dateString}T${startTime}`);
  const end = new Date(`${dateString}T${endTime}`);
  const formatter = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });
  return `${formatLocalDate(dateString)} · ${formatter.format(start)} - ${formatter.format(end)}`;
}

export function categoryClass(category) {
  const slug = String(category || "other").toLowerCase();
  return `category-${slug.replace(/[^a-z]+/g, "-")}`;
}

export function mapClub(row) {
  return {
    id: row.id,
    clubName: row.club_name,
    school: row.school,
    email: row.email,
    status: row.status,
    createdAt: row.created_at
  };
}

export function mapEvent(row) {
  return {
    id: row.id,
    club_id: row.club_id,
    title: row.title,
    date: row.date,
    start_time: row.start_time,
    end_time: row.end_time,
    address: row.address,
    room: row.room || "",
    attire: row.attire || "",
    category: row.category,
    description: row.description || "",
    rsvp_url: row.rsvp_url || "",
    created_at: row.created_at,
    download_count: row.download_count || 0
  };
}
