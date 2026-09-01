# AI Agent Instructions for LMS React Native

## Project Overview

This is an Expo Router + React Native + TypeScript learning management system (LMS) application. The app supports multiple user roles (student, instructor, admin) with course management, assignments, quizzes, and discussion features.

**Key Tech Stack:**

- **Runtime**: Expo, React Native, TypeScript 5.9
- **State**: Zustand for auth/session state
- **Routing**: Expo Router with file-based routing and drawer navigation
- **API**: Centralized fetch client with service-layer response normalization
- **Auth**: Token-based with SecureStore (iOS/Android) and AsyncStorage fallback
- **Backend**: Multi-source login support (LMS, EMS, HRIS) with response normalization

## Architecture Patterns

### Layered Architecture

```
app/                 → Screen entry points (Expo Router)
  ├─ _layout.tsx     → Root layout (auth hydration)
  ├─ (app)/          → Protected routes with drawer navigation
  └─ [route].tsx     → Dynamic routes (e.g., course/[courseId].tsx)

services/            → API calls + response normalization
  ├─ auth.service.ts → Login/register with multi-source support
  ├─ course.service.ts → Courses, enrollments, course feed
  └─ *.service.ts    → Feature-specific services

models/              → Shared TypeScript types
  ├─ auth/           → User, LoginResponse types
  ├─ course/         → Course, CourseFeed, CoursesResponse types
  └─ */              → Feature types

stores/              → Zustand state (app-wide only)
  └─ auth.store.ts   → Session, token, user, hydration

lib/                 → Shared infrastructure
  ├─ api.ts          → Centralized fetch client (use this, not fetch directly)
  ├─ constants/api.ts → API_CONFIG.BASE_URL with env + localhost fallback
  └─ course-detail-context.tsx → Context for course detail screens
```

### Response Normalization (Critical Pattern)

The backend can return responses in multiple shapes. **Services always normalize** to a consistent model:

```typescript
// Services use sophisticated normalization functions
function normalizeArrayResponse<T>(response: unknown): T[] {
  if (Array.isArray(response)) return response as T[];
  // Check response.items, response.data, response.results, etc.
  // Extract first array from object if nested
}

// Example: admin.service.ts normalizes courses, students, instructors
const normalizedCourses = normalizeArrayResponse<Course>(response)
  .map((course) => normalizeCourse(course))
  .filter((c): c is Course => c !== null);
```

**Action**: Always call service functions, never bypass normalization. If a service doesn't exist yet, add it with proper normalization.

### Authentication Flow

1. **Hydration** (`app/_layout.tsx`): On app launch, `auth.store.hydrate()` runs
2. **Persist**: Auth state (token, user, source) stored in SecureStore with AsyncStorage fallback
3. **Multi-Source**: Backend supports EMS, HRIS, LMS sources; app normalizes all to consistent `LoginResponse`
4. **Protected Routes**: Screens in `app/(app)/` are wrapped by drawer (app-level layout)
5. **Session**: `useAuthStore()` provides `user`, `token`, `status`, and auth methods

### Data Fetching in Screens

✅ **Do This:**

```typescript
import { getCourseById } from "@/services/course.service";

export default function CourseScreen() {
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCourseById(courseId)
      .then(setCourse)
      .catch((error) => setError(error.message));
  }, [courseId]);
}
```

❌ **Don't Do This:**

```typescript
// Never call api.get directly
const response = await api.get(`/courses/${id}`);

// Never fetch directly
const response = await fetch("...");

// Never inline normalization
const normalized = response.data?.courses?.[0];
```

## Directory & File Guide

| Path                                                                       | Purpose                                                 |
| -------------------------------------------------------------------------- | ------------------------------------------------------- |
| `app/_layout.tsx`                                                          | Root layout; calls `auth.store.hydrate()` on mount      |
| `app/admin.tsx`, `index.tsx`, `register.tsx`                               | Unauthenticated screens                                 |
| `app/(app)/_layout.tsx`                                                    | Drawer navigation layout for authenticated users        |
| `app/(app)/course.tsx`                                                     | Courses list screen                                     |
| `app/course/[courseId]/`                                                   | Course detail routes (index, grade, studentlist, task)  |
| `services/auth.service.ts`                                                 | Login/register with multi-source response normalization |
| `services/course.service.ts`                                               | Fetch courses, feed items, create course                |
| `services/assignment.service.ts`, `quiz.service.ts`, `material.service.ts` | Feature services                                        |
| `models/`                                                                  | Shared types (never duplicate in screens)               |
| `stores/auth.store.ts`                                                     | Zustand auth state + hydration                          |
| `lib/api.ts`                                                               | API client (request method, headers, auth)              |
| `lib/constants/api.ts`                                                     | `API_CONFIG.BASE_URL` from env or fallback              |

## Key Conventions

### Import Order

