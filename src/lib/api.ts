// API configuration for both development and production
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export function getApiUrl(path: string): string {
  // If path already starts with http, return as is
  if (path.startsWith("http")) {
    return path;
  }

  // If path starts with /api, prepend the base URL
  if (path.startsWith("/api")) {
    return `${API_BASE_URL}${path}`;
  }

  // If path doesn't start with /, add it
  if (!path.startsWith("/")) {
    return `${API_BASE_URL}/api/${path}`;
  }

  // Otherwise, prepend the base URL
  return `${API_BASE_URL}${path}`;
}
