const API_BASE =
  typeof window === "undefined"
    ? process.env.API_BASE_URL || ""
    : import.meta.env.VITE_API_BASE_URL || "";

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T | undefined> {
  const url = API_BASE ? new URL(path, API_BASE).toString() : path;
  const { method = "GET", headers, ...rest } = options;
  const init: RequestInit = {
    method,
    ...rest,
    headers: {
      ...(method === "POST" || method === "PUT"
        ? { "Content-Type": "application/json" }
        : {}),
      ...headers,
    },
  };

  try {
    const response = await fetch(url, init);
    if (!response.ok) {
      throw new ApiError(
        `Erro ${response.status}. Por favor, tente novamente mais tarde.`,
      );
    }

    if (
      response.status === 204 ||
      response.headers.get("content-length") === "0"
    ) {
      return undefined;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new ApiError("Falha de rede. Verifique sua conexão.");
    }
    throw error;
  }
}

export { API_BASE };
