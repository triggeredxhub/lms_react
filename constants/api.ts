/**
 * API Configuration Constants
 * Centralized API configuration including base URL, timeouts, and endpoints
 */

export const API_CONFIG = {
  // Base URL - uses environment variable with fallback
  BASE_URL:
    process.env.EXPO_PUBLIC_API_BASE_URL ||
    "http://localhost:5000",

  // Timeout configurations (in milliseconds)
  TIMEOUT: 30000, // 30 seconds for regular requests
  UPLOAD_TIMEOUT: 60000, // 60 seconds for file uploads

  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second base delay

  // API Endpoints
  ENDPOINTS: {
    // Auth
    SIGNINEMS: "/api/user/login",
    SIGNINHRIS: "api/hris_user/login_hris",

    SIGNUP: "/api/auth/signup",
    GOOGLE_AUTH: "/api/auth/google",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: "/api/auth/reset-password",

    // User
    USER_PROFILE: "/api/user/profile",
    UPDATE_PROFILE: "/api/user/update",
    USER_GOALS: "/api/user/goals",

    // Food tracking
    FOOD_LOG: "/api/food/log",
    FOOD_HISTORY: "/api/food/history",
    FOOD_SEARCH: "/api/food/search",

    // Fitness
    WORKOUT_LOG: "/api/workout/log",
    WORKOUT_HISTORY: "/api/workout/history",

    // Stats
    DAILY_STATS: "/api/stats/daily",
    WEEKLY_STATS: "/api/stats/weekly",
    MONTHLY_STATS: "/api/stats/monthly",
  },
} as const;

// Animation and UI timing constants
export const TIMING = {
  // Navigation delays
  SUCCESS_REDIRECT_DELAY: 1800, // Delay before redirecting after success
  ALERT_AUTO_DISMISS: 3000, // Auto-dismiss alerts after 3 seconds

  // Debounce/Throttle
  SEARCH_DEBOUNCE: 300, // Debounce search input
  SCROLL_THROTTLE: 100, // Throttle scroll events

  // Animations
  FAST_ANIMATION: 200,
  NORMAL_ANIMATION: 300,
  SLOW_ANIMATION: 500,
} as const;
