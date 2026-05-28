import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Course } from "@/models/course/Course.model";
import {
  AdminStats,
  AdminStudent,
  getAdminStats,
  getAdminStudents,
} from "@/services/admin.service";
import { getCoursesForRole } from "@/services/course.service";
import { useAuthStore } from "@/stores/auth.store";

type DashboardState = {
  courses: Course[];
  stats: AdminStats | null;
  students: AdminStudent[];
};

const initialDashboardState: DashboardState = {
  courses: [],
  stats: null,
  students: [],
};

export default function Index() {
  const clearError = useAuthStore((state) => state.clearError);
  const error = useAuthStore((state) => state.error);
  const signIn = useAuthStore((state) => state.signIn);
  const signOut = useAuthStore((state) => state.signOut);
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dashboard, setDashboard] = useState<DashboardState>(
    initialDashboardState,
  );
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    if (status === "authenticated" && user?.role === "admin") {
      router.replace("/admin" as never);
    }
  }, [status, user]);

  useEffect(() => {
    if (!user) {
      setDashboard(initialDashboardState);
      setDashboardError(null);
      return;
    }

    const currentUser = user;

    let isActive = true;

    async function loadDashboard() {
      setDashboardLoading(true);
      setDashboardError(null);

      try {
        const coursesResponse = await getCoursesForRole(currentUser.role);

        if (!isActive) {
          return;
        }

        if (currentUser.role === "admin") {
          const [stats, students] = await Promise.all([
            getAdminStats(),
            getAdminStudents(),
          ]);

          if (!isActive) {
            return;
          }

          setDashboard({
            courses: coursesResponse.courses,
            stats,
            students,
          });
          return;
        }

        setDashboard({
          courses: coursesResponse.courses,
          stats: null,
          students: [],
        });
      } catch (loadError) {
        if (!isActive) {
          return;
        }

        setDashboard(initialDashboardState);
        setDashboardError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load dashboard data.",
        );
      } finally {
        if (isActive) {
          setDashboardLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      isActive = false;
    };
  }, [user]);

  async function handleLogin() {
    await signIn(email.trim(), password);
  }

  if (status === "authenticated" && user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.dashboardContent}>
          <View style={styles.heroCard}>
            <View>
              <Text style={styles.eyebrow}>Signed in as {user.role}</Text>
              <Text style={styles.heroTitle}>
                {user.firstName} {user.lastName}
              </Text>
              <Text style={styles.heroSubtitle}>{user.email}</Text>
            </View>
            <Pressable
              onPress={() => void signOut()}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Sign out</Text>
            </Pressable>
          </View>

          {dashboardLoading ? (
            <View style={styles.sectionCard}>
              <ActivityIndicator color="#1849d6" />
            </View>
          ) : null}

          {dashboardError ? (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>{dashboardError}</Text>
            </View>
          ) : null}

          {user.role === "admin" && dashboard.stats ? (
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Admin overview</Text>
              <View style={styles.statGrid}>
                {Object.entries(dashboard.stats).map(([key, value]) => (
                  <View key={key} style={styles.statCard}>
                    <Text style={styles.statLabel}>{formatKey(key)}</Text>
                    <Text style={styles.statValue}>{String(value ?? "-")}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>
              {user.role === "student"
                ? "Enrolled courses"
                : user.role === "instructor"
                  ? "My courses"
                  : "Managed courses"}
            </Text>
            {dashboard.courses.length === 0 ? (
              <Text style={styles.emptyText}>No courses available yet.</Text>
            ) : (
              dashboard.courses.map((course) => (
                <Pressable
                  key={course.courseId}
                  onPress={() =>
                    router.push(`/course/${course.courseId}` as never)
                  }
                  style={styles.courseCard}
                >
                  <Text style={styles.courseTitle}>{course.courseName}</Text>
                  <Text style={styles.courseDescription}>
                    {course.courseDescription || "No description available."}
                  </Text>
                  <Text style={styles.courseLink}>Open classwork</Text>
                </Pressable>
              ))
            )}
          </View>

          {user.role === "admin" ? (
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Students</Text>
              {dashboard.students.length === 0 ? (
                <Text style={styles.emptyText}>No students available yet.</Text>
              ) : (
                dashboard.students.slice(0, 10).map((student, index) => (
                  <View
                    key={`${student.userId ?? student.studentId ?? index}`}
                    style={styles.listRow}
                  >
                    <Text style={styles.listTitle}>
                      {student.firstName || "Unknown"}{" "}
                      {student.lastName || "Student"}
                    </Text>
                    <Text style={styles.listSubtitle}>
                      {student.email || "No email"}
                    </Text>
                  </View>
                ))
              )}
            </View>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Login screen behavior:
  // - What: Collects email/password and triggers automatic role detection from backend.
  // - Why: Removes manual role selection and prevents incorrect endpoint choice by users.
  // - How: Call signIn(email, password); store/service resolve source and role for routing.
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
            disabled={status === "hydrating" || !email.trim() || !password}
            onPress={() => void handleLogin()}
            style={[
              styles.primaryButton,
              status === "hydrating" || !email.trim() || !password
                ? styles.primaryButtonDisabled
                : null,
            ]}
          >
            {status === "hydrating" ? (
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

function formatKey(value: string) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/^./, (letter) => letter.toUpperCase())
    .trim();
}

const styles = StyleSheet.create({
  courseCard: {
    backgroundColor: "#f7f9fc",
    borderColor: "#d8deea",
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
    padding: 16,
  },
  courseDescription: {
    color: "#5f6879",
    fontSize: 14,
    lineHeight: 20,
  },
  courseTitle: {
    color: "#122033",
    fontSize: 16,
    fontWeight: "700",
  },
  courseLink: {
    color: "#1849d6",
    fontSize: 13,
    fontWeight: "700",
  },
  dashboardContent: {
    gap: 16,
    padding: 20,
  },
  emptyText: {
    color: "#5f6879",
    fontSize: 14,
  },
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
  heroCard: {
    alignItems: "flex-start",
    backgroundColor: "#122033",
    borderRadius: 24,
    gap: 20,
    justifyContent: "space-between",
    padding: 24,
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
  listRow: {
    borderBottomColor: "#e6ebf3",
    borderBottomWidth: 1,
    gap: 4,
    paddingVertical: 12,
  },
  listSubtitle: {
    color: "#5f6879",
    fontSize: 13,
  },
  listTitle: {
    color: "#122033",
    fontSize: 15,
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
  roleChip: {
    backgroundColor: "#e8edf8",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  roleChipActive: {
    backgroundColor: "#1849d6",
  },
  roleChipText: {
    color: "#1b2940",
    fontSize: 13,
    fontWeight: "700",
  },
  roleChipTextActive: {
    color: "#ffffff",
  },
  safeArea: {
    backgroundColor: "#edf2f8",
    flex: 1,
  },
  secondaryButton: {
    backgroundColor: "#edf2f8",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: "#122033",
    fontSize: 13,
    fontWeight: "700",
  },
  sectionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    gap: 14,
    padding: 20,
  },
  sectionTitle: {
    color: "#122033",
    fontSize: 20,
    fontWeight: "700",
  },
  statCard: {
    backgroundColor: "#f7f9fc",
    borderColor: "#d8deea",
    borderRadius: 18,
    borderWidth: 1,
    flexBasis: "48%",
    gap: 6,
    padding: 16,
  },
  statGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statLabel: {
    color: "#5f6879",
    fontSize: 13,
    textTransform: "capitalize",
  },
  statValue: {
    color: "#122033",
    fontSize: 24,
    fontWeight: "800",
  },
});
