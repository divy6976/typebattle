/** Backend origin — practice uses REST; battle uses Socket.IO on the same host by default. */
export function getApiBaseUrl(): string {
  const raw = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_API_URL : undefined;
  if (typeof raw === "string" && raw.length > 0) {
    return raw.replace(/\/$/, "");
  }
  return "http://localhost:5000";
}
