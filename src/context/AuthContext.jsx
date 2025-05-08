// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const storedUser = localStorage.getItem("farmUser");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error parsing user from localStorage:", error);
          localStorage.removeItem("farmUser");
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const response = await loginUser(credentials);

      // Store user in state and localStorage
      // Only keep non-sensitive data
      const userData = {
        id: response.user.id,
        email: response.user.email,
        role: response.user.role,
        token: response.accessToken,
      };

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("farmUser", JSON.stringify(userData));

      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return {
        success: false,
        message:
          error.response?.data?.message || "Login failed. Please try again.",
      };
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      // Call the registerUser function from api.js
      // This now correctly formats the data for the backend
      await registerUser(userData);

      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("farmUser");
    localStorage.removeItem("googleLoginPending"); // Clear any pending Google login
    navigate("/login");
  };

  const updateUserData = (userData) => {
    // Make sure we don't store sensitive data
    const safeUserData = {
      id: userData.id,
      token: userData.token,
      // Add any other necessary user data
    };

    setUser(safeUserData);
    setIsAuthenticated(true);
    localStorage.setItem("farmUser", JSON.stringify(safeUserData));
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
