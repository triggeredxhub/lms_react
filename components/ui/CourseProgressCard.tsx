import React from "react";
import { StyleSheet, Text, View } from "react-native";

// You can replace these with your uploaded style constants
const COLORS = {
  primary: "#4F7DF3",
  background: "#FFFFFF",
  textPrimary: "#1F2937",
  textSecondary: "#6B7280",
  progressBg: "#E5E7EB",
};

type CourseProgressCardProps = {
  title?: string;
  instructor?: string;
  progress?: number; // 0–100
  status?: string;
};

const CourseProgressCard: React.FC<CourseProgressCardProps> = ({
  title = "Introduction to UX Design",
  instructor = "Sarah Jenkins",
  progress = 75,
  status = "In Progress",
}) => {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>{status}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{instructor}</Text>

        <View style={styles.progressRow}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%` },
              ]}
            />
          </View>

          <Text style={styles.progressText}>
            {progress}% Complete
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CourseProgressCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    marginHorizontal: 8,
    marginVertical: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  header: {
    height: 96,
    backgroundColor: COLORS.primary,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 14,
  },

  headerText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  content: {
    paddingHorizontal: 20,
    paddingVertical: 18,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },

  progressRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.progressBg,
    borderRadius: 999,
    overflow: "hidden",
    marginRight: 12,
  },

  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 999,
  },

  progressText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
