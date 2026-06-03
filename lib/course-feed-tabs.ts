import type { CourseFeedItem } from "@/models/course/CourseFeed.model";

import type { CourseTabKey } from "@/lib/course-detail-context";

export function getItemsForTab(tab: CourseTabKey, feed: CourseFeedItem[]) {
  switch (tab) {
    case "home":
      return feed.filter(
        (item) => item.type === "assignment" || item.type === "material",
      );
    case "task":
      return feed.filter(
        (item) =>
          item.type === "quiz" ||
          item.type === "discussion" ||
          item.type === "announcement",
      );
    case "grade":
      return feed.filter(
        (item) => item.type === "assignment" || item.type === "quiz",
      );
    case "studentlist":
      return [];
  }
}

export function getSectionTitle(tab: CourseTabKey) {
  switch (tab) {
    case "home":
      return "Home";
    case "task":
      return "Tasks";
    case "grade":
      return "Grades";
    case "studentlist":
      return "Student list";
  }
}

export function getEmptyState(tab: CourseTabKey) {
  switch (tab) {
    case "home":
      return "No assignments or materials available yet.";
    case "task":
      return "No quizzes or activities available yet.";
    case "grade":
      return "No gradable items available yet.";
    case "studentlist":
      return "No students available yet.";
  }
}

export function getItemId(item: CourseFeedItem) {
  switch (item.type) {
    case "announcement":
      return item.announcementId;
    case "assignment":
      return item.assignmentId;
    case "discussion":
      return item.discussionId;
    case "material":
      return item.materialId;
    case "quiz":
      return item.quizId;
  }
}

export function getItemTitle(item: CourseFeedItem) {
  switch (item.type) {
    case "announcement":
      return item.title;
    case "assignment":
      return item.title;
    case "discussion":
      return item.title;
    case "material":
      return item.title;
    case "quiz":
      return item.quizTitle;
  }
}

export function getItemDescription(item: CourseFeedItem) {
  switch (item.type) {
    case "announcement":
      return item.content || "No content provided.";
    case "assignment":
      return item.description || "No assignment description provided.";
    case "discussion":
      return item.content || "No discussion content provided.";
    case "material":
      return item.description || "No material description provided.";
    case "quiz":
      return item.description || "No quiz description provided.";
  }
}

export function formatFeedType(type: CourseFeedItem["type"]) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function getFeedLinkLabel(item: CourseFeedItem) {
  switch (item.type) {
    case "assignment":
      return "Open assignment";
    case "material":
      return "Open material";
    case "quiz":
      return "Open quiz";
    default:
      return "Detail screen coming next";
  }
}

export function getFeedLinkLabelForTab(
  tab: CourseTabKey,
  item: CourseFeedItem,
) {
  if (tab === "grade") {
    switch (item.type) {
      case "assignment":
        return "Open assignment grading";
      case "quiz":
        return "Open quiz grading";
      default:
        return getFeedLinkLabel(item);
    }
  }

  return getFeedLinkLabel(item);
}
