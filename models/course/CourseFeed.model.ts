// Shared base
export interface BaseCourseFeedItem {
  courseId: number;
  createdAt: string;
}

// Announcement
export interface AnnouncementFeedItem extends BaseCourseFeedItem {
  type: "announcement";
  announcementId: number;
  title: string;
  content: string | null;
}

// Material
export interface MaterialFeedItem extends BaseCourseFeedItem {
  type: "material";
  materialId: number;
  title: string;
  description: string | null;
  filePath: string;
}

// Quiz
export interface QuizFeedItem extends BaseCourseFeedItem {
  type: "quiz";
  quizId: number;
  quizTitle: string;
  description: string | null;
  due_date: string;
  timeLimit: number;
  updatedAt: string;
}

// Discussion
export interface DiscussionFeedItem extends BaseCourseFeedItem {
  type: "discussion";
  discussionId: number;
  title: string;
  content: string;
}

export interface AssignmentFeedItem extends BaseCourseFeedItem {
  type: "assignment";
  assignmentId: number;
  courseId: number;
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
  | DiscussionFeedItem;
