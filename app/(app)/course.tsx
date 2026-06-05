import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { Course } from "@/models/course/Course.model";
import { getCoursesForRole } from "@/services/course.service";
import { useAuthStore } from "@/stores/auth.store";

export default function CourseScreen() {
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);

  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("[CourseScreen] effect status/user:", {
      hasUser: Boolean(user),
      status,
    });

    if (status !== "authenticated" || !user) {
      console.warn("[CourseScreen] skipped fetch: user not authenticated");
      setLoading(false);
      return;
    }

    const currentUser = user;

    let isActive = true;

    async function loadCourses() {
      console.log("[CourseScreen] loadCourses start");
      setLoading(true);
      setError(null);

      try {
        const response = await getCoursesForRole(currentUser.role);
        console.log("[CourseScreen] getCoursesForRole response:", response);

        if (!isActive) {
          return;
        }

        setCourses(response.courses);
      } catch (loadError) {
        console.error("[CourseScreen] loadCourses error:", loadError);
        if (!isActive) {
          return;
        }

        setCourses([]);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load courses.",
        );
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    void loadCourses();

    return () => {
      isActive = false;
    };
  }, [status, user]);

  if (status !== "authenticated" || !user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredCard}>
          <Text style={styles.errorText}>Sign in to view your courses.</Text>
          <Pressable onPress={() => router.replace("/")} style={styles.button}>
            <Text style={styles.buttonText}>Back to sign in</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>Courses</Text>
          <Text style={styles.title}>Your course workspace</Text>
          <Text style={styles.subtitle}>
            Browse enrolled classes and open the classwork feed for any course.
          </Text>
        </View> */}

        {loading ? (
          <View style={styles.centeredCard}>
            <ActivityIndicator color="#1849d6" size="large" />
          </View>
        ) : null}

        {error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {!loading ? (
          <>
            {courses.length === 0 ? (
              <Text style={styles.emptyText}>No courses available yet.</Text>
            ) : (
              courses.map((course) => (
                <Pressable
                  key={course.courseId}
                  onPress={() => router.push(`/course/${course.courseId}`)}
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
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#1849d6",
    borderRadius: 14,
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  centeredCard: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    gap: 16,
    margin: 20,
    padding: 24,
  },
  content: {
    gap: 16,
    padding: 20,
  },
  courseCard: {
    backgroundColor: "#f7f9fc",
    borderColor: "#d8deea",
    borderRadius: 18,
    borderWidth: 1,
    gap: 8,
    padding: 16,
  },
  courseDescription: {
    color: "#5f6879",
    fontSize: 14,
    lineHeight: 20,
  },
  courseLink: {
    color: "#1849d6",
    fontSize: 13,
    fontWeight: "700",
  },
  courseTitle: {
    color: "#122033",
    fontSize: 16,
    fontWeight: "700",
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
  heroCard: {
    backgroundColor: "#122033",
    borderRadius: 24,
    gap: 10,
    padding: 24,
  },
  safeArea: {
    backgroundColor: "#edf2f8",
    flex: 1,
  },
  sectionTitle: {
    color: "#122033",
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    color: "#d3dbeb",
    fontSize: 15,
    lineHeight: 22,
  },
  title: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "800",
  },
});
