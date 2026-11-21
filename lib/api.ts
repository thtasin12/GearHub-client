
import { getJwtToken } from "./auth-client";
import { API_URL } from "./constants";
import { ApiEnvelope } from "./types";

type RequestOptions = RequestInit & {
  auth?: boolean;
};

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { auth = false, headers, ...init } = options;

  const requestHeaders = new Headers(headers);

  if (
    init.body &&
    !(init.body instanceof FormData) &&
    !requestHeaders.has("Content-Type")
  ) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (auth) {
    requestHeaders.set(
      "Authorization",
      `Bearer ${await getJwtToken()}`
    );
  }

  const response = await fetch(
    `${API_URL}${path.startsWith("/") ? path : `/${path}`}`,
    {
      ...init,
      headers: requestHeaders,
      credentials: "include",
      cache: "no-store",
    }
  );

  const json = (await response.json().catch(() => null)) as | ApiEnvelope<T> | T | null;

  if (!response.ok) {
    const envelope = json as ApiEnvelope<unknown> | null;

    throw new ApiError(
      envelope?.message || `Request failed (${response.status}).`,
      response.status,
      envelope?.code
    );
  }

  if (
    json &&
    typeof json === "object" &&
    "success" in json &&
    "data" in json
  ) {
    return (json as ApiEnvelope<T>).data;
  }

  return json as T;
}

export const apiGet = <T>(
  path: string,
  auth = false
) => apiRequest<T>(path, { 
    method: "GET", auth 
})

export const apiPost = <T>(path: string, body?: unknown, auth = true) => apiRequest<T>(path, { method: "POST", body: body === undefined ? undefined : JSON.stringify(body), auth });
export const apiPatch = <T>(path: string, body: unknown, auth = true) => apiRequest<T>(path, { method: "PATCH", body: JSON.stringify(body), auth });
