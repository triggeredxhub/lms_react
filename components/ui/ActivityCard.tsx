import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    GestureResponderEvent,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

export type ActivityCardProps = {
  title: string;
  date: string;
  icon?: React.ReactNode;
  status?: string;
  statusColor?: string;
  onPress?: (event: GestureResponderEvent) => void;
  onMorePress?: () => void;
};

export function ActivityCard({
  title,
  date,
  icon,
  status,
  statusColor = "#EF4444", // default red (due soon)
  onPress,
  onMorePress,
}: ActivityCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      {/* Icon */}
      <View style={styles.iconContainer}>
        {icon ?? (
          <Ionicons name="square-outline" size={22} color="#7C3AED" />
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.date}>{date}</Text>
      </View>

      {/* Status + More */}
      <View style={styles.right}>
        {status && (
          <Text style={[styles.status, { color: statusColor }]}>
            {status}
          </Text>
        )}

        <Pressable
          onPress={onMorePress}
          hitSlop={10}
          style={styles.moreButton}
        >
          <Ionicons
            name="ellipsis-vertical"
            size={18}
            color="#9CA3AF"
          />
        </Pressable>
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,

    // iOS shadow
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },

    // Android shadow
    elevation: 2,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  date: {
    marginTop: 4,
    fontSize: 13,
    color: "#9CA3AF",
  },

  right: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },

  status: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
  },

  moreButton: {
    padding: 4,
  },
});
