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

import { router, useLocalSearchParams } from "expo-router";

import { Course } from "@/models/course/Course.model";
import { CourseFeedItem } from "@/models/course/CourseFeed.model";
import {
    getCourse,
    getCourseClassworkForRole,
} from "@/services/course.service";
import { useAuthStore } from "@/stores/auth.store";

type ScreenState = {
  course: Course | null;
  feed: CourseFeedItem[];
};

const initialState: ScreenState = {
  course: null,
  feed: [],
};

export default function CourseDetailScreen() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);

  const [screenState, setScreenState] = useState(initialState);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId || !user || status !== "authenticated") {
      setLoading(false);
      return;
    }

    let isActive = true;

    async function loadCourse() {
      setLoading(true);
      setError(null);

      try {
        const [course, feed] = await Promise.all([
          getCourse(courseId),
          getCourseClassworkForRole(courseId, user.role),
        ]);

        if (!isActive) {
          return;
        }

        setScreenState({ course, feed });
      } catch (loadError) {
        if (!isActive) {
          return;
        }

        setScreenState(initialState);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load course details.",
        );
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    void loadCourse();

    return () => {
      isActive = false;
    };
  }, [courseId, status, user]);

  if (status !== "authenticated" || !user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredCard}>
          <Text style={styles.errorText}>Sign in to view course details.</Text>
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
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
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

        {screenState.course ? (
          <View style={styles.heroCard}>
            <Text style={styles.eyebrow}>{user.role} course</Text>
            <Text style={styles.title}>{screenState.course.courseName}</Text>
            <Text style={styles.subtitle}>
              {screenState.course.courseDescription ||
                "No description available."}
            </Text>
          </View>
        ) : null}

        {!loading ? (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Classwork feed</Text>
            {screenState.feed.length === 0 ? (
              <Text style={styles.emptyText}>
                No classwork items available yet.
              </Text>
            ) : (
              screenState.feed.map((item) => (
                <Pressable
                  key={`${item.type}-${getItemId(item)}`}
                  onPress={() => handleItemPress(item)}
                  style={styles.feedCard}
                >
                  <Text style={styles.feedType}>
                    {formatFeedType(item.type)}
                  </Text>
                  <Text style={styles.feedTitle}>{getItemTitle(item)}</Text>
                  <Text style={styles.feedDescription}>
                    {getItemDescription(item)}
                  </Text>
                  <Text style={styles.feedLink}>{getFeedLinkLabel(item)}</Text>
                </Pressable>
              ))
            )}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function getItemId(item: CourseFeedItem) {
  switch (item.type) {
    case "announcement":
      return item.announcementId;
    case "assignment":
      return item.assignmentId;
    case "discussion":
      return item.discussionId;
    case "material":
      return item.materialId;
    case "quiz":
      return item.quizId;
  }
}

function getItemTitle(item: CourseFeedItem) {
  switch (item.type) {
    case "announcement":
      return item.title;
    case "assignment":
      return item.title;
    case "discussion":
      return item.title;
    case "material":
      return item.title;
    case "quiz":
      return item.quizTitle;
  }
}

function getItemDescription(item: CourseFeedItem) {
  switch (item.type) {
    case "announcement":
      return item.content || "No content provided.";
    case "assignment":
      return item.description || "No assignment description provided.";
    case "discussion":
      return item.content || "No discussion content provided.";
    case "material":
      return item.description || "No material description provided.";
    case "quiz":
      return item.description || "No quiz description provided.";
  }
}

function formatFeedType(type: CourseFeedItem["type"]) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function handleItemPress(item: CourseFeedItem) {
  switch (item.type) {
    case "assignment":
      router.push(`/assignment/${item.assignmentId}` as never);
      return;
    case "material":
      router.push(`/material/${item.materialId}` as never);
      return;
    case "quiz":
      router.push(`/quiz/${item.quizId}` as never);
      return;
    default:
      return;
  }
}

function getFeedLinkLabel(item: CourseFeedItem) {
  switch (item.type) {
    case "assignment":
      return "Open assignment";
    case "material":
      return "Open material";
    case "quiz":
      return "Open quiz";
    default:
      return "Detail screen coming next";
  }
}

const styles = StyleSheet.create({
  backButton: {
    backgroundColor: "#dfe8fb",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  backButtonText: {
    color: "#1849d6",
    fontSize: 13,
    fontWeight: "700",
  },
  button: {
    backgroundColor: "#1849d6",
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 12,
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
    color: "#9db7ff",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  feedCard: {
    backgroundColor: "#f7f9fc",
    borderColor: "#d8deea",
    borderRadius: 18,
    borderWidth: 1,
    gap: 8,
    padding: 16,
  },
  feedDescription: {
    color: "#5f6879",
    fontSize: 14,
    lineHeight: 20,
  },
  feedLink: {
    color: "#1849d6",
    fontSize: 13,
    fontWeight: "700",
  },
  feedTitle: {
    color: "#122033",
    fontSize: 16,
    fontWeight: "700",
  },
  feedType: {
    color: "#1849d6",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.7,
    textTransform: "uppercase",
  },
  headerRow: {
    alignItems: "flex-start",
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
    fontSize: 28,
    fontWeight: "800",
  },
});
