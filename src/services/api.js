// src/services/api.js
import axios from "axios";

// Create an axios instance with defaults
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem("farmUser");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API calls
export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

// Farm API calls
export const createFarm = async (farmData) => {
  try {
    const response = await api.post("/farms", farmData);
    return response.data;
  } catch (error) {
    console.error("Farm creation error:", error);
    throw error;
  }
};

export const getFarms = async () => {
  try {
    const response = await api.get("/farms/my-farms");
    return response.data;
  } catch (error) {
    console.error("Get farms error:", error);
    throw error;
  }
};

export const updateFarm = async (farmId, farmData) => {
  try {
    const response = await api.patch(`/farms/${farmId}`, farmData);
    return response.data;
  } catch (error) {
    console.error("Farm update error:", error);
    throw error;
  }
};

export const deleteFarm = async (farmId) => {
  try {
    const response = await api.delete(`/farms/${farmId}`);
    return response.data;
  } catch (error) {
    console.error("Farm deletion error:", error);
    throw error;
  }
};

export const addFarmMember = async (farmId, userId) => {
  try {
    const response = await api.post(`/farms/${farmId}/members`, { userId });
    return response.data;
  } catch (error) {
    console.error("Add farm member error:", error);
    throw error;
  }
};

export const removeFarmMember = async (farmId, userId) => {
  try {
    const response = await api.delete(`/farms/${farmId}/members/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Remove farm member error:", error);
    throw error;
  }
};

// Device API calls
export const getDevices = async (farmId) => {
  try {
    const response = await api.get(`/devices/by-farm/${farmId}`);
    return response.data;
  } catch (error) {
    console.error("Get devices error:", error);
    throw error;
  }
};

export const addDevice = async (deviceData) => {
  try {
    const response = await api.post("/devices", deviceData);
    return response.data;
  } catch (error) {
    console.error("Add device error:", error);
    throw error;
  }
};

export const updateDevice = async (deviceId, deviceData) => {
  try {
    const response = await api.patch(`/devices/${deviceId}`, deviceData);
    return response.data;
  } catch (error) {
    console.error("Update device error:", error);
    throw error;
  }
};

export const deleteDevice = async (deviceId) => {
  try {
    const response = await api.delete(`/devices/${deviceId}`);
    return response.data;
  } catch (error) {
    console.error("Delete device error:", error);
    throw error;
  }
};

// User API calls
export const getAllUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    console.error("Get users error:", error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Get user ${userId} error:`, error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await api.post("/users", userData);
    return response.data;
  } catch (error) {
    console.error("Create user error:", error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await api.patch(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Update user ${userId} error:`, error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Delete user ${userId} error:`, error);
    throw error;
  }
};

export const resetUserPassword = async (userId) => {
  try {
    const response = await api.post(`/users/${userId}/reset-password`);
    return response.data;
  } catch (error) {
    console.error(`Reset password for user ${userId} error:`, error);
    throw error;
  }
};

export default api;
