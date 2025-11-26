/**
 * UI Design System Constants
 * Centralized design tokens for consistent spacing, sizing, and styling
 */

/**
 * Spacing scale (in pixels)
 * Use these instead of hardcoded numbers
 */
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
} as const;

/**
 * Border radius values
 */
export const BORDER_RADIUS = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999, // For circular elements
} as const;

/**
 * Font sizes
 */
export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 36,
  hero: 48,
} as const;

/**
 * Font weights
 */
export const FONT_WEIGHT = {
  light: "300",
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
} as const;

/**
 * Shadow presets
 */
export const SHADOWS = {
  none: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;

/**
 * Icon sizes
 */
export const ICON_SIZE = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
  xxl: 48,
} as const;

/**
 * Button heights
 */
export const BUTTON_HEIGHT = {
  sm: 36,
  md: 44,
  lg: 52,
  xl: 60,
} as const;

/**
 * Input heights
 */
export const INPUT_HEIGHT = {
  sm: 40,
  md: 48,
  lg: 56,
} as const;

/**
 * Layout breakpoints (for responsive design)
 */
export const BREAKPOINTS = {
  mobile: 320,
  tablet: 768,
  desktop: 1024,
} as const;

/**
 * Z-index layers
 */
export const Z_INDEX = {
  base: 0,
  dropdown: 10,
  modal: 100,
  toast: 1000,
  tooltip: 1100,
} as const;

/**
 * Opacity values
 */
export const OPACITY = {
  disabled: 0.4,
  muted: 0.6,
  normal: 1,
} as const;

/**
 * Progress bar heights
 */
export const PROGRESS_BAR = {
  thin: 2,
  normal: 4,
  thick: 8,
} as const;
