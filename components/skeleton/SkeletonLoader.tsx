import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

interface SkeletonLoaderProps {
  count?: number;
  height?: number;
}

export default function SkeletonLoader({
  count = 3,
  height = 140,
}: SkeletonLoaderProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Animated.View
          key={index}
          style={[styles.skeletonCard, { height, opacity }]}
        >
          <View style={styles.skeletonTitle} />
          <View style={styles.skeletonSubtitle} />
          <View style={styles.skeletonLine} />
        </Animated.View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  skeletonCard: {
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    marginBottom: 20,
    padding: 20,
    justifyContent: "space-between",
  },
  skeletonTitle: {
    width: "60%",
    height: 20,
    backgroundColor: "#d0d0d0",
    borderRadius: 4,
    marginBottom: 12,
  },
  skeletonSubtitle: {
    width: "40%",
    height: 16,
    backgroundColor: "#d0d0d0",
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonLine: {
    width: "80%",
    height: 12,
    backgroundColor: "#d0d0d0",
    borderRadius: 4,
  },
});
