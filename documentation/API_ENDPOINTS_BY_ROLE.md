# LMS Backend API Documentation

## Overview

- Base path: /
- Content-Type: application/json
- Authentication for protected routes: `Authorization: Bearer <access_token>`
- UUID fields must be valid UUID strings.
- Pagination query defaults used across list endpoints:
  - `page`: integer, positive, default `1`
  - `limit`: integer, `1-100`, default `20`

## Enums

- `UserRole`: `admin`, `instructor`, `student`
- `StudentStatus`: `regular`, `irregular`
- `MaterialType`: `pdf`, `doc`, `xlsx`, `ppt`
- `SubmissionStatus`: `submitted`, `late`, `graded`, `returned`
- `TargetType`: `assignment`, `quiz`, `material`, `announcement`
- `ReactionType`: `like`, `love`, `haha`, `wow`, `sad`, `angry`

---

## Health

### GET /health

- Auth: Public
- Input:
  - Body: none
  - Params: none
  - Query: none

---

## Auth

### POST /auth/register

- Auth: Public
- Body:
  - `email` (required): valid email, max 255
  - `password` (required): string, length `8-72`, must include uppercase, lowercase, number, and symbol
  - `firstName` (required): string, trimmed, min 1, max 100
  - `lastName` (required): string, trimmed, min 1, max 100
  - `role` (required): `student | instructor`
  - `studentStatus` (optional, nullable): `regular | irregular`
- Rule:
  - `studentStatus` is required when `role = student`

### POST

- Auth: Public
- Body:
  - `email` (required): valid email, max 255
  - `password` (required): string, min 1

### POST /auth/refresh

- Auth: Public
- Body:
  - `refreshToken` (required): string, min 1

### POST /auth/logout

- Auth: Public
- Body:
  - `refreshToken` (required): string, min 1

### POST /auth/logout/all

- Auth: Protected (any authenticated user)
- Input:
  - Body: none
  - Params: none
  - Query: none

---

## Users

All `/users` endpoints require authentication.

### GET /users/me

- Auth: Protected (any authenticated user)
- Input:
  - Body: none
  - Params: none
  - Query: none

### PUT /users/me

- Auth: Protected (any authenticated user)
- Body (at least one required):
  - `firstName` (optional): string, trimmed, min 1, max 100
  - `lastName` (optional): string, trimmed, min 1, max 100

### PUT /users/me/password

- Auth: Protected (any authenticated user)
- Body:
  - `currentPassword` (required): string, min 1
  - `newPassword` (required): string, length `8-72`, must include uppercase, lowercase, number, and symbol
- Rule:
  - `newPassword` must be different from `currentPassword`

### POST /users

- Auth: Protected (`admin`)
- Body:
  - `email` (required): valid email, max 255
  - `password` (required): string, length `8-72`, must include uppercase, lowercase, number, and symbol
  - `firstName` (required): string, trimmed, min 1, max 100
  - `lastName` (required): string, trimmed, min 1, max 100
  - `role` (required): `admin | instructor | student`
  - `studentStatus` (optional, nullable): `regular | irregular`
- Rule:
  - `studentStatus` is required when `role = student`

### GET /users

- Auth: Protected (`admin`)
- Query:
  - `page` (optional): int > 0, default 1
  - `limit` (optional): int 1-100, default 20
  - `role` (optional): `admin | instructor | student`
  - `studentStatus` (optional): `regular | irregular`
  - `search` (optional): string, trimmed, max 255

### PUT /users/:id/role

- Auth: Protected (`admin`)
- Params:
  - `id` (required): uuid
- Body:
  - `role` (required): `admin | instructor | student`
  - `studentStatus` (optional, nullable): `regular | irregular`

### GET /users/:id

- Auth: Protected (`admin`)
- Params:
  - `id` (required): uuid

### PUT /users/:id

- Auth: Protected (`admin`)
- Params:
  - `id` (required): uuid
- Body (at least one required):
  - `email` (optional): valid email, max 255
  - `firstName` (optional): string, trimmed, min 1, max 100
  - `lastName` (optional): string, trimmed, min 1, max 100
  - `studentStatus` (optional, nullable): `regular | irregular`

### DELETE /users/:id

- Auth: Protected (`admin`)
- Params:
  - `id` (required): uuid

