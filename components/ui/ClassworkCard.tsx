import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type ClassworkType =
  | "assignment"
  | "quiz"
  | "material"
  | "announcement"
  | "discussion";

interface ClassworkCardProps {
  id: number;
  title: string;
  type: ClassworkType;
  createdAt: string;
  onPress: (id: number) => void;
}

const getIconByType = (type: ClassworkType) => {
  switch (type) {
    case "assignment":
      return "document-text-outline";
    case "quiz":
      return "help-circle-outline";
    case "material":
      return "folder-outline";
    case "announcement":
      return "megaphone-outline";
    case "discussion":
      return "chatbubble-ellipses-outline";
    default:
      return "documents-outline";
  }
};

export const ClassworkCard: React.FC<ClassworkCardProps> = ({
  id,
  title,
  type,
  createdAt,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => onPress(id)}
      activeOpacity={0.8}
    >
      <View style={styles.iconWrapper}>
        <Ionicons name={getIconByType(type)} size={22} color="#6D4EFF" />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.meta}>
          {type.toUpperCase()} • {createdAt}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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

  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 4,
  },

  meta: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
  },
});
