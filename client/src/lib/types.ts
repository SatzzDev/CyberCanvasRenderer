// Type definitions for the application

// Image generation types
export type ImageType = "profile" | "welcome" | "goodbye";

// User status types
export type UserStatus = "free" | "premium" | "owner";

// Options for image generation
export interface GenerationOptions {
  username: string;
  avatarBuffer: Buffer;
  serverName?: string;
  isPremium: boolean;
  isOwner: boolean;
  extraGlow?: boolean;
  scanEffect?: boolean;
  matrixRain?: boolean;
  circuitBg?: boolean;
}

// Generated image response
export interface GeneratedImageResponse {
  buffer: Buffer;
  mimeType: string;
}
