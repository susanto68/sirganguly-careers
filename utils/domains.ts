const blockedWords = ["whatsapp", "telegram", "coaching", "training", "pay-now", "placement-fee"];

export function normalizeDomain(input: string) {
  try {
    const url = input.startsWith("http") ? new URL(input) : new URL(`https://${input}`);
    return url.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return input.replace(/^www\./, "").toLowerCase();
  }
}

export function isSuspiciousUrl(url: string) {
  const normalized = url.toLowerCase();
  return blockedWords.some((word) => normalized.includes(word));
}

export function sameRegistrableDomain(candidate: string, officialDomain: string) {
  const domain = normalizeDomain(candidate);
  const official = normalizeDomain(officialDomain);
  return domain === official || domain.endsWith(`.${official}`);
}
