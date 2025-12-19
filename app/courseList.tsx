import CourseProgressCard from "@/components/ui/CourseProgressCard";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function CourseList() {
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, padding: 10 }}>
        <View style= {styles.header}>
        <Text style={styles.title}>My Courses</Text>
        <Text>Welcome back! Name</Text>
        </View>

        <TouchableOpacity onPress={() => router.push("/course")}>
          <CourseProgressCard progress={45} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/course")}>
          <CourseProgressCard progress={45} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/course")}>
          <CourseProgressCard progress={45} />
        </TouchableOpacity>
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
