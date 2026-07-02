import type { ApiErrorBody, ApiSuccessBody } from "@/shared/types/api";
import { ApiClientError } from "@/shared/types/api";
import { getApiBaseUrl } from "@/frontend/api/base-url";

function resolveApiUrl(path: string): string {
  if (path.startsWith("http")) {
    return path;
  }

  if (typeof window === "undefined") {
    return `${getApiBaseUrl()}${path}`;
  }

  return path;
}

export async function parseApiResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const body = (await response.json()) as ApiSuccessBody<T> | ApiErrorBody;

  if (!response.ok) {
    const errorBody = body as ApiErrorBody;
    throw new ApiClientError(
      errorBody.error?.message ?? "Error inesperado",
      errorBody.error?.code ?? "UNKNOWN_ERROR",
      response.status,
    );
  }

  return (body as ApiSuccessBody<T>).data;
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(resolveApiUrl(path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  return parseApiResponse<T>(response);
}
