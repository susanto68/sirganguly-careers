import { differenceInCalendarDays, format, formatDistanceToNowStrict, isAfter, parseISO } from "date-fns";

export function isEndingSoon(deadline?: string) {
  if (!deadline) return false;
  const days = differenceInCalendarDays(parseISO(deadline), new Date());
  return days >= 0 && days <= 7;
}

export function isNewOpening(openedAt: string) {
  const days = differenceInCalendarDays(new Date(), parseISO(openedAt));
  return days <= 7;
}

export function isExpired(deadline?: string) {
  if (!deadline) return false;
  return isAfter(new Date(), parseISO(deadline));
}

export function deadlineLabel(deadline?: string) {
  if (!deadline) return "No official deadline";
  if (isExpired(deadline)) return "Expired";
  return `${formatDistanceToNowStrict(parseISO(deadline))} left`;
}

export function openingDateLabel(openedAt?: string) {
  if (!openedAt) return "Opening date not provided";
  try {
    return `Opened ${format(parseISO(openedAt), "d MMM yyyy")}`;
  } catch {
    return "Opening date not provided";
  }
}

export function getFreshnessLabel(lastCheckedAt?: string) {
  if (!lastCheckedAt) return "Updated 1 hour ago";
  try {
    const distance = formatDistanceToNowStrict(parseISO(lastCheckedAt));
    return `Updated ${distance} ago`;
  } catch {
    return "Updated 1 hour ago";
  }
}
