// Ensure localhost always uses HTTP
const getBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";
  
  // Force HTTP for localhost if HTTPS is accidentally set
  if (envUrl.includes('localhost') && envUrl.startsWith('https://')) {
    console.warn('⚠️ Correcting HTTPS to HTTP for localhost');
    return envUrl.replace('https://', 'http://');
  }
  
  return envUrl;
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  NODE_ENV: process.env.NODE_ENV,
};

export function debugApiConfig() {
  console.log("🔧 API Configuration Debug:", {
    baseUrl: API_CONFIG.BASE_URL,
    nodeEnv: API_CONFIG.NODE_ENV,
    envVariable: process.env.NEXT_PUBLIC_BASE_URL,
    rawEnvVariable: process.env.NEXT_PUBLIC_BASE_URL,
    hasCredentials: "include",
    protocol: API_CONFIG.BASE_URL.startsWith('https') ? 'HTTPS ⚠️' : 'HTTP ✅',
  });
  
  // Warn if using HTTPS for localhost
  if (API_CONFIG.BASE_URL.includes('localhost') && API_CONFIG.BASE_URL.startsWith('https')) {
    console.error('❌ ERROR: Cannot use HTTPS for localhost without SSL certificate!');
    console.error('   Your backend must be running on HTTP (http://localhost:3001)');
  }
}

// Log config on import in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  debugApiConfig();
}
