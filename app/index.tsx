import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthStore } from "@/stores/auth.store";

export default function Index() {
  const clearError = useAuthStore((state) => state.clearError);
  const error = useAuthStore((state) => state.error);
  const signIn = useAuthStore((state) => state.signIn);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isSigningIn = useAuthStore((state) => state.status === "hydrating");
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    if (status !== "authenticated" || !user) {
      return;
    }

    if (user.role === "admin") {
      router.replace("/admin");
      return;
    }

    router.replace("/course");
  }, [status, user]);

  async function handleLogin() {
    await signIn(email.trim(), password);
  }

  if (!isHydrated || status === "authenticated") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingScreen}>
          <ActivityIndicator color="#1849d6" size="large" />
          <Text style={styles.loadingText}>Opening your workspace...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.loginContent}>
        <View style={styles.loginCard}>
          <Text style={styles.eyebrow}>Learning Management System</Text>
          <Text style={styles.heroTitle}>Welcome back</Text>
          <Text style={styles.heroSubtitle}>
            Sign in with your LMS account. We will route you automatically based
            on your profile.
          </Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="name@example.com"
              placeholderTextColor="#7f8898"
              style={styles.input}
              value={email}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#7f8898"
              secureTextEntry
              style={styles.input}
              value={password}
            />
          </View>

          {error ? (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Pressable
            disabled={isSigningIn || !email.trim() || !password}
            onPress={() => void handleLogin()}
            style={[
              styles.primaryButton,
              isSigningIn || !email.trim() || !password
                ? styles.primaryButtonDisabled
                : null,
            ]}
          >
            {isSigningIn ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.primaryButtonText}>Sign in</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  errorCard: {
    backgroundColor: "#fff0ee",
    borderColor: "#f3b8af",
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  errorText: {
    color: "#b33a2d",
    fontSize: 14,
    lineHeight: 20,
  },
  eyebrow: {
    color: "#1849d6",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  formGroup: {
    gap: 8,
  },
  heroSubtitle: {
    color: "#d3dbeb",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "800",
    marginTop: 8,
  },
  input: {
    backgroundColor: "#f7f9fc",
    borderColor: "#d8deea",
    borderRadius: 14,
    borderWidth: 1,
    color: "#122033",
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  label: {
    color: "#32415a",
    fontSize: 14,
    fontWeight: "600",
  },
  loadingScreen: {
    alignItems: "center",
    flex: 1,
    gap: 14,
    justifyContent: "center",
  },
  loadingText: {
    color: "#32415a",
    fontSize: 14,
    fontWeight: "600",
  },
  loginCard: {
    backgroundColor: "#122033",
    borderRadius: 28,
    gap: 18,
    padding: 24,
  },
  loginContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#1849d6",
    borderRadius: 14,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: 20,
  },
  primaryButtonDisabled: {
    backgroundColor: "#6f89cf",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  safeArea: {
    backgroundColor: "#edf2f8",
    flex: 1,
  },
});
