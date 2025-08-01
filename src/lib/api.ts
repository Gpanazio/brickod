const API_BASE =
  typeof window === 'undefined'
    ? process.env.API_BASE_URL || ''
    : import.meta.env.VITE_API_BASE_URL || '';

export async function apiRequest(path: string, options?: RequestInit) {
  const url = API_BASE ? new URL(path, API_BASE).toString() : path;
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export { API_BASE };
