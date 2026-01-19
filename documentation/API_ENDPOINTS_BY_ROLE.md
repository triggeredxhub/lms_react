# API Endpoints Documentation by Role

## Table of Contents
1. [EMS User Endpoints (Student Role)](#ems-user-endpoints-student-role)
2. [HRIS User Endpoints (Instructor Role)](#hris-user-endpoints-instructor-role)
3. [Admin Endpoints](#admin-endpoints)
4. [Shared/Common Endpoints](#sharedcommon-endpoints)

---

## EMS User Endpoints (Student Role)

### Authentication
- **POST** `/api/user/login` - EMS user login
- **POST** `/api/user/register_ems` - Register new EMS user
- **GET** `/api/user/me` - Get current EMS user profile (requires auth, student only)
- **POST** `/api/user/forgot-password` - Request password reset
- **PUT** `/api/user/reset-password` - Reset password with token

### Courses
- **GET** `/course/student-courses` - Get all courses for student (requires auth, student only)
- **GET** `/course/:courseId/student_classwork` - Get classwork for a specific course (requires auth, student only)
- **GET** `/course/:courseId` - Get course details by ID (requires auth)
- **GET** `/course/student/:courseId/list` - Get student list for a course (requires auth)
- **GET** `/course/:courseId/student_QuizAndAssignment` - Get quizzes and assignments for a course (requires auth, student only)
- **GET** `/course/student_QuizAndAssignment/test` - Get all enrolled courses with classwork (requires auth, student only)
- **GET** `/course/student_announcement/test` - Get all announcements for student (requires auth, student only)

### Enrollment
- **POST** `/enrollment/create_enrollment` - Enroll in a course (requires auth, student only)
- **PUT** `/enrollment/update_enrollment` - Update enrollment (requires auth)
- **DELETE** `/enrollment/delete_enrollment` - Delete enrollment (requires auth)
- **GET** `/enrollment/get_enrollment_list` - Get enrollment list (requires auth)

### Submissions
- **POST** `/submission/create_submission` - Submit assignment (requires auth, student only, with file upload)
- **PUT** `/submission/update_submission` - Update submission (requires auth)
- **DELETE** `/submission/delete_submission` - Delete submission (requires auth)
- **GET** `/submission/:assignmentId/submission_list` - Get submissions for an assignment (requires auth)

### Quizzes
- **GET** `/quiz/get_student_quizzes` - Get all quizzes for student (requires auth, student only)
- **GET** `/quiz/get_quizzes_by_course_id/:courseId/list` - Get quizzes by course ID (requires auth)
- **GET** `/quiz/get_quiz_by_id/:quizId` - Get quiz by ID (requires auth)
- **GET** `/quiz/quiz_by_id/:quizId/details` - Get quiz details (requires auth)

### Responses (Quiz Responses)
- **POST** `/response/create_response` - Submit quiz response (requires auth, student only)
- **POST** `/response/create_responseDetail` - Add response details (requires auth)

### Grades
- **GET** `/grade/course/:courseId/user/list` - Get grades for student in a course (requires auth, student only)
- **GET** `/grade/get_grades` - Get grade list (requires auth)

### Comments
- **POST** `/comment/create_comment/discussion` - Create comment on discussion (requires auth)
- **POST** `/comment/create_comment/material` - Create comment on material (requires auth)
- **POST** `/comment/create_comment/assignment` - Create comment on assignment (requires auth)
- **POST** `/comment/create_comment/quiz` - Create comment on quiz (requires auth)
- **POST** `/comment/create_comment/announcement` - Create comment on announcement (requires auth)
- **PUT** `/comment/update_comment` - Update comment (requires auth)
- **DELETE** `/comment/delete_comment` - Delete comment (requires auth)
- **GET** `/comment/get/:discussionId/list` - Get comments for discussion (requires auth)
- **GET** `/comment/get/materialId/:materialId/list` - Get comments for material (requires auth)
- **GET** `/comment/get/announcementId/:announcementId/list` - Get comments for announcement (requires auth)
- **GET** `/comment/get/quizId/:quizId/list` - Get comments for quiz (requires auth)
- **GET** `/comment/get/assignmentId/:assignmentId/list` - Get comments for assignment (requires auth)

### Device/Notifications
- **POST** `/api/device/save_device_token` - Save device token for push notifications (requires auth)
- **GET** `/api/device/:courseId/token` - Get device tokens for a course (requires auth)
- **POST** `/api/device/notify` - Send notification (requires auth)

---

## HRIS User Endpoints (Instructor Role)

### Authentication
- **POST** `/api/hris_user/login_hris` - HRIS user login
- **POST** `/api/hris_user/register_hris` - Register new HRIS user
- **GET** `/api/hris_user/me` - Get current HRIS user profile (requires auth, instructor/admin only)

### Courses
- **POST** `/course/create_course` - Create new course (requires auth, instructor only)
- **PUT** `/course/update_course` - Update course (requires auth)
- **DELETE** `/course/delete_course` - Delete course (requires auth)
- **GET** `/course/my-courses` - Get instructor's courses (requires auth, instructor only)
- **GET** `/course/:courseId/get_classwork` - Get classwork for a course (requires auth, instructor only)
- **GET** `/course/:courseId` - Get course details by ID (requires auth)
- **GET** `/course/enrollments/:courseId` - Get enrollments for a course (requires auth)
- **GET** `/course/student/:courseId/list` - Get student list for a course (requires auth)

### Assignments
- **POST** `/assignment/create_assignment` - Create assignment (requires auth, instructor)
- **PUT** `/assignment/update_assignment` - Update assignment (requires auth)
- **DELETE** `/assignment/delete_assignment` - Delete assignment (requires auth)
- **GET** `/assignment/get_assignment_list` - Get assignment list (requires auth)
- **GET** `/assignment/get_assignment_by_id/:assignmentId` - Get assignment by ID (requires auth)
- **GET** `/assignment/:courseId/studentList` - Get students by course (requires auth, instructor only)
- **GET** `/assignment/get_assignment_by_id/:assignmentId/list` - Get assignment details with submissions (requires auth, instructor only)

### Materials
- **POST** `/material/create_material` - Create material (requires auth, instructor only, with file upload)
- **PUT** `/material/update_material` - Update material (requires auth)
- **DELETE** `/material/delete_material` - Delete material (requires auth)
- **GET** `/material/get_material_list` - Get material list (requires auth)
- **GET** `/material/get_material_by_id/:materialId` - Get material by ID (requires auth)
- **GET** `/material/file/:materialId/preview` - Preview material file (requires auth)
- **GET** `/material/file/:materialId/download` - Download material file (requires auth)

### Quizzes
- **POST** `/quiz/create_quiz` - Create quiz (requires auth, instructor only)
- **POST** `/quiz/create_test_quiz` - Create test quiz (requires auth, instructor only)
- **GET** `/quiz/get_my-quizzes` - Get instructor's quizzes (requires auth, instructor only)
- **GET** `/quiz/get_quizzes_by_course_id/:courseId/list` - Get quizzes by course ID (requires auth)
- **GET** `/quiz/get_quiz_by_id/:quizId` - Get quiz by ID (requires auth)
- **GET** `/quiz/quiz_by_id/:quizId/details` - Get quiz details (requires auth)

### Announcements
- **POST** `/announcement/create_announcement` - Create announcement (requires auth, instructor)
- **PUT** `/announcement/update_announcement` - Update announcement (requires auth)
- **DELETE** `/announcement/delete_announcement` - Delete announcement (requires auth)
- **GET** `/announcement/get_announcement` - Get announcements by course (requires auth)
- **GET** `/announcement/get_announcement_by_id/:announcementId` - Get announcement by ID (requires auth)
- **GET** `/announcement/get_all` - Get all announcements for instructor (requires auth)

### Discussions
- **POST** `/discussion/create_discussion` - Create discussion (requires auth, instructor only)
- **PUT** `/discussion/update_discussion` - Update discussion (requires auth)
- **DELETE** `/discussion/delete_discussion` - Delete discussion (requires auth)
- **GET** `/discussion/get_discussion_list` - Get discussion list (requires auth)
- **GET** `/discussion/get_discussion_by_id/:discussionId` - Get discussion by ID (requires auth)

### Grades
- **POST** `/grade/create_grade` - Create grade (requires auth, instructor only)
- **PUT** `/grade/update_grade` - Update grade (requires auth)
- **GET** `/grade/get_grades` - Get grade list (requires auth)
- **GET** `/grade/:courseId/get_grade_list` - Get grades for a course (requires auth)
- **GET** `/grade/file/:courseId/download` - Download grades in Excel format

### Submissions (Instructor View)
- **GET** `/submission/:assignmentId/submission_list` - Get submissions for an assignment (requires auth)
- **GET** `/submission/get_submission_by_id/:submissionId/test` - Get submission by ID (requires auth, instructor only)
- **GET** `/submission/get_submission_by_id/:submissionId/details` - Get submission details (requires auth, instructor only)

### Questions & Answers
- **POST** `/question_answer/create_question` - Create question (requires auth)
- **POST** `/question_answer/add_answer` - Add answer to question (requires auth)

### Comments
- **POST** `/comment/create_comment/discussion` - Create comment on discussion (requires auth)
- **POST** `/comment/create_comment/material` - Create comment on material (requires auth)
- **POST** `/comment/create_comment/assignment` - Create comment on assignment (requires auth)
- **POST** `/comment/create_comment/quiz` - Create comment on quiz (requires auth)
- **POST** `/comment/create_comment/announcement` - Create comment on announcement (requires auth)
- **PUT** `/comment/update_comment` - Update comment (requires auth)
- **DELETE** `/comment/delete_comment` - Delete comment (requires auth)
- **GET** `/comment/get/:discussionId/list` - Get comments for discussion (requires auth)
- **GET** `/comment/get/materialId/:materialId/list` - Get comments for material (requires auth)
- **GET** `/comment/get/announcementId/:announcementId/list` - Get comments for announcement (requires auth)
- **GET** `/comment/get/quizId/:quizId/list` - Get comments for quiz (requires auth)
- **GET** `/comment/get/assignmentId/:assignmentId/list` - Get comments for assignment (requires auth)

### Device/Notifications
- **POST** `/api/device/save_device_token` - Save device token for push notifications (requires auth)
- **GET** `/api/device/:courseId/token` - Get device tokens for a course (requires auth)
- **POST** `/api/device/notify` - Send notification (requires auth)

---

## Admin Endpoints

### Authentication
- **GET** `/api/hris_user/me` - Get current admin profile (requires auth, admin only)

### Dashboard & Statistics
- **GET** `/admin/get_stats` - Get dashboard statistics (requires auth, admin only)
- **GET** `/admin/courses` - Get all courses (requires auth, admin only)
- **GET** `/admin/students` - Get all students (requires auth, admin only)

### Courses
- **POST** `/course/admin_create_course` - Admin create course (requires auth, admin only)
- **GET** `/course/get_by_admin` - Get courses by admin (requires auth, admin only)
- **GET** `/course/:courseId` - Get course details by ID (requires auth)
- **GET** `/course/enrollments/:courseId` - Get enrollments for a course (requires auth)
- **GET** `/course/student/:courseId/list` - Get student list for a course (requires auth)

---

## Shared/Common Endpoints

### Static File Access
- **GET** `/downloads/*` - Download files (force download)
- **GET** `/grade_uploads/*` - Access grade upload files
- **GET** `/submission_uploads/*` - Access submission upload files
- **GET** `/material_uploads/*` - Access material upload files

### General
- **GET** `/api/hello` - Test endpoint

---

## Notes

### Authentication
- Most endpoints require authentication via `authMiddleware`
- Use Bearer token in Authorization header: `Authorization: Bearer <token>`

### Role-Based Access Control
- **Student (EMS User)**: Can enroll in courses, submit assignments, take quizzes, view grades
- **Instructor (HRIS User)**: Can create courses, assignments, materials, quizzes, grade submissions
- **Admin**: Can view statistics, manage all courses and students, create courses

### File Uploads
- Material creation: `/material/create_material` (supports multiple files)
- Submission creation: `/submission/create_submission` (supports multiple files)
- Files are stored in respective upload directories

### Push Notifications
- Instructors can send push notifications when creating:
  - Assignments
  - Materials
  - Announcements
- Students receive notifications via Firebase Cloud Messaging (FCM)
