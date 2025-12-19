import { AnnouncementCard } from "@/components/ui/AnnouncementCard";
import { ProjectNotificationCard } from "@/components/ui/NotificationCard";
import colors from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

  return (
    // Only protect TOP safe area (important)
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.screen}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.white} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Course Title</Text>
            <Text style={styles.headerSubtitle}>
              Course Overview Content
            </Text>
          </View>
        </View>

        {/* BODY (Scrollable) */}
        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Announcements */}
          <View style={styles.section}>
            <AnnouncementCard
              title="Announcements"
              subtitle="Don't forget to submit your wireframes by Friday!"
              time="2 hours ago"
            />
          </View>

          {/* Up Next */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Up Next</Text>
            <ProjectNotificationCard
              title="Project: Wireframing"
              dueText="Due Tomorrow"
            />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Course Overview / Description
            </Text>
            <Text style={styles.description}>
              This course provides an in-depth understanding of user experience
              (UX) design principles and practices. Students will learn how to
              create user-centered designs through research.
            </Text>
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
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
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
    fontSize: 14,
    lineHeight: 22,
    color: colors.subtext,
  },
});
