import { router } from "expo-router";
import { Button, Text, View } from "react-native";

export default function CourseList() {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Course List</Text>

      {/* Example list item */}
      <Button
        title="Go to Course Detail"
        onPress={() => router.push("./course/")}
      />
    </View>
  );
}
