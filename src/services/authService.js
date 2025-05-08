// src/services/authService.js
import api from "./api";

/**
 * Handles Google OAuth integration
 */
export const googleOAuth = {
  // Initiate Google OAuth flow
  startGoogleLogin: () => {
    const apiBaseUrl =
      import.meta.env.VITE_API_URL || "http://localhost:3000/api";

    localStorage.setItem("googleLoginPending", true);

    // Redirect to backend with frontend callback URL
    window.location.href = `${apiBaseUrl}/auth/google`;
  },

  checkGoogleAuthStatus: async () => {
    try {
      const response = await api.get("/auth/google/status");
      return response.data;
    } catch (error) {
      console.error("Error checking Google auth status:", error);
      throw error;
    }
  },

  handleCallback: async (code) => {
    try {
      const response = await api.post("/auth/google/callback", { code });
      return response.data;
    } catch (error) {
      console.error("Error processing Google callback:", error);
      throw error;
    }
  },

  completeGoogleAuth: async () => {
    try {
      const response = await api.post("/auth/google/complete");
      return response.data;
    } catch (error) {
      console.error("Error completing Google auth:", error);
      throw error;
    }
  },
};

export default googleOAuth;
