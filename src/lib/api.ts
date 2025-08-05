const API_BASE =
  typeof window === 'undefined'
    ? process.env.API_BASE_URL || ''
    : import.meta.env.VITE_API_BASE_URL || '';

export async function apiRequest<T = unknown>(
  path: string,
  options?: RequestInit,
): Promise<T | undefined> {
  const url = API_BASE ? new URL(path, API_BASE).toString() : path;
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return undefined;
  }

  return response.json() as Promise<T>;
}

export { API_BASE };
