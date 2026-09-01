# Copilot Instructions

This is an Expo Router + React Native + TypeScript LMS app. For detailed architecture and patterns, see [AGENTS.md](../../AGENTS.md).

## Quick Start for AI Agents

### Key Rule: Use the Service Layer
- ❌ Never call `api.get()` or `fetch()` directly in screens
- ✅ Always use service functions from `services/` 
- ✅ Services handle response normalization automatically

### Typical Workflow

1. **Import from services**: `import { getCourses } from '@/services/course.service'`
2. **Call in useEffect**: Fetch data when screen mounts
3. **Handle errors**: Catch and display errors to user
4. **Use local state**: Store temporary UI state in component (not Zustand)

### Response Normalization Example

The backend returns responses in various shapes. Services normalize them:

```typescript
// Services normalize ALL variations into consistent models
function normalizeArrayResponse<T>(response: unknown): T[] {
  if (Array.isArray(response)) return response;
  // Extract from .data, .items, .results, .courses, etc.
  // Search nested properties
  // Return first array found
}
```

**Why?** The backend may wrap responses differently. Services handle it once; screens use clean models.

## Tech Stack at a Glance

| What | How |
|------|-----|
| Routing | Expo Router (file-based) |
| State | Zustand (auth/session only) |
| API | Centralized `lib/api.ts` + service layer |
| Models | TypeScript in `models/` (reuse, don't duplicate) |
| Auth | Token in SecureStore with AsyncStorage fallback |
| Styling | React Native primitives + inline styles (follow existing patterns) |

## Authentication

```typescript
// Get current user
const user = useAuthStore(state => state.user);

// Sign out
const signOut = useAuthStore(state => state.signOut);
await signOut();

// Check hydration status
const isHydrated = useAuthStore(state => state.isHydrated);
```

**Important**: Auth state is hydrated from storage in `app/_layout.tsx`. Don't call services in screens before hydration completes.

## File Organization

- **`app/`** – Route files (Expo Router)
- **`services/`** – API calls + normalization
- **`models/`** – Shared TypeScript types
- **`stores/`** – Zustand (auth.store.ts only)
- **`lib/`** – API client, constants, utilities
- **`components/`** – Reusable React Native components

## Common Patterns

### Fetching Data in a Screen

```typescript
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { getCourses } from '@/services/course.service';
import { Course } from '@/models/course/Course.model';

export default function CoursesScreen() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>{error}</Text>;
  return (
    <View>
      {courses.map(course => <Text key={course.id}>{course.title}</Text>)}
    </View>
  );
}
```

### Creating a Service Function

```typescript
// services/example.service.ts
import { api } from '@/lib/api';
import { MyModel } from '@/models/example/MyModel.model';

function normalizeResponse(response: unknown): MyModel {
  if (!response || typeof response !== 'object') {
    throw new Error('Invalid response');
  }
  const record = response as Record<string, unknown>;
  return {
    id: record.id,
    title: record.title as string,
    // ... normalize all fields
  };
}

export async function getExample(id: string): Promise<MyModel> {
  const response = await api.get(`/endpoint/${id}`, {}, true);
  return normalizeResponse(response);
}
```

## Import Order

```typescript
// 1. React & React Native
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

// 2. Expo & packages
import { router } from 'expo-router';

// 3. Internal @ aliases
import { useAuthStore } from '@/stores/auth.store';
import { getCourses } from '@/services/course.service';

// 4. Relative (minimize)
import { CourseCard } from '../components/CourseCard';
```

## Error Handling

Always catch with `unknown`, then narrow:

```typescript
try {
  await someService.fetch();
} catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown error';
  setError(message);
}
```

## TypeScript Rules

- ✅ Explicit return types on functions
- ✅ `import type` for types only
- ✅ Use `unknown` in catch blocks
- ❌ No `any` (use proper narrowing)
- ❌ No non-null assertions
- ❌ No `@ts-ignore` (use `@ts-expect-error` if truly needed, with explanation)

## Important Notes

- **API base URL**: Configured in `lib/constants/api.ts` from `EXPO_PUBLIC_API_BASE_URL` env or `http://localhost:3000`
- **Android localhost**: Automatically resolved to `10.0.2.2`
- **Auth token**: Automatically included in requests when `requiresAuth=true`
- **Response variations**: Services normalize, models use aliases (e.g., `id`, `userId`, `user_id`)
- **Drawer navigation**: Only in `app/(app)/` (protected routes)

## For More Details

See [AGENTS.md](../../AGENTS.md) for:
- Full architecture guide
- Common pitfalls
- Build & development commands
- API integration patterns
- Response normalization examples
