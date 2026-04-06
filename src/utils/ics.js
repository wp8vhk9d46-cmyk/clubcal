import { escapeICS } from "./helpers.js";

export function toICSDate(dateString, timeString) {
  const date = new Date(`${dateString}T${timeString}:00`);
  const pad = (value) => String(value).padStart(2, "0");
  return [
    date.getUTCFullYear(),
    pad(date.getUTCMonth() + 1),
    pad(date.getUTCDate())
  ].join("") + "T" + [
    pad(date.getUTCHours()),
    pad(date.getUTCMinutes()),
    pad(date.getUTCSeconds())
  ].join("") + "Z";
}

export function createICSContent(eventItem, clubName) {
  const uid = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}@clubcal.app`;
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  const dtstamp = [
    now.getUTCFullYear(),
    pad(now.getUTCMonth() + 1),
    pad(now.getUTCDate())
  ].join("") + "T" + [
    pad(now.getUTCHours()),
    pad(now.getUTCMinutes()),
    pad(now.getUTCSeconds())
  ].join("") + "Z";
  const descriptionLines = [
    eventItem.description || "",
    `Attire: ${eventItem.attire || "Not specified"}`,
    `RSVP: ${eventItem.rsvp_url || eventItem.rsvp || "N/A"}`
  ].filter(Boolean).join("\n");
  const location = [eventItem.address, eventItem.room].filter(Boolean).join(", ");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ClubCal//ClubCal//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${toICSDate(eventItem.date, eventItem.start_time || eventItem.startTime)}`,
    `DTEND:${toICSDate(eventItem.date, eventItem.end_time || eventItem.endTime)}`,
    `SUMMARY:${escapeICS(`${eventItem.title} – ${clubName}`)}`,
    `DESCRIPTION:${escapeICS(descriptionLines)}`,
    `LOCATION:${escapeICS(location)}`,
    `X-ATTIRE:${escapeICS(eventItem.attire || "")}`,
    `X-CLUB:${escapeICS(clubName)}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
}

export function downloadICS(eventItem, clubName, triggerButton) {
  const content = createICSContent(eventItem, clubName);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const slug = `${clubName}-${eventItem.title}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  anchor.href = url;
  anchor.download = `${slug || "clubcal-event"}.ics`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);

  if (triggerButton) {
    triggerButton.classList.remove("calendar-pulse");
    void triggerButton.offsetWidth;
    triggerButton.classList.add("calendar-pulse");
  }
}