---

## Courses

All `/courses` endpoints require authentication.

### POST /courses

- Auth: Protected (`admin | instructor`)
- Body:
  - `code` (required): string, trimmed, min 1, max 50
  - `title` (required): string, trimmed, min 1, max 255
  - `description` (optional, nullable): string, trimmed, max 2000
  - `instructorId` (optional): uuid

### GET /courses

- Auth: Protected (any authenticated user)
- Query:
  - `page` (optional): int > 0, default 1
  - `limit` (optional): int 1-100, default 20
  - `search` (optional): string, trimmed, max 255
  - `instructorId` (optional): uuid

### GET /courses/:id

- Auth: Protected (any authenticated user)
- Params:
  - `id` (required): uuid

### PUT /courses/:id

- Auth: Protected (`admin | instructor`)
- Params:
  - `id` (required): uuid
- Body (at least one required):
  - `code` (optional): string, trimmed, min 1, max 50
  - `title` (optional): string, trimmed, min 1, max 255
  - `description` (optional, nullable): string, trimmed, max 2000

### DELETE /courses/:id

- Auth: Protected (`admin | instructor`)
- Params:
  - `id` (required): uuid

---

## Enrollments

All `/enrollments` endpoints require authentication.

### POST /enrollments

- Auth: Protected (any authenticated user)
- Body:
  - `courseId` (required): uuid
  - `studentId` (optional): uuid

### GET /enrollments

- Auth: Protected (any authenticated user)
- Query:
  - `page` (optional): int > 0, default 1
  - `limit` (optional): int 1-100, default 20
  - `courseId` (optional): uuid
  - `studentId` (optional): uuid

### GET /enrollments/:id

- Auth: Protected (any authenticated user)
- Params:
  - `id` (required): uuid

### DELETE /enrollments/:id

- Auth: Protected (any authenticated user)
- Params:
  - `id` (required): uuid

---

## Assignments

All `/assignments` endpoints require authentication.

### POST /assignments

- Auth: Protected (`admin | instructor`)
- Body:
  - `courseId` (required): uuid
  - `title` (required): string, trimmed, min 1, max 255
  - `description` (optional, nullable): string, trimmed, max 2000
  - `maxScore` (optional): number, `> 0`, max 9999.99
  - `dueAt` (optional, nullable): date/datetime string

### GET /assignments

- Auth: Protected (any authenticated user)
- Query:
  - `page` (optional): int > 0, default 1
  - `limit` (optional): int 1-100, default 20
  - `courseId` (optional): uuid
  - `createdBy` (optional): uuid
  - `search` (optional): string, trimmed, max 255
  - `dueAfter` (optional): date/datetime string
  - `dueBefore` (optional): date/datetime string

### GET /assignments/:id

- Auth: Protected (any authenticated user)
- Params:
  - `id` (required): uuid

### PUT /assignments/:id

- Auth: Protected (`admin | instructor`)
- Params:
  - `id` (required): uuid
- Body (at least one required):
  - `courseId` (optional): uuid
  - `title` (optional): string, trimmed, min 1, max 255
  - `description` (optional, nullable): string, trimmed, max 2000
  - `maxScore` (optional): number, `> 0`, max 9999.99
  - `dueAt` (optional, nullable): date/datetime string

### DELETE /assignments/:id

- Auth: Protected (`admin | instructor`)
- Params:
  - `id` (required): uuid

---

## Submissions

All `/submissions` endpoints require authentication.

### POST /submissions

- Auth: Protected (any authenticated user)
- Body:
  - `assignmentId` (required): uuid
  - `studentId` (optional): uuid
  - `fileUrl` (optional, nullable): valid URL, max 500
  - `fileType` (optional, nullable): `pdf | doc | xlsx | ppt`
  - `note` (optional, nullable): string, trimmed, max 5000

### GET /submissions

- Auth: Protected (any authenticated user)
- Query:
  - `page` (optional): int > 0, default 1
  - `limit` (optional): int 1-100, default 20
  - `assignmentId` (optional): uuid
  - `studentId` (optional): uuid
  - `status` (optional): `submitted | late | graded | returned`

### GET /submissions/:id

- Auth: Protected (any authenticated user)
- Params:
  - `id` (required): uuid

### PUT /submissions/:id

