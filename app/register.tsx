import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    LayoutChangeEvent,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { StudentStatus } from "@/models/auth/User.model";
import { registerAccount } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";

type RegisterRole = "student" | "instructor";

export default function RegisterScreen() {
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);
  const scrollRef = useRef<ScrollView>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<RegisterRole>("student");
  const [studentStatus, setStudentStatus] = useState<StudentStatus>("regular");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [emailFieldY, setEmailFieldY] = useState(0);
  const [passwordFieldY, setPasswordFieldY] = useState(0);

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

  function handleLowerFieldFocus(fieldY: number) {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        animated: true,
        y: Math.max(0, fieldY - 120),
      });
    });
  }

  function captureFieldY(setter: (value: number) => void) {
    return (event: LayoutChangeEvent) => {
      setter(event.nativeEvent.layout.y);
    };
  }

  async function handleRegister() {
    const normalizedEmail = email.trim();

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !normalizedEmail ||
      !password ||
      (role === "student" && !studentStatus)
    ) {
      setError("Please complete all fields.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await registerAccount({
        email: normalizedEmail,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        password,
        role,
        studentStatus: role === "student" ? studentStatus : null,
      });

      router.replace("/");
    } catch (registerError) {
      setError(
        registerError instanceof Error
          ? registerError.message
          : "Unable to create your account.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundOrbTop} />
      <View style={styles.backgroundOrbBottom} />

      <KeyboardAvoidingView
        behavior={Platform.select({ android: "height", ios: "padding" })}
        style={styles.keyboardWrapper}
      >
        <ScrollView
          automaticallyAdjustKeyboardInsets
          contentContainerStyle={styles.screenContent}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          ref={scrollRef}
        >
          <View style={styles.headerRow}>
            <Pressable
              onPress={() => router.replace("/")}
              style={styles.backButton}
            >
              <Ionicons color="#0f172a" name="arrow-back" size={18} />
              <Text style={styles.backButtonText}>Back to sign in</Text>
            </Pressable>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>
              Register with your LMS profile to access classes and assignments.
            </Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>First name</Text>
              <TextInput
                onChangeText={setFirstName}
                placeholder="Juan"
                placeholderTextColor="#98a2b3"
                style={styles.input}
                value={firstName}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Last name</Text>
              <TextInput
                onChangeText={setLastName}
                placeholder="Dela Cruz"
                placeholderTextColor="#98a2b3"
                style={styles.input}
                value={lastName}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Role</Text>
              <View style={styles.optionRow}>
                <Pressable
                  onPress={() => setRole("student")}
                  style={[
                    styles.optionChip,
                    role === "student" ? styles.optionChipActive : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      role === "student" ? styles.optionChipTextActive : null,
                    ]}
                  >
                    Student
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setRole("instructor")}
                  style={[
                    styles.optionChip,
                    role === "instructor" ? styles.optionChipActive : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      role === "instructor"
                        ? styles.optionChipTextActive
                        : null,
                    ]}
                  >
                    Instructor
                  </Text>
                </Pressable>
              </View>
            </View>

            {role === "student" ? (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Student status</Text>
                <View style={styles.optionRow}>
                  <Pressable
                    onPress={() => setStudentStatus("regular")}
                    style={[
                      styles.optionChip,
                      studentStatus === "regular"
                        ? styles.optionChipActive
                        : null,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionChipText,
                        studentStatus === "regular"
                          ? styles.optionChipTextActive
                          : null,
                      ]}
                    >
                      Regular
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setStudentStatus("irregular")}
                    style={[
                      styles.optionChip,
                      studentStatus === "irregular"
                        ? styles.optionChipActive
                        : null,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionChipText,
                        studentStatus === "irregular"
                          ? styles.optionChipTextActive
                          : null,
                      ]}
                    >
                      Irregular
                    </Text>
                  </Pressable>
                </View>
              </View>
            ) : null}

            <View
              onLayout={captureFieldY(setEmailFieldY)}
              style={styles.formGroup}
            >
              <Text style={styles.label}>Email</Text>
              <TextInput
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={setEmail}
                onFocus={() => handleLowerFieldFocus(emailFieldY)}
                placeholder="name@example.com"
                placeholderTextColor="#98a2b3"
                style={styles.input}
                value={email}
              />
            </View>

            <View
              onLayout={captureFieldY(setPasswordFieldY)}
              style={styles.formGroup}
            >
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordInputWrapper}>
                <TextInput
                  onChangeText={setPassword}
                  onFocus={() => handleLowerFieldFocus(passwordFieldY)}
                  placeholder="Create your password"
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
              disabled={
                isSubmitting ||
                !firstName.trim() ||
                !lastName.trim() ||
                !role ||
                (role === "student" && !studentStatus) ||
                !email.trim() ||
                !password
              }
              onPress={() => void handleRegister()}
              style={[
                styles.primaryButton,
                isSubmitting ||
                !firstName.trim() ||
                !lastName.trim() ||
                !role ||
                (role === "student" && !studentStatus) ||
                !email.trim() ||
                !password
                  ? styles.primaryButtonDisabled
                  : null,
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.primaryButtonText}>Create account</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    paddingVertical: 6,
  },
  backButtonText: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "600",
  },
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
  formContainer: {
    gap: 16,
    maxWidth: 520,
    paddingTop: 8,
    width: "100%",
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
  headerRow: {
    marginBottom: 6,
    width: "100%",
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
  keyboardWrapper: {
    flex: 1,
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
  optionChip: {
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderColor: "#d7dde7",
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  optionChipActive: {
    backgroundColor: "#e8efff",
    borderColor: "#1d4ed8",
  },
  optionChipText: {
    color: "#344054",
    fontSize: 14,
    fontWeight: "600",
  },
  optionChipTextActive: {
    color: "#1d4ed8",
  },
  optionRow: {
    flexDirection: "row",
    gap: 10,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#1d4ed8",
    borderRadius: 14,
    elevation: 5,
    justifyContent: "center",
    marginTop: 4,
    minHeight: 52,
    paddingHorizontal: 20,
    shadowColor: "#1d4ed8",
    shadowOffset: {
      height: 8,
      width: 0,
    },
    shadowOpacity: 0.22,
    shadowRadius: 16,
  },
  primaryButtonDisabled: {
    backgroundColor: "#9bb2ef",
    elevation: 0,
    shadowOpacity: 0,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  safeArea: {
    backgroundColor: "#f3f6fb",
    flex: 1,
  },
  screenContent: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "flex-start",
    minHeight: "100%",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 36,
  },
  subtitle: {
    color: "#667085",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 2,
  },
  title: {
    color: "#0f172a",
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  visibilityButton: {
    alignItems: "center",
    height: 46,
    justifyContent: "center",
    marginRight: 4,
    width: 46,
  },
});
