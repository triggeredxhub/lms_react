import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

import { API_CONFIG } from "@/lib/constants/api";

const TOKEN_KEY = "auth_token";

type QueryParams = Record<string, string | number | boolean | null | undefined>;

class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

function buildUrl(path: string, params?: QueryParams) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${API_CONFIG.BASE_URL}${normalizedPath}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === null || value === undefined) {
        continue;
      }

      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

async function getStoredToken() {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return AsyncStorage.getItem(TOKEN_KEY);
  }
}

async function createHeaders(requiresAuth = false) {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (!requiresAuth) {
    return headers;
  }

  const token = await getStoredToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function parseResponse(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function getErrorMessage(body: unknown, fallback: string) {
  if (body && typeof body === "object") {
    const maybeMessage = (body as Record<string, unknown>).message;

    if (typeof maybeMessage === "string" && maybeMessage.length > 0) {
      return maybeMessage;
    }
  }

  return fallback;
}

async function request<T>(
  method: "GET" | "POST",
  path: string,
  body?: unknown,
  requiresAuth = false,
  params?: QueryParams,
): Promise<T> {
  const requestUrl = buildUrl(path, params);
  let response: Response;

  try {
    response = await fetch(requestUrl, {
      body: body === undefined ? undefined : JSON.stringify(body),
      headers: await createHeaders(requiresAuth),
      method,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error && error.message
        ? error.message
        : "Network request failed";

    throw new Error(
      `${errorMessage}. Could not reach API at ${requestUrl}. Check EXPO_PUBLIC_API_BASE_URL and backend availability.`,
    );
  }

  const parsedBody = await parseResponse(response);

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(
        parsedBody,
        `Request failed with status ${response.status}`,
      ),
      response.status,
      parsedBody,
    );
  }

  return parsedBody as T;
}

export const api = {
  get<T = unknown>(
    path: string,
    params: QueryParams = {},
    requiresAuth = false,
  ) {
    return request<T>("GET", path, undefined, requiresAuth, params);
  },
  post<T = unknown>(path: string, body: unknown = {}, requiresAuth = false) {
    return request<T>("POST", path, body, requiresAuth);
  },
};
