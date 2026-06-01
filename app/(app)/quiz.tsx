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

import type { QuizFeedItem } from "@/models/course/CourseFeed.model";
import {
    getCourseClassworkForRole,
    getCoursesForRole,
} from "@/services/course.service";
import { useAuthStore } from "@/stores/auth.store";

type QuizRow = QuizFeedItem & {
  courseName: string;
};

export default function QuizScreen() {
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);

  const [quizzes, setQuizzes] = useState<QuizRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated" || !user) {
      setLoading(false);
      return;
    }

    const currentUser = user;

    let isActive = true;

    async function loadQuizzes() {
      setLoading(true);
      setError(null);

      try {
        const coursesResponse = await getCoursesForRole(currentUser.role);
        const courseQuizzes = await Promise.all(
          coursesResponse.courses.map(async (course) => {
            const classwork = await getCourseClassworkForRole(
              String(course.courseId),
              currentUser.role,
            );

            return classwork
              .filter((item): item is QuizFeedItem => item.type === "quiz")
              .map((item) => ({
                ...item,
                courseName: course.courseName,
              }));
          }),
        );

        if (!isActive) {
          return;
        }

        setQuizzes(flattenAndSortQuizzes(courseQuizzes));
      } catch (loadError) {
        if (!isActive) {
          return;
        }

        setQuizzes([]);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load quizzes.",
        );
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    void loadQuizzes();

    return () => {
      isActive = false;
    };
  }, [status, user]);

  if (status !== "authenticated" || !user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredCard}>
          <Text style={styles.errorText}>Sign in to view quizzes.</Text>
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
          <Text style={styles.eyebrow}>Quizzes</Text>
          <Text style={styles.title}>Keep track of tests</Text>
          <Text style={styles.subtitle}>
            Review quizzes from all of your enrolled courses.
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
            <Text style={styles.sectionTitle}>Available quizzes</Text>
            {quizzes.length === 0 ? (
              <Text style={styles.emptyText}>No quizzes available yet.</Text>
            ) : (
              quizzes.map((quiz) => (
                <Pressable
                  key={`${quiz.courseId}-${quiz.quizId}`}
                  onPress={() => router.push(`/quiz/${quiz.quizId}`)}
                  style={styles.quizCard}
                >
                  <Text style={styles.quizCourse}>{quiz.courseName}</Text>
                  <Text style={styles.quizTitle}>{quiz.quizTitle}</Text>
                  <Text style={styles.quizDescription}>
                    {quiz.description || "No quiz description."}
                  </Text>
                  <View style={styles.quizMetaRow}>
                    <Text style={styles.quizMeta}>
                      Due {formatDate(quiz.due_date)}
                    </Text>
                    <Text style={styles.quizMeta}>
                      Time limit {String(quiz.timeLimit ?? "-")}
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

function flattenAndSortQuizzes(chunks: QuizRow[][]) {
  return chunks.flat().sort((left, right) => {
    const leftTime = new Date(left.due_date || left.createdAt).getTime();
    const rightTime = new Date(right.due_date || right.createdAt).getTime();
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
  quizCard: {
    backgroundColor: "#f7f9fc",
    borderColor: "#d8deea",
    borderRadius: 18,
    borderWidth: 1,
    gap: 8,
    padding: 16,
  },
  quizCourse: {
    color: "#1849d6",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  quizDescription: {
    color: "#5f6879",
    fontSize: 14,
    lineHeight: 20,
  },
  quizMeta: {
    color: "#32415a",
    fontSize: 12,
    fontWeight: "600",
  },
  quizMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
  },
  quizTitle: {
    color: "#122033",
    fontSize: 16,
    fontWeight: "700",
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
