import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ProjectNotificationCardProps {
  title: string;
  dueText: string;
}

export const ProjectNotificationCard: React.FC<ProjectNotificationCardProps> = ({
  title,
  dueText,
}) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.iconWrapper}>
        <Ionicons
          name="notifications-outline"
          size={22}
          color="#6D4EFF"
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.projectTitle}>{title}</Text>
        <Text style={styles.projectDue}>{dueText}</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EEE9FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  content: {
    flex: 1,
  },

  projectTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 4,
  },

  projectDue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#EF4444",
  },
});
