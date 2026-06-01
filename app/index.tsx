import { Ionicons } from "@expo/vector-icons";
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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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
      <View style={styles.backgroundOrbTop} />
      <View style={styles.backgroundOrbBottom} />

      <ScrollView
        contentContainerStyle={styles.loginContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* <View style={styles.brandSection}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>LMS</Text>
          </View>
          <Text style={styles.brandTitle}>Acme Learning</Text>
          <Text style={styles.brandSubtitle}>Modern learning workspace</Text>
        </View> */}

        <View style={styles.loginCard}>
          <Text style={styles.cardTitle}>Welcome back</Text>
          <Text style={styles.cardSubtitle}>
            Sign in to continue to your courses and classwork.
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
            <View style={styles.passwordInputWrapper}>
              <TextInput
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#98a2b3"
                secureTextEntry={!isPasswordVisible}
                style={styles.passwordInput}
                value={password}
              />
              <Pressable
                accessibilityLabel={
                  isPasswordVisible ? "Hide password" : "Show password"
                }
                accessibilityRole="button"
                hitSlop={10}
                onPress={() => setIsPasswordVisible((current) => !current)}
                style={styles.visibilityButton}
              >
                <Ionicons
                  color="#5f6879"
                  name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                  size={20}
                />
              </Pressable>
            </View>
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

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Dont have account?</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/register" as never)}
              style={styles.registerLinkButton}
            >
              <Text style={styles.registerLinkText}>Enroll now</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundOrbBottom: {
    backgroundColor: "#e8f0ff",
    borderRadius: 180,
    bottom: -90,
    height: 220,
    position: "absolute",
    right: -80,
    width: 220,
  },
  backgroundOrbTop: {
    backgroundColor: "#e9f4ff",
    borderRadius: 180,
    height: 220,
    left: -70,
    position: "absolute",
    top: -110,
    width: 220,
  },
  brandSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  brandSubtitle: {
    color: "#667085",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
  },
  brandTitle: {
    color: "#111827",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.3,
    marginTop: 14,
  },
  cardSubtitle: {
    color: "#667085",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 6,
  },
  cardTitle: {
    color: "#0f172a",
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  errorCard: {
    backgroundColor: "#fff6f5",
    borderColor: "#f6c4bc",
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  errorText: {
    color: "#b33a2d",
    fontSize: 14,
    lineHeight: 20,
  },
  formGroup: {
    gap: 10,
  },
  input: {
    backgroundColor: "#f8fafc",
    borderColor: "#d7dde7",
    borderRadius: 14,
    borderWidth: 1,
    color: "#111827",
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  label: {
    color: "#374151",
    fontSize: 13,
    fontWeight: "700",
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
    backgroundColor: "#ffffff",
    borderRadius: 26,
    gap: 18,
    maxWidth: 520,
    padding: 24,
    shadowColor: "#0b1220",
    shadowOffset: {
      height: 14,
      width: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    width: "100%",
    elevation: 8,
  },
  loginContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 28,
    alignItems: "center",
    minHeight: "100%",
  },
  logoBadge: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#d6e3ff",
    borderRadius: 18,
    borderWidth: 1,
    height: 56,
    justifyContent: "center",
    width: 56,
  },
  logoBadgeText: {
    color: "#1849d6",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.9,
  },
  passwordInput: {
    color: "#111827",
    flex: 1,
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  passwordInputWrapper: {
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderColor: "#d7dde7",
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#1d4ed8",
    borderRadius: 14,
    justifyContent: "center",
    minHeight: 52,
    marginTop: 4,
    paddingHorizontal: 20,
    shadowColor: "#1d4ed8",
    shadowOffset: {
      height: 8,
      width: 0,
    },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 5,
  },
  primaryButtonDisabled: {
    backgroundColor: "#9bb2ef",
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  registerLinkButton: {
    paddingVertical: 4,
  },
  registerLinkText: {
    color: "#1d4ed8",
    fontSize: 14,
    fontWeight: "700",
  },
  registerRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    marginTop: 2,
  },
  registerText: {
    color: "#667085",
    fontSize: 14,
  },
  safeArea: {
    backgroundColor: "#f3f6fb",
    flex: 1,
  },
  visibilityButton: {
    alignItems: "center",
    height: 46,
    justifyContent: "center",
    marginRight: 4,
    width: 46,
  },
});
