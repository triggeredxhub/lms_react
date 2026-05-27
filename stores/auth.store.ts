import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

import { AuthSource } from "@/models/auth/LoginResponse.model";
import { User, UserRole } from "@/models/auth/User.model";
import { getCurrentUser, loginByRole } from "@/services/auth.service";

type AuthStatus = "anonymous" | "authenticated" | "hydrating";

interface StoredSession {
  source: AuthSource;
  token: string;
  user: User;
}

interface AuthStore {
  error: string | null;
  isHydrated: boolean;
  source: AuthSource | null;
  status: AuthStatus;
  token: string | null;
  user: User | null;
  clearError: () => void;
  hydrate: () => Promise<void>;
  signIn: (role: UserRole, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AUTH_SOURCE_KEY = "auth_source";
const TOKEN_KEY = "auth_token";
const USER_KEY = "user";

async function getStoredItem(key: string) {
  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    return AsyncStorage.getItem(key);
  }
}

async function setStoredItem(key: string, value: string) {
  try {
    await SecureStore.setItemAsync(key, value);
    return;
  } catch {
    await AsyncStorage.setItem(key, value);
  }
}

async function deleteStoredItem(key: string) {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {
    await AsyncStorage.removeItem(key);
  }
}

async function readSession(): Promise<StoredSession | null> {
  const [token, userJson, source] = await Promise.all([
    getStoredItem(TOKEN_KEY),
    getStoredItem(USER_KEY),
    getStoredItem(AUTH_SOURCE_KEY),
  ]);

  if (!token || !userJson || !source) {
    return null;
  }

  try {
    return {
      source: source as AuthSource,
      token,
      user: JSON.parse(userJson) as User,
    };
  } catch {
    return null;
  }
}

async function persistSession(session: StoredSession) {
  await Promise.all([
    setStoredItem(TOKEN_KEY, session.token),
    setStoredItem(USER_KEY, JSON.stringify(session.user)),
    setStoredItem(AUTH_SOURCE_KEY, session.source),
  ]);
}

async function clearSessionStorage() {
  await Promise.all([
    deleteStoredItem(TOKEN_KEY),
    deleteStoredItem(USER_KEY),
    deleteStoredItem(AUTH_SOURCE_KEY),
  ]);
}

function toAuthSource(role: UserRole): AuthSource {
  return role === "student" ? "ems" : "hris";
}

function toErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to complete authentication request.";
}

export const useAuthStore = create<AuthStore>((set) => ({
  error: null,
  isHydrated: false,
  source: null,
  status: "hydrating",
  token: null,
  user: null,
  clearError: () => set({ error: null }),
  hydrate: async () => {
    set({ status: "hydrating", error: null });

    const session = await readSession();

    if (!session) {
      set({
        isHydrated: true,
        source: null,
        status: "anonymous",
        token: null,
        user: null,
      });
      return;
    }

    try {
      const currentUser = await getCurrentUser(session.source);
      const nextSession = { ...session, user: currentUser };

      await persistSession(nextSession);

      set({
        isHydrated: true,
        source: nextSession.source,
        status: "authenticated",
        token: nextSession.token,
        user: nextSession.user,
      });
    } catch (error) {
      await clearSessionStorage();
      set({
        error:
          error instanceof Error && error.message !== "AUTH_INVALID"
            ? error.message
            : null,
        isHydrated: true,
        source: null,
        status: "anonymous",
        token: null,
        user: null,
      });
    }
  },
  signIn: async (role, email, password) => {
    set({ error: null, status: "hydrating" });

    try {
      const response = await loginByRole(role, email, password);
      const session: StoredSession = {
        source: response.source ?? toAuthSource(response.user.role),
        token: response.token,
        user: response.user,
      };

      await persistSession(session);

      set({
        isHydrated: true,
        source: session.source,
        status: "authenticated",
        token: session.token,
        user: session.user,
      });
    } catch (error) {
      await clearSessionStorage();
      set({
        error: toErrorMessage(error),
        isHydrated: true,
        source: null,
        status: "anonymous",
        token: null,
        user: null,
      });
    }
  },
  signOut: async () => {
    await clearSessionStorage();
    set({
      error: null,
      isHydrated: true,
      source: null,
      status: "anonymous",
      token: null,
      user: null,
    });
  },
}));
