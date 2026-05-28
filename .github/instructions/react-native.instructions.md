---
applyTo: "app/**/*.tsx"
description: "Expo Router screen conventions for this LMS React Native app. Use when creating or editing route files, screens, navigation flows, and screen-level data loading."
---

# GitHub Copilot Instructions

## Project Overview

This is an Expo Router + React Native + TypeScript LMS application.

The current project structure is centered around:

- `app/` for route files and screen entry points
- `services/` for API access and response normalization
- `models/` for shared domain types and response models
- `stores/` for Zustand state, especially authentication and session state
- `lib/` for shared infrastructure such as the API client and constants

Prefer the patterns already present in this repository over generic web React patterns.

## Tech Stack

- Expo + Expo Router
- React Native
- TypeScript
- Zustand
- `fetch` wrapped by the shared API client in `lib/api.ts`
- Service-layer API access in `services/`
- Shared domain models in `models/`

## Architecture Rules

- Route files in `app/` are screen entry points, not general-purpose utility modules.
- Keep route files thin: UI composition, local view state, and screen lifecycle logic are allowed.
- Do not call `fetch` directly inside route files or components.
- Do not duplicate request logic inside screens; use `services/` instead.
- Put endpoint selection, request calls, and response normalization in service files.
- Reuse `models/` types instead of redefining the same object shapes inside screens.
- Use Zustand only for app-wide state such as auth or shared session state.
- Use local component state for temporary UI state such as loading toggles, form input, selected filters, and transient errors.

## Expo Router Rules

- Use default exports for route files in `app/` because Expo Router expects route modules to export a default screen component.
- Prefer named exports everywhere else unless a framework entry file requires a default export.
- Match navigation targets to the file structure inside `app/`.
- Use Expo Router APIs such as `router.push`, `router.replace`, and `router.back` for navigation.
- Use route params that align with file names such as `app/course/[courseId].tsx`.
- Keep route-level auth and bootstrapping logic near `app/_layout.tsx` or the owning route boundary.

## React Native UI Rules

- Use React Native primitives such as `View`, `Text`, `Pressable`, `ScrollView`, `TextInput`, and `SafeAreaView`.
- Do not suggest web-only elements such as `div`, `span`, `button`, `section`, or `main`.
- Do not suggest web-only libraries or patterns such as React Router, DOM event handlers, or CSS Modules.
- Follow the existing styling approach in the repo. If a file already uses `StyleSheet`, stay consistent with that pattern.
- Prefer readable, centralized style objects over large inline style blocks when editing or extending existing screens.
- Keep touch targets reasonably large and mobile-friendly.
- Account for loading, empty, and error states in screen-level UI.

## Data Fetching Rules

- All API access must go through the shared API client in `lib/api.ts`.
- Screens and components should call service functions from `services/`, not `api.get` or `api.post` directly.
- Normalize inconsistent backend responses inside the service layer.
- Throw and handle typed or structured errors where practical.
- When handling errors, prefer `unknown` in catch blocks and narrow safely.
- Avoid duplicating role-based endpoint selection logic across screens; keep that logic in services.

## State Management Rules

- Use Zustand for authentication, persisted session state, and app-wide state that must survive navigation.
- Do not move server response collections into Zustand unless multiple distant screens genuinely need shared mutable access.
- Keep one-off screen data in local component state unless there is a clear shared-state reason not to.
- Hydration logic for persisted auth belongs in the store or app bootstrap layer, not repeated across screens.

## TypeScript Rules

- Use explicit types for public function inputs and return values.
- Use `import type` for type-only imports.
- Prefer `type` aliases for object shapes and component props.
- Use `unknown` in catch blocks, never `any`.
- Do not introduce `any` unless there is no practical alternative.
- Do not use `@ts-ignore`; use `@ts-expect-error` only when unavoidable and explain why.
- Avoid non-null assertions. Prefer null checks, optional chaining, or control-flow narrowing.
- Prefer framework and model types over ad hoc casting.

## Import Order

Always prefer this order:

1. React and React Native imports
2. Expo and third-party packages
3. Internal alias imports from `@/`
4. Relative imports

Use `import type` where applicable.

## File and Responsibility Rules

- `app/`: route files and route-level UI composition only
- `services/`: API calls, endpoint selection, and response normalization
- `models/`: domain models and shared response types
- `stores/`: Zustand stores and persistence logic
- `lib/`: infrastructure helpers such as API client setup and shared constants

If a change needs reusable screen subcomponents, prefer introducing a dedicated shared component rather than growing route files indefinitely.

## What Copilot Should Never Do

- Never suggest React Router in this Expo Router project.
- Never suggest web-only JSX elements or browser-only APIs for native screens.
- Never call `fetch` directly in screen files when `services/` already owns data access.
- Never put endpoint strings throughout route components.
- Never store all remote API data in Zustand by default.
- Never replace required route-file default exports with named-only exports.
- Never introduce `any` when a real type or `unknown` can be used.
- Never bypass the shared API client in `lib/api.ts` without a strong reason.
- Never move service-layer normalization logic into UI components.

## Preferred Copilot Behavior

- When editing a route file, preserve Expo Router compatibility first.
- When adding data access, look for an existing service file before creating new request code.
- When adding auth-aware behavior, check `stores/auth.store.ts` before creating parallel state.
- When adding new models, keep naming and shape conventions aligned with the existing `models/` folders.
- When proposing UI changes, prefer mobile-first layouts and patterns that match the current codebase.
