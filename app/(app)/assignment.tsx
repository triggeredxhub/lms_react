import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import type { AssignmentFeedItem } from "@/models/course/CourseFeed.model";
import {
    getCourseClassworkForRole,
    getCoursesForRole,
} from "@/services/course.service";
import { useAuthStore } from "@/stores/auth.store";

type AssignmentRow = AssignmentFeedItem & {
  courseName: string;
};

export default function AssignmentScreen() {
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);

  const [assignments, setAssignments] = useState<AssignmentRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated" || !user) {
      setLoading(false);
      return;
    }

    const currentUser = user;

    let isActive = true;

    async function loadAssignments() {
      setLoading(true);
      setError(null);

      try {
        const coursesResponse = await getCoursesForRole(currentUser.role);
        const courseAssignments = await Promise.all(
          coursesResponse.courses.map(async (course) => {
            const classwork = await getCourseClassworkForRole(
              String(course.courseId),
              currentUser.role,
            );

            return classwork
              .filter(
                (item): item is AssignmentFeedItem =>
                  item.type === "assignment",
              )
              .map((item) => ({
                ...item,
                courseName: course.courseName,
              }));
          }),
        );

        if (!isActive) {
          return;
        }

        setAssignments(flattenAndSortAssignments(courseAssignments));
      } catch (loadError) {
        if (!isActive) {
          return;
        }

        setAssignments([]);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load assignments.",
        );
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    void loadAssignments();

    return () => {
      isActive = false;
    };
  }, [status, user]);

  if (status !== "authenticated" || !user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredCard}>
          <Text style={styles.errorText}>Sign in to view assignments.</Text>
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
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>Assignments</Text>
          <Text style={styles.title}>Track your work</Text>
          <Text style={styles.subtitle}>
            Review assignment deadlines across all of your courses.
          </Text>
        </View>

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
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Upcoming assignments</Text>
            {assignments.length === 0 ? (
              <Text style={styles.emptyText}>
                No assignments available yet.
              </Text>
            ) : (
              assignments.map((assignment) => (
                <Pressable
                  key={`${assignment.courseId}-${assignment.assignmentId}`}
                  onPress={() =>
                    router.push(`/assignment/${assignment.assignmentId}`)
                  }
                  style={styles.assignmentCard}
                >
                  <Text style={styles.assignmentCourse}>
                    {assignment.courseName}
                  </Text>
                  <Text style={styles.assignmentTitle}>{assignment.title}</Text>
                  <Text style={styles.assignmentDescription}>
                    {assignment.description || "No assignment description."}
                  </Text>
                  <View style={styles.assignmentMetaRow}>
                    <Text style={styles.assignmentMeta}>
                      Due {formatDate(assignment.dueDate)}
                    </Text>
                    <Text style={styles.assignmentMeta}>
                      Max score {String(assignment.max_score ?? "-")}
                    </Text>
                  </View>
                </Pressable>
              ))
            )}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function flattenAndSortAssignments(chunks: AssignmentRow[][]) {
  return chunks.flat().sort((left, right) => {
    const leftTime = new Date(left.dueDate || left.createdAt).getTime();
    const rightTime = new Date(right.dueDate || right.createdAt).getTime();
    return (
      (Number.isNaN(leftTime) ? 0 : leftTime) -
      (Number.isNaN(rightTime) ? 0 : rightTime)
    );
  });
}

function formatDate(value: string) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? value || "Not available"
    : parsed.toLocaleString();
}

const styles = StyleSheet.create({
  assignmentCard: {
    backgroundColor: "#f7f9fc",
    borderColor: "#d8deea",
    borderRadius: 18,
    borderWidth: 1,
    gap: 8,
    padding: 16,
  },
  assignmentCourse: {
    color: "#1849d6",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  assignmentDescription: {
    color: "#5f6879",
    fontSize: 14,
    lineHeight: 20,
  },
  assignmentMeta: {
    color: "#32415a",
    fontSize: 12,
    fontWeight: "600",
  },
  assignmentMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
  },
  assignmentTitle: {
    color: "#122033",
    fontSize: 16,
    fontWeight: "700",
  },
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
