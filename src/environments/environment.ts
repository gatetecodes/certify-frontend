export const environment = {
  production: false,
  apiUrl: "",
};

// Helper to build API URLs
export function buildApiUrl(path: string): string {
  const baseUrl = environment.apiUrl || ""; 
  return baseUrl + path;
}
