import { router } from "expo-router";
import { useEffect } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { useAuthStore } from "@/stores/auth.store";

export default function AdminScreen() {
  const signOut = useAuthStore((state) => state.signOut);
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (status !== "authenticated") {
      router.replace("/");
      return;
    }

    if (user?.role !== "admin") {
      router.replace("/");
    }
  }, [status, user]);

  if (status !== "authenticated" || user?.role !== "admin") {
    return null;
  }

  // Temporary admin route:
  // - What: Shows an interim destination for admin users.
  // - Why: Web admin panel is not available in mobile yet.
  // - How: Authenticated admin is redirected here from index and can sign out.
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Temporary admin destination</Text>
        <Text style={styles.title}>Hello admin</Text>
        <Text style={styles.subtitle}>
          The admin web panel is not available in the mobile app yet.
        </Text>

        <Pressable style={styles.button} onPress={() => void signOut()}>
          <Text style={styles.buttonText}>Sign out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#1849d6",
    borderRadius: 12,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    gap: 12,
    margin: 20,
    padding: 20,
  },
  eyebrow: {
    color: "#1849d6",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  safeArea: {
    backgroundColor: "#edf2f8",
    flex: 1,
    justifyContent: "center",
  },
  subtitle: {
    color: "#5f6879",
    fontSize: 15,
    lineHeight: 22,
  },
  title: {
    color: "#122033",
    fontSize: 28,
    fontWeight: "800",
  },
});
