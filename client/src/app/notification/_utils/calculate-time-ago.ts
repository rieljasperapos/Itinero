export function calculateTimeAgo(createdAt: string): string {
  const minutesDiff = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);

  if (minutesDiff < 60) return `${minutesDiff} minute${minutesDiff > 1 ? "s" : ""} ago`;

  const hoursDiff = Math.floor(minutesDiff / 60);
  if (hoursDiff < 24) return `${hoursDiff} hour${hoursDiff > 1 ? "s" : ""} ago`;

  const daysDiff = Math.floor(hoursDiff / 24);
  return `${daysDiff} day${daysDiff > 1 ? "s" : ""} ago`;
}