- Auth: Protected (any authenticated user)
- Params:
  - `id` (required): uuid
- Body (at least one required):
  - `fileUrl` (optional, nullable): valid URL, max 500
  - `fileType` (optional, nullable): `pdf | doc | xlsx | ppt`
  - `note` (optional, nullable): string, trimmed, max 5000
  - `status` (optional): `submitted | late | graded | returned`
  - `score` (optional, nullable): number, min 0, max 9999.99
  - `feedback` (optional, nullable): string, trimmed, max 5000

### DELETE /submissions/:id

- Auth: Protected (any authenticated user)
- Params:
  - `id` (required): uuid

---

## Quizzes

All `/quizzes` endpoints require authentication.

### POST /quizzes

- Auth: Protected (`admin | instructor`)
- Body:
  - `courseId` (required): uuid
  - `title` (required): string, trimmed, min 1, max 255
  - `description` (optional, nullable): string, trimmed, max 2000
  - `googleFormUrl` (optional, nullable): valid URL, max 500
  - `googleFormId` (optional, nullable): string, trimmed, max 255
  - `maxScore` (optional): number, `> 0`, max 9999.99
  - `opensAt` (optional, nullable): date/datetime string
  - `closesAt` (optional, nullable): date/datetime string

### GET /quizzes

- Auth: Protected (any authenticated user)
- Query:
  - `page` (optional): int > 0, default 1
  - `limit` (optional): int 1-100, default 20
  - `courseId` (optional): uuid
  - `createdBy` (optional): uuid
  - `search` (optional): string, trimmed, max 255

### GET /quizzes/:id

- Auth: Protected (any authenticated user)
- Params:
  - `id` (required): uuid

### PUT /quizzes/:id

- Auth: Protected (`admin | instructor`)
- Params:
  - `id` (required): uuid
- Body (at least one required):
  - `courseId` (optional): uuid
  - `title` (optional): string, trimmed, min 1, max 255
  - `description` (optional, nullable): string, trimmed, max 2000
  - `googleFormUrl` (optional, nullable): valid URL, max 500
  - `googleFormId` (optional, nullable): string, trimmed, max 255
  - `maxScore` (optional): number, `> 0`, max 9999.99
  - `opensAt` (optional, nullable): date/datetime string
  - `closesAt` (optional, nullable): date/datetime string

### DELETE /quizzes/:id

- Auth: Protected (`admin | instructor`)
- Params:
  - `id` (required): uuid

---

## Materials

All `/materials` endpoints require authentication.

### POST /materials

- Auth: Protected (`admin | instructor`)
- Body:
  - `courseId` (required): uuid
  - `title` (required): string, trimmed, min 1, max 255
  - `description` (optional, nullable): string, trimmed, max 2000
  - `fileUrl` (required): valid URL, max 500
  - `fileType` (required): `pdf | doc | xlsx | ppt`

### GET /materials

- Auth: Protected (any authenticated user)
- Query:
  - `page` (optional): int > 0, default 1
  - `limit` (optional): int 1-100, default 20
  - `courseId` (optional): uuid
  - `uploadedBy` (optional): uuid
  - `fileType` (optional): `pdf | doc | xlsx | ppt`
  - `search` (optional): string, trimmed, max 255

### GET /materials/:id

- Auth: Protected (any authenticated user)
- Params:
  - `id` (required): uuid

### PUT /materials/:id

- Auth: Protected (`admin | instructor`)
- Params:
  - `id` (required): uuid
- Body (at least one required):
  - `courseId` (optional): uuid
  - `title` (optional): string, trimmed, min 1, max 255
  - `description` (optional, nullable): string, trimmed, max 2000
  - `fileUrl` (optional): valid URL, max 500
  - `fileType` (optional): `pdf | doc | xlsx | ppt`

### DELETE /materials/:id

- Auth: Protected (`admin | instructor`)
- Params:
  - `id` (required): uuid

---

## Announcements

All `/announcements` endpoints require authentication.

### POST /announcements

- Auth: Protected (`admin | instructor`)
- Body:
  - `courseId` (required): uuid
  - `title` (required): string, trimmed, min 1, max 255
  - `body` (required): string, trimmed, min 1, max 10000

### GET /announcements

