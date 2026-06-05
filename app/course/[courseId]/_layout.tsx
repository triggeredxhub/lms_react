import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { Tabs, router, useLocalSearchParams } from "expo-router";

import { CourseDetailProvider } from "@/lib/course-detail-context";
import type { Course } from "@/models/course/Course.model";
import type { CourseFeedItem } from "@/models/course/CourseFeed.model";
import {
  getCourse,
  getCourseClassworkForRole,
} from "@/services/course.service";
import { useAuthStore } from "@/stores/auth.store";

type ScreenState = {
  course: Course | null;
  feed: CourseFeedItem[];
};

const initialState: ScreenState = {
  course: null,
  feed: [],
};

export default function CourseTabsLayout() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);

  const [screenState, setScreenState] = useState(initialState);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isInstructor = user?.role === "instructor" || user?.role === "admin";

  useEffect(() => {
    const currentUser = user;

    if (!courseId || !currentUser || status !== "authenticated") {
      setLoading(false);
      return;
    }
    const role = currentUser.role;
    let isActive = true;

    async function loadCourse() {
      setLoading(true);
      setError(null);

      try {
        const [course, feed] = await Promise.all([
          getCourse(courseId),
          getCourseClassworkForRole(courseId, role),
        ]);

        if (!isActive) {
          return;
        }

        setScreenState({ course, feed });
      } catch (loadError) {
        if (!isActive) {
          return;
        }

        setScreenState(initialState);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load course details.",
        );
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    void loadCourse();

    return () => {
      isActive = false;
    };
  }, [courseId, status, user]);

  if (status !== "authenticated" || !user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredCard}>
          <Text style={styles.errorText}>Sign in to view course details.</Text>
          <Pressable onPress={() => router.replace("/")} style={styles.button}>
            <Text style={styles.buttonText}>Back to sign in</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <CourseDetailProvider
      value={{
        courseId: courseId ?? "",
        error,
        isInstructor,
        loading,
        screenState,
        status,
        user,
      }}
    >
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#1849d6",
          tabBarInactiveTintColor: "#5f6879",
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "700",
          },
          tabBarStyle: {
            backgroundColor: "#ffffff",
            borderTopColor: "#d8deea",
            borderTopWidth: 1,
            height: 70,
            paddingBottom: 10,
            paddingTop: 8,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons color={color} name="home-outline" size={size} />
            ),
            title: "Home",
          }}
        />
        <Tabs.Screen
          name="task"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons color={color} name="clipboard-outline" size={size} />
            ),
            title: "Task",
          }}
        />
        <Tabs.Screen
          name="studentlist"
          options={{
            href: isInstructor ? undefined : null,
            tabBarIcon: ({ color, size }) => (
              <Ionicons color={color} name="people-outline" size={size} />
            ),
            title: "Student list",
          }}
        />
        <Tabs.Screen
          name="grade"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons color={color} name="stats-chart-outline" size={size} />
            ),
            title: "Grade",
          }}
        />
      </Tabs>
    </CourseDetailProvider>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#1849d6",
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  centeredCard: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    gap: 16,
    margin: 20,
    padding: 24,
  },
  errorText: {
    color: "#b33a2d",
    fontSize: 14,
    lineHeight: 20,
  },
  safeArea: {
    backgroundColor: "#edf2f8",
    flex: 1,
  },
});
