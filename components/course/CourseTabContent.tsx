import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";

import type { CourseTabKey } from "@/lib/course-detail-context";
import { useCourseDetailContext } from "@/lib/course-detail-context";
import {
    formatFeedType,
    getEmptyState,
    getFeedLinkLabelForTab,
    getItemDescription,
    getItemId,
    getItemsForTab,
    getItemTitle,
    getSectionTitle,
} from "@/lib/course-feed-tabs";
import type { CourseFeedItem } from "@/models/course/CourseFeed.model";

export function CourseTabContent(props: { tab: CourseTabKey }) {
  const { tab } = props;
  const { error, isInstructor, loading, screenState, status, user } =
    useCourseDetailContext();

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

  const items = getItemsForTab(tab, screenState.feed);

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
            <Text style={styles.sectionTitle}>{getSectionTitle(tab)}</Text>

            {tab === "studentlist" ? (
              <View style={styles.studentListCard}>
                <Text style={styles.studentListHeading}>Student list view</Text>
                {isInstructor ? (
                  <Text style={styles.studentListText}>
                    Student list data is not yet available from the course API.
                    This tab is ready for endpoint integration.
                  </Text>
                ) : (
                  <Text style={styles.studentListText}>
                    Only instructors can access the student list.
                  </Text>
                )}
                <Text style={styles.studentListMeta}>
                  Course feed items currently loaded: {screenState.feed.length}
                </Text>
              </View>
            ) : items.length === 0 ? (
              <Text style={styles.emptyText}>{getEmptyState(tab)}</Text>
            ) : (
              items.map((item) => (
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
                  <Text style={styles.feedLink}>
                    {getFeedLinkLabelForTab(tab, item)}
                  </Text>
                </Pressable>
              ))
            )}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
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
  studentListCard: {
    backgroundColor: "#f7f9fc",
    borderColor: "#d8deea",
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
    padding: 16,
  },
  studentListHeading: {
    color: "#122033",
    fontSize: 16,
    fontWeight: "700",
  },
  studentListMeta: {
    color: "#32415a",
    fontSize: 13,
    fontWeight: "600",
  },
  studentListText: {
    color: "#5f6879",
    fontSize: 14,
    lineHeight: 20,
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
