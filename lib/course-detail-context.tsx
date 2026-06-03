import type { ReactNode } from "react";
import { createContext, useContext } from "react";

import type { User } from "@/models/auth/User.model";
import type { Course } from "@/models/course/Course.model";
import type { CourseFeedItem } from "@/models/course/CourseFeed.model";

export type CourseTabKey = "home" | "task" | "grade" | "studentlist";

type CourseDetailScreenState = {
  course: Course | null;
  feed: CourseFeedItem[];
};

export type CourseDetailContextValue = {
  courseId: string;
  error: string | null;
  isInstructor: boolean;
  loading: boolean;
  screenState: CourseDetailScreenState;
  status: "anonymous" | "authenticated" | "hydrating";
  user: User | null;
};

const CourseDetailContext = createContext<CourseDetailContextValue | null>(
  null,
);

export function CourseDetailProvider(props: {
  children: ReactNode;
  value: CourseDetailContextValue;
}) {
  return (
    <CourseDetailContext.Provider value={props.value}>
      {props.children}
    </CourseDetailContext.Provider>
  );
}

export function useCourseDetailContext() {
  const context = useContext(CourseDetailContext);

  if (!context) {
    throw new Error(
      "useCourseDetailContext must be used within CourseDetailProvider.",
    );
  }

  return context;
}
