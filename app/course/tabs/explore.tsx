import { ActivityCard } from "@/components/ui/ActivityCard";
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

export default function ExploreTab() {
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
            <Text style={styles.headerSubtitle}>Course Overview Content</Text>
          </View>
        </View>

        {/* BODY (Scrollable) */}
        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}
        >
          <ActivityCard
            title="Project: Wireframing"
            date="Oct 20"
            status="Due Tomorrow"
            statusColor="#EF4444"
            icon={<Ionicons name="copy-outline" size={22} color="#7C3AED" />}
            onPress={() => console.log("Open")}
            onMorePress={() => console.log("More actions")}
          />
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
