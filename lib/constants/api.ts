import Constants from "expo-constants";
import { Platform } from "react-native";

const FALLBACK_API_BASE_URL = "http://localhost:3000";

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function toRuntimeHostFromExpo(): string | null {
  const expoConfigHost =
    Constants.expoConfig && "hostUri" in Constants.expoConfig
      ? (Constants.expoConfig as { hostUri?: string }).hostUri
      : undefined;
  const expoGoHost =
    Constants.expoGoConfig && "debuggerHost" in Constants.expoGoConfig
      ? (Constants.expoGoConfig as { debuggerHost?: string }).debuggerHost
      : undefined;

  const hostWithPort = expoConfigHost ?? expoGoHost;

  if (!hostWithPort || typeof hostWithPort !== "string") {
    return null;
  }

  const [host] = hostWithPort.split(":");
  return host || null;
}

function normalizeLocalhostBaseUrl(baseUrl: string) {
  if (!/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(baseUrl)) {
    return baseUrl;
  }

  if (Platform.OS === "android") {
    const runtimeHost = toRuntimeHostFromExpo();

    if (
      runtimeHost &&
      runtimeHost !== "localhost" &&
      runtimeHost !== "127.0.0.1"
    ) {
      return baseUrl.replace(/localhost|127\.0\.0\.1/i, runtimeHost);
    }

    return baseUrl.replace(/localhost|127\.0\.0\.1/i, "10.0.2.2");
  }

  return baseUrl;
}

function resolveApiBaseUrl() {
  const extra = (Constants.expoConfig?.extra ?? {}) as {
    apiBaseUrl?: string;
  };
  const envBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  const configuredBaseUrl = extra.apiBaseUrl ?? envBaseUrl;
  const rawBaseUrl = configuredBaseUrl || FALLBACK_API_BASE_URL;

  return trimTrailingSlash(normalizeLocalhostBaseUrl(rawBaseUrl));
}

export const API_CONFIG = {
  BASE_URL: resolveApiBaseUrl(),
};
