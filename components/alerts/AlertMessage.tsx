import React, { useEffect } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type AlertType = "success" | "error" | "info" | "warning";

interface AlertMessageProps {
  visible: boolean;
  type?: AlertType;
  message: string;
  duration?: number; // in ms
  onHide: () => void;
}

const alertConfig = {
  success: {
    backgroundColor: "#ECFDF5",
    borderColor: "#10B981",
    iconColor: "#10B981",
    textColor: "#065F46",
    icon: "checkmark-circle" as const,
  },
  error: {
    backgroundColor: "#FEF2F2",
    borderColor: "#EF4444",
    iconColor: "#EF4444",
    textColor: "#991B1B",
    icon: "close-circle" as const,
  },
  info: {
    backgroundColor: "#EFF6FF",
    borderColor: "#3B82F6",
    iconColor: "#3B82F6",
    textColor: "#1E40AF",
    icon: "information-circle" as const,
  },
  warning: {
    backgroundColor: "#FFFBEB",
    borderColor: "#F59E0B",
    iconColor: "#F59E0B",
    textColor: "#92400E",
    icon: "warning" as const,
  },
};

export const AlertMessage: React.FC<AlertMessageProps> = ({
  visible,
  type = "info",
  message,
  duration = 3000,
  onHide,
}) => {
  const translateY = React.useRef(new Animated.Value(-100)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;
  const scale = React.useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      // Slide in with fade and scale
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          tension: 65,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          tension: 65,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-hide
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -100,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.9,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start(() => onHide());
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  const config = alertConfig[type];

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onHide());
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
          transform: [{ translateY }, { scale }],
          opacity,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name={config.icon} size={24} color={config.iconColor} />
        </View>
        <Text style={[styles.text, { color: config.textColor }]} numberOfLines={3}>
          {message}
        </Text>
        <TouchableOpacity
          onPress={handleClose}
          style={styles.closeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={20} color={config.textColor} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 16,
    right: 16,
    borderRadius: 12,
    borderWidth: 1,
    zIndex: 9999,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    paddingRight: 12,
  },
  iconContainer: {
    marginRight: 12,
  },
  text: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
  },
  closeButton: {
    marginLeft: 8,
    padding: 2,
  },
});
