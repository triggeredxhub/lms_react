import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token =
          (await SecureStore.getItemAsync("auth_token")) ??
          (await AsyncStorage.getItem("auth_token"));

        // Also check if user object with userId exists
        let userStr: string | null = null;
        try {
          userStr = await SecureStore.getItemAsync("user");
        } catch {
          userStr = await AsyncStorage.getItem("user");
        }

        // Validate complete auth state
        let hasValidAuth = false;

        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            // Check if userId exists and is valid
            if (user && user.userId) {
              hasValidAuth = true;
            } else {
              console.log(
                "Invalid user data: missing userId, clearing storage",
              );
              await clearStorage();
            }
          } catch (parseError) {
            console.log(
              "Invalid user data: JSON parse error, clearing storage",
            );
            await clearStorage();
          }
        } else if (token && !userStr) {
          // Token exists but no user data - invalid state
          console.log("Token exists but no user data, clearing storage");
          await clearStorage();
        }

        setIsLoggedIn(hasValidAuth);
      } catch (error) {
        console.log("Auth check error:", error);
        setIsLoggedIn(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  const clearStorage = async () => {
    try {
      await SecureStore.deleteItemAsync("auth_token");
      await SecureStore.deleteItemAsync("user");
    } catch {
      // Fallback to AsyncStorage
      await AsyncStorage.removeItem("auth_token");
      await AsyncStorage.removeItem("user");
    }
  };

  // Prevent flicker while checking storage
  if (checkingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isLoggedIn) {
    return <Redirect href="/auth" />;
  }

  return <Redirect href="/(drawer)/courseList" />;
}
