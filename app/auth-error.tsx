import colors from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthError() {
  const router = useRouter();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.3));

  useEffect(() => {
    // Fade in and scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Redirect to login after 2.5 seconds
    const timer = setTimeout(() => {
      // Fade out before redirect
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        router.replace("/auth");
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="alert-circle" size={80} color={colors.error} />
        </View>

        <Text style={styles.title}>Session Expired</Text>
        <Text style={styles.message}>
          Your session has expired or is invalid.
        </Text>
        <Text style={styles.subMessage}>Redirecting to login page...</Text>

        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.loader}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 8,
  },
  subMessage: {
    fontSize: 14,
    color: colors.textTertiary,
    textAlign: "center",
    marginBottom: 32,
  },
  loader: {
    marginTop: 16,
  },
});
