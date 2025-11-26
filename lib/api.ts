import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_CONFIG } from "@/constants/api";

const BASE_URL = API_CONFIG.BASE_URL;

// Helper: Safe JSON parsing for all methods
async function safeJsonParse(res: Response) {
  const contentType = res.headers.get("content-type");
  const responseText = await res.text();

  try {
    return contentType?.includes("application/json")
      ? JSON.parse(responseText)
      : { message: responseText };
  } catch (e) {
    return { message: responseText };
  }
}

// Helper: Handle errors consistently
function handleApiError(res: Response, responseData: any) {
  const backendMessage =
    responseData?.message || responseData?.error || res.statusText;

  if (res.status === 401 || /token.*expired|invalid/i.test(backendMessage)) {
    throw new Error("AUTH_TOKEN_EXPIRED");
  }

  if (res.status === 429) {
    throw new Error("Too many requests. Please wait and try again.");
  }

  throw new Error(backendMessage);
}

async function getAuthHeader(auth: boolean) {
  if (!auth) return {};
  let token;
  try {
    token = await SecureStore.getItemAsync("auth_token");
  } catch (error) {
    // Fallback to AsyncStorage if SecureStore fails (e.g., in Expo Go)
    token = await AsyncStorage.getItem("auth_token");
  }
  if (!token) {
    throw new Error("No token found, please log in.");
  }
  return { Authorization: `Bearer ${token}` };
}

export const api = {
  get: async (endpoint: string, options: RequestInit = {}, auth = false) => {
    const authHeader = await getAuthHeader(auth);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
      ...Object.fromEntries(
        Object.entries(authHeader).filter(([_, value]) => value !== undefined)
      ),
    };

    const url = `${BASE_URL}${endpoint}`;

    try {
      const res = await fetch(url, { ...options, headers });
      const responseData = await safeJsonParse(res);

      if (!res.ok) {
        // Supabase sometimes returns a 500 with a message like
        // "Cannot coerce the result to a single JSON object" when a
        // `.single()` call had no matching rows. Treat that as "no data"
        // instead of surfacing a fatal API error to the UI.
        const backendMessage =
          responseData?.message || responseData?.error || res.statusText || "";

        if (typeof backendMessage === "string" && /coerce the result to a single JSON object/i.test(backendMessage)) {
          // Don't log this particular server-side coercion error — it is expected
          // when the DB row doesn't exist and would otherwise create a noisy dev toast.
          return null;
        }

        // Only log non-404 errors (404s are often expected with fallbacks)
        if (res.status !== 404) {
          console.error("❌ API Error:", res.status, url);
        }

        handleApiError(res, responseData);
      }

      return responseData;
    } catch (error: any) {
      // Error already thrown by handleApiError, no need to log again
      throw error;
    }
  },

  post: async (
    endpoint: string,
    body: any,
    options: RequestInit = {},
    auth = false
  ) => {
    const authHeader = await getAuthHeader(auth);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
      ...Object.fromEntries(
        Object.entries(authHeader).filter(([_, value]) => value !== undefined)
      ),
    };

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const responseData = await safeJsonParse(res);

    if (!res.ok) {
      handleApiError(res, responseData);
    }

    return responseData;
  },

  put: async (
    endpoint: string,
    body: any,
    options: RequestInit = {},
    auth = false
  ) => {
    const authHeader = await getAuthHeader(auth);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
      ...Object.fromEntries(
        Object.entries(authHeader).filter(([_, value]) => value !== undefined)
      ),
    };

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });

    const responseData = await safeJsonParse(res);

    if (!res.ok) {
      handleApiError(res, responseData);
    }

    return responseData;
  },

  patch: async (
    endpoint: string,
    body: any,
    options: RequestInit = {},
    auth = false
  ) => {
    const authHeader = await getAuthHeader(auth);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
      ...Object.fromEntries(
        Object.entries(authHeader).filter(([_, value]) => value !== undefined)
      ),
    };

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    });

    const responseData = await safeJsonParse(res);

    if (!res.ok) {
      handleApiError(res, responseData);
    }

    return responseData;
  },

  delete: async (endpoint: string, options: RequestInit = {}, auth = false) => {
    const authHeader = await getAuthHeader(auth);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
      ...Object.fromEntries(
        Object.entries(authHeader).filter(([_, value]) => value !== undefined)
      ),
    };

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers,
      ...options,
    });

    const responseData = await safeJsonParse(res);

    if (!res.ok) {
      handleApiError(res, responseData);
    }

    return responseData;
  },

  upload: async (
    endpoint: string,
    formData: FormData,
    options: RequestInit = {},
    auth = false
  ) => {
    const authHeader = await getAuthHeader(auth);
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
      ...Object.fromEntries(
        Object.entries(authHeader).filter(([_, value]) => value !== undefined)
      ),
    };

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: formData,
    });

    const responseData = await safeJsonParse(res);

    if (!res.ok) {
      console.error('API upload error:', res.status, `${BASE_URL}${endpoint}`, responseData);
      handleApiError(res, responseData);
    }

    return responseData;
  },
  postForm: async (
    endpoint: string,
    formData: FormData,
    options: RequestInit = {},
    auth = false
  ) => {
    const authHeader = await getAuthHeader(auth);

    // Merge headers but DO NOT include Content-Type (fetch will set boundary automatically)
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
      ...Object.fromEntries(
        Object.entries(authHeader).filter(([_, value]) => value !== undefined)
      ),
    };

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: formData,
    });

    const responseData = await safeJsonParse(res);

    if (!res.ok) {
      handleApiError(res, responseData);
    }

    return responseData;
  },
};
