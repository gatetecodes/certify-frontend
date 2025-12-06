export const environment = {
  production: true,
  apiUrl: "", // Placeholder, will be overridden by buildApiUrl
};

export function buildApiUrl(path: string): string {
  // Read from window.env injected at runtime
  const browserWindow = window as any;
  const envApiUrl =
    browserWindow["env"] && browserWindow["env"]["apiUrl"]
      ? browserWindow["env"]["apiUrl"]
      : "";

  // Fallback to empty string (relative path) if not set
  const baseUrl = envApiUrl || "";

  // Ensure no double slashes if baseUrl ends with / and path starts with /
  const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith("/") ? path : "/" + path;

  return cleanBase + cleanPath;
}
