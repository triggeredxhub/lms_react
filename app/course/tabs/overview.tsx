import { ClassworkCard } from "@/components/ui/ClassworkCard";
import colors from "@/constants/colors";
import { Course } from "@/models/course/Course.model";
import { CourseFeedItem } from "@/models/course/CourseFeed.model";
import { getCourse, getCourseClasswork } from "@/services/course.service";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OverviewTab() {
  const router = useRouter();
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  console.log("Course ID from params:", courseId);
  const [loading, setLoading] = useState(true);
  const [classworkLoading, setClassworkLoading] = useState(true);
  const [courseDetails, setCourseDetails] = useState<Course | null>(null);
  const [classworks, setClasswork] = useState<CourseFeedItem[]>([]);

  const fetchCourseData = async () => {
    try {
      const data = await getCourse(courseId!);
      setCourseDetails(data);
    } catch (error) {
      console.error("Failed to fetch course:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasswork = async () => {
    try {
      const data = await getCourseClasswork(courseId!);
      setClasswork(data);
    } catch (error) {
      console.error("Failed to fetch classwork:", error);
    } finally {
      setClassworkLoading(false);
    }
  };

  useEffect(() => {
    if (!courseId) return;

    async function loadData() {
      try {
        const [course, classwork] = await Promise.all([
          getCourse(courseId),
          getCourseClasswork(courseId),
        ]);

        setCourseDetails(course);
        setClasswork(classwork);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
        setClassworkLoading(false);
      }
    }

    loadData();
  }, [courseId]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.screen}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>
              {loading ? "Loading..." : courseDetails?.courseName}
            </Text>
          </View>
        </View>

        {/* BODY */}
        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Course Overview / Description
            </Text>
            <Text style={styles.description}>
              {loading
                ? "Loading course description..."
                : (courseDetails?.courseDescription ??
                  "No description available.")}
            </Text>
          </View>
          {/* Up Next */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Up Next</Text>
            {classworkLoading ? (
              <Text>Loading classwork...</Text>
            ) : classworks.length === 0 ? (
              <Text>No classwork available</Text>
            ) : (
              classworks.map((item, index) => {
                let itemId: number;
                let itemTitle: string;

                switch (item.type) {
                  case "announcement":
                    itemId = item.announcementId;
                    itemTitle = item.title;
                    break;
                  case "material":
                    itemId = item.materialId;
                    itemTitle = item.title;
                    break;
                  case "quiz":
                    itemId = item.quizId;
                    itemTitle = item.quizTitle;
                    break;
                  case "discussion":
                    itemId = item.discussionId;
                    itemTitle = item.title;
                    break;
                  default:
                    itemId = index;
                    itemTitle = "Untitled";
                }

                return (
                  <ClassworkCard
                    key={`${item.type}-${itemId}`}
                    id={itemId}
                    title={itemTitle}
                    type={item.type}
                    createdAt={
                      item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : "Unknown date"
                    }
                    onPress={(id) => router.push("/auth")}
                  />
                );
              })
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.blue,
  },

  screen: {
    flex: 1,
    backgroundColor: colors.blue,
  },

  /* ---------- HEADER ---------- */

  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: "row",
    marginTop: 8,
  },

  backButton: {
    alignItems: "center",
    flexDirection: "row",
    marginRight: 8,
  },

  backText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },

  headerText: {
    gap: 4,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.white,
  },

  headerSubtitle: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
  },

  /* ---------- BODY ---------- */

  body: {
    flex: 1,
    backgroundColor: colors.background,
  },

  bodyContent: {
    padding: 16,
    paddingBottom: 32, // 🔑 prevents bottom gap with tab bar
  },

  /* ---------- SECTIONS ---------- */

  section: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: colors.text,
  },

  description: {
    fontSize: 13,
    lineHeight: 22,
    color: colors.subtext,
  },
});
