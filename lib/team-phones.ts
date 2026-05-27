/** Team notification numbers — first entry receives the press-1 IVR call. */
export function teamNotificationPhones(): string[] {
  const raw =
    process.env.TEAM_NOTIFICATION_PHONES?.trim() ||
    process.env.TEAM_PRIMARY_PHONE?.trim() ||
    "+18156080449";
  return raw
    .split(/[,;\s]+/)
    .map((n) => n.trim())
    .filter(Boolean)
    .map((n) => (n.startsWith("+") ? n : `+1${n.replace(/\D/g, "")}`));
}

/** SMS alert recipients (defaults include legacy Kathy lines). */
export function teamSmsPhones(): string[] {
  const raw =
    process.env.TEAM_SMS_PHONES?.trim() ||
    "+18156080449,+14142027718,+14148655518";
  return raw
    .split(/[,;\s]+/)
    .map((n) => n.trim())
    .filter(Boolean)
    .map((n) => (n.startsWith("+") ? n : `+1${n.replace(/\D/g, "")}`));
}