- Auth: Protected (any authenticated user)
- Query:
  - `page` (optional): int > 0, default 1
  - `limit` (optional): int 1-100, default 20
  - `courseId` (optional): uuid
  - `createdBy` (optional): uuid
  - `search` (optional): string, trimmed, max 255

### GET /announcements/:id

- Auth: Protected (any authenticated user)
- Params:
  - `id` (required): uuid

### PUT /announcements/:id

- Auth: Protected (`admin | instructor`)
- Params:
  - `id` (required): uuid
- Body (at least one required):
  - `courseId` (optional): uuid
  - `title` (optional): string, trimmed, min 1, max 255
  - `body` (optional): string, trimmed, min 1, max 10000

### DELETE /announcements/:id

- Auth: Protected (`admin | instructor`)
- Params:
  - `id` (required): uuid

---

## Grades

All `/grades` endpoints require authentication.

### POST /grades

- Auth: Protected (`admin | instructor`)
- Body:
  - `studentId` (required): uuid
  - `courseId` (required): uuid
  - `sourceType` (required): `assignment | quiz | material | announcement`
  - `sourceId` (required): uuid
  - `score` (required): number, min 0, max 9999.99
  - `maxScore` (required): number, `> 0`, max 9999.99

### GET /grades

- Auth: Protected (any authenticated user)
- Query:
  - `page` (optional): int > 0, default 1
  - `limit` (optional): int 1-100, default 20
  - `studentId` (optional): uuid
  - `courseId` (optional): uuid
  - `sourceType` (optional): `assignment | quiz | material | announcement`
  - `sourceId` (optional): uuid

### GET /grades/:id

- Auth: Protected (any authenticated user)
- Params:
  - `id` (required): uuid

### PUT /grades/:id

- Auth: Protected (`admin | instructor`)
- Params:
  - `id` (required): uuid
- Body (at least one required):
  - `studentId` (optional): uuid
  - `courseId` (optional): uuid
  - `sourceType` (optional): `assignment | quiz | material | announcement`
  - `sourceId` (optional): uuid
  - `score` (optional): number, min 0, max 9999.99
  - `maxScore` (optional): number, `> 0`, max 9999.99

### DELETE /grades/:id

- Auth: Protected (`admin | instructor`)
- Params:
  - `id` (required): uuid

---

## Comments

All `/comments` endpoints require authentication.

### POST /comments

- Auth: Protected (any authenticated user)
- Body:
  - `targetType` (required): `assignment | quiz | material | announcement`
  - `targetId` (required): uuid
  - `parentId` (optional, nullable): uuid
  - `body` (required): string, trimmed, min 1, max 5000

### GET /comments

- Auth: Protected (any authenticated user)
- Query:
  - `page` (optional): int > 0, default 1
  - `limit` (optional): int 1-100, default 20
  - `targetType` (optional): `assignment | quiz | material | announcement`
  - `targetId` (optional): uuid
  - `parentId` (optional): uuid
  - `userId` (optional): uuid

### GET /comments/:id

- Auth: Protected (any authenticated user)
- Params:
  - `id` (required): uuid

### PUT /comments/:id

- Auth: Protected (any authenticated user)
- Params:
  - `id` (required): uuid
- Body:
  - `body` (required): string, trimmed, min 1, max 5000

### DELETE /comments/:id

- Auth: Protected (any authenticated user)
- Params:
  - `id` (required): uuid

---

## Reactions

All `/reactions` endpoints require authentication.

### POST /reactions

- Auth: Protected (any authenticated user)
- Body:
  - `targetType` (required): `assignment | quiz | material | announcement`
  - `targetId` (required): uuid
  - `reaction` (required): `like | love | haha | wow | sad | angry`

### GET /reactions

- Auth: Protected (any authenticated user)
- Query:
  - `page` (optional): int > 0, default 1
  - `limit` (optional): int 1-100, default 20
  - `targetType` (optional): `assignment | quiz | material | announcement`
  - `targetId` (optional): uuid
  - `userId` (optional): uuid
  - `reaction` (optional): `like | love | haha | wow | sad | angry`

### GET /reactions/:id

- Auth: Protected (any authenticated user)
- Params:
  - `id` (required): uuid

### DELETE /reactions/:id

- Auth: Protected (any authenticated user)
- Params:
  - `id` (required): uuid
