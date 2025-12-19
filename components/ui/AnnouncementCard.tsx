import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface AnnouncementCardProps {
  title: string;
  subtitle: string;
  time: string;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  title,
  subtitle,
  time,
}) => {
  return (
    <View style={styles.announcementContainer}>
      <Text style={styles.announcementTitle}>{title}</Text>
      <Text style={styles.announcementSubtitle}>{subtitle}</Text>
      <Text style={styles.announcementTime}>{time}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  announcementContainer: {
    backgroundColor: "#F3F7FF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#DCE6FF",
  },

  announcementTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2A3DB8",
    marginBottom: 8,
  },

  announcementSubtitle: {
    fontSize: 14,
    color: "#3B5BFF",
    marginBottom: 12,
  },

  announcementTime: {
    fontSize: 14,
    color: "#7A9BFF",
  },
});
