import { Tabs } from "expo-router";

export default function CourseTabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="overview" options={{ title: "Overview" }} />
      <Tabs.Screen name="explore" options={{ title: "Explore" }} />
      <Tabs.Screen name="grade" options={{ title: "Gradesss" }} />
    </Tabs>
  );
}