```typescript
// 1. React & React Native
import { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";

// 2. Expo & third-party
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// 3. Internal @ aliases
import { useAuthStore } from "@/stores/auth.store";
import { Course } from "@/models/course/Course.model";
import { getCourses } from "@/services/course.service";

// 4. Relative imports (avoid when possible)
import { CourseCard } from "../components/CourseCard";
```

### TypeScript

- **Explicit types** on public function signatures
- **Use `import type`** for type-only imports
- **Avoid `any`**; use `unknown` in catch blocks and narrow
- **Prefer type aliases** for props and object shapes
- **No non-null assertions** unless absolutely necessary
- **Use `@ts-expect-error` only** with explanation, never `@ts-ignore`

### Route Parameters

- Use dynamic segments matching filenames: `app/course/[courseId].tsx`
- Access via `useLocalSearchParams()`: `const { courseId } = useLocalSearchParams()`
- URLs like `/course/abc-123` map to this route

### Error Handling

```typescript
try {
  const data = await someService.fetchData();
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown error";
  setError(message);
}
```

### UI State (Local, Not Global)

Use local component state for:

- Loading indicators
- Form inputs
- Selected filters
- Transient error messages
- Search/sort state

Only use `useAuthStore` for persistent session data (user, token, auth status).

## Common Tasks

### Adding a New Endpoint

1. **Create/update service** in `services/`: Include normalization functions
2. **Define models** in `models/`: Type the normalized response
3. **Call service from screen**: Never call `api.get/post` directly
4. **Handle errors**: Catch and display to user

### Creating a New Screen

1. Create file in `app/` matching the route structure
2. Import services (not direct API calls)
3. Use local state for temporary UI state
4. Export default screen component
5. Add to `app/(app)/_layout.tsx` if authenticated route

### Working with Authentication

1. Get current user: `const user = useAuthStore(state => state.user)`
2. Get token: `const token = useAuthStore(state => state.token)`
3. Sign out: `const signOut = useAuthStore(state => state.signOut); await signOut()`
4. Check if hydrated: `const isHydrated = useAuthStore(state => state.isHydrated)`

## API Integration Notes

### Base URL Configuration

- **Env**: `EXPO_PUBLIC_API_BASE_URL` (production)
- **Default**: `http://localhost:3000`
- **Android runtime**: Automatically resolves `localhost` → `10.0.2.2`
- **Config**: See `lib/constants/api.ts`

### Auth Header

- Automatically added by `lib/api.ts` when `requiresAuth=true`
- Token stored in SecureStore with AsyncStorage fallback
- No manual header manipulation needed

### Response Normalization

Backend responses vary in structure. Services normalize to consistent models:

- Responses may nest data under `.data`, `.result`, `.items`, `.courses`, etc.
- Services extract arrays, handle missing fields, resolve field aliases
- Example: Assignment API returns `dueAt`, but model accepts `dueDate` and `due_date`

## Build & Development

```bash
# Install dependencies
npm install

# Start development
npm start

# Run on platform
npm run android    # Android emulator
npm run ios        # iOS simulator
npm run web        # Web

# Type check
npx tsc --noEmit

# Lint
npm run lint

# Reset project (moves starter code to app-example/)
npm run reset-project
```

## Important Architectural Decisions

1. **Services Layer**: All API access normalized in services, not in screens
2. **Model Aliases**: Models have multiple aliases (e.g., `assignmentId`, `id`, `userId`, `user_id`) to handle API variations
3. **No Global Collections**: Don't store API responses in Zustand unless multiple distant screens share mutable state
4. **Secure Storage**: Auth token uses SecureStore with AsyncStorage fallback for compatibility
5. **Multi-Source Auth**: App handles multiple backend auth systems gracefully
6. **Drawer Navigation**: `app/(app)/_layout.tsx` provides drawer for authenticated users

## Common Pitfalls

❌ **Don't bypass services**: Calling `api.get()` directly skips normalization
❌ **Don't duplicate response normalization**: Each service normalizes once; reuse results
❌ **Don't store transient UI state in Zustand**: Use local component state for filters, loading, errors
❌ **Don't duplicate models**: If a type exists in `models/`, import and reuse it
❌ **Don't add `any` to avoid type errors**: Use proper narrowing or `unknown` instead
❌ **Don't add response data to Zustand unless it's truly shared**: Most screen data belongs in local state

## Helpful Links

- [Expo Router Docs](https://docs.expo.dev/router/introduction/)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [React Native Docs](https://reactnative.dev)
- [API Endpoints Documentation](./.github/documentation/API_ENDPOINTS_BY_ROLE.md)
- [Expo Router Screen Conventions](./.github/instructions/react-native.instructions.md)

## When Things Go Wrong

**Type errors in models?** → Check for field aliases (e.g., `id` vs `userId`)
**API responses don't match models?** → Add/update normalization in the service
**Undefined values?** → Verify the service normalizes all response shapes, not just the happy path
**Auth not persisting?** → Check that `hydrate()` runs in `app/_layout.tsx` on app start
**Token not sent?** → Ensure service calls pass `requiresAuth=true` to `api.get/post`
