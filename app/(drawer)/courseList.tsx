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

export default function CourseList() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [hasError, setHasError] = useState(false);

  const clearStorageAndRedirect = async () => {
    console.log("Clearing storage due to auth error...");
    try {
      await SecureStore.deleteItemAsync("auth_token");
      await SecureStore.deleteItemAsync("user");
    } catch {
      await AsyncStorage.removeItem("auth_token");
      await AsyncStorage.removeItem("user");
    }
    // Navigate to error page with smooth transition
    router.replace("/auth-error");
  };

  const fetchCourses = async () => {
    try {
      const response = await getCourseList();
      setCourses(response.courses);
      setHasError(false);
    } catch (error: any) {
      console.error("Failed to fetch courses", error);

      // If auth is invalid, clear storage and show error page
      if (
        error?.message?.includes("AUTH_INVALID") ||
        error?.message?.includes("User ID is required")
      ) {
        setHasError(true);
        await clearStorageAndRedirect();
      }
      // Don't redirect for other errors to avoid infinite loop
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Don't render anything if there's an auth error (transitioning to error page)
  if (hasError) {
    return null;
  }

  return (
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
              pathname: "/(drawer)/course/tabs/overview",
              params: { courseId: String(course.courseId) },
            })
          }
        >
          <CourseProgressCard title={course.courseName} progress={45} />
        </TouchableOpacity>
      ))}
    </ScrollView>
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
