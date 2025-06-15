export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001",
  NODE_ENV: process.env.NODE_ENV,
};

export function debugApiConfig() {
  console.log("🔧 API Configuration Debug:", {
    baseUrl: API_CONFIG.BASE_URL,
    nodeEnv: API_CONFIG.NODE_ENV,
    envVariable: process.env.NEXT_PUBLIC_BASE_URL,
    hasCredentials: "include",
  });
}

// Log config on import in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  debugApiConfig();
}
