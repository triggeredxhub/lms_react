// Shared base
export interface BaseCourseFeedItem {
  courseId: string | number;
  createdAt: string;
  updatedAt?: string | null;
}

// Announcement
export interface AnnouncementFeedItem extends BaseCourseFeedItem {
  type: "announcement";
  announcementId: string | number;
  title: string;
  content: string | null;
}

// Material
export interface MaterialFeedItem extends BaseCourseFeedItem {
  type: "material";
  materialId: string | number;
  title: string;
  description: string | null;
  filePath: string;
}

// Quiz
export interface QuizFeedItem extends BaseCourseFeedItem {
  type: "quiz";
  quizId: string | number;
  quizTitle: string;
  description: string | null;
  due_date: string;
  timeLimit: number;
}

// Discussion
export interface DiscussionFeedItem extends BaseCourseFeedItem {
  type: "discussion";
  discussionId: string | number;
  title: string;
  content: string;
}

export interface AssignmentFeedItem extends BaseCourseFeedItem {
  type: "assignment";
  assignmentId: string | number;
  courseId: string | number;
  title: string;
  description: string | null;
  dueDate: string;
  max_score: number;
}

// UNION (this is what you use in screens)
export type CourseFeedItem =
  | AnnouncementFeedItem
  | MaterialFeedItem
  | QuizFeedItem
  | DiscussionFeedItem
  | AssignmentFeedItem;
