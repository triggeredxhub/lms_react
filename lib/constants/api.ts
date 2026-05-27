import Constants from "expo-constants";

const FALLBACK_API_BASE_URL = "http://localhost:3000";

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function resolveApiBaseUrl() {
  const extra = (Constants.expoConfig?.extra ?? {}) as {
    apiBaseUrl?: string;
  };
  const envBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  const configuredBaseUrl = extra.apiBaseUrl ?? envBaseUrl;

  return trimTrailingSlash(configuredBaseUrl || FALLBACK_API_BASE_URL);
}

export const API_CONFIG = {
  BASE_URL: resolveApiBaseUrl(),
};
