export const SLIDE_DIMENSIONS = {
  width: 1080,
  feedHeight: 1350,
  storiesHeight: 1920,
  feedMaxContainerWidth: 540,
  storiesMaxContainerWidth: 378,
} as const;

export const SIDEBAR = {
  minWidth: 260,
  maxWidth: 600,
  maxViewportRatio: 0.45,
  defaultWidth: 380,
} as const;

export const TIMEOUTS = {
  aiGenerateMs: 60000,
  pageWaitMs: 100,
} as const;

export const PAYLOAD_LIMITS = {
  maxRenderSize: 512000, // 500KB
} as const;
