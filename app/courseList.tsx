import CourseProgressCard from "@/components/ui/CourseProgressCard";
import { Course } from "@/models/course/Course.model";
import { getCourseList } from "@/services/course.service";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CourseList() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);

  const clearStorageAndRedirect = async () => {
    console.log("Clearing storage due to auth error...");
    try {
      await SecureStore.deleteItemAsync("auth_token");
      await SecureStore.deleteItemAsync("user");
    } catch {
      await AsyncStorage.removeItem("auth_token");
      await AsyncStorage.removeItem("user");
    }
    // Use replace with href to force re-check
    router.replace("/auth");
  };

  const fetchCourses = async () => {
    try {
      const response = await getCourseList();
      setCourses(response.courses);
    } catch (error: any) {
      console.error("Failed to fetch courses", error);

      // If auth is invalid, clear storage and redirect to login
      if (
        error?.message?.includes("AUTH_INVALID") ||
        error?.message?.includes("User ID is required")
      ) {
        await clearStorageAndRedirect();
      }
      // Don't redirect for other errors to avoid infinite loop
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, padding: 10 }}>
        <View style={styles.header}>
          <Text style={styles.title}>My Courses</Text>
          <Text>Welcome back! Name</Text>
        </View>

        {courses.map((course) => (
          <TouchableOpacity
            key={course.courseId}
            onPress={() =>
              router.push({
                pathname: "/course/tabs/overview",
                params: { courseId: String(course.courseId) },
              })
            }
          >
            <CourseProgressCard title={course.courseName} progress={45} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  card: {
    width: "100%",
    height: 140,
    borderRadius: 20,
    marginBottom: 20,
    position: "relative",
    overflow: "hidden",
    padding: 20,
    justifyContent: "flex-end",
  },
  cardImage: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: "60%",
    height: "100%",
    resizeMode: "contain",
  },
  cardText: {
    color: "white",
    fontSize: 22,
    fontWeight: "600",
  },
});
