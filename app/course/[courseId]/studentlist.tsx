import { router } from "expo-router";
import { useEffect } from "react";

import { CourseTabContent } from "@/components/course/CourseTabContent";
import { useCourseDetailContext } from "@/lib/course-detail-context";

export default function CourseStudentListTab() {
  const { courseId, isInstructor } = useCourseDetailContext();

  useEffect(() => {
    if (!isInstructor) {
      router.replace(`/course/${courseId}` as never);
    }
  }, [courseId, isInstructor]);

  if (!isInstructor) {
    return null;
  }

  return <CourseTabContent tab="studentlist" />;
}
