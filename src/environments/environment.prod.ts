export const environment = {
  production: true,
  apiUrl: "${API_URL}",
};

export function buildApiUrl(path: string): string {
  const baseUrl = environment.apiUrl;
  return baseUrl + path;
}
