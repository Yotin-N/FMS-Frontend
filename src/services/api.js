import axios from "axios";

// Create an axios instance with defaults
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const userData = localStorage.getItem("farmUser");
    if (userData) {
      try {
        const { token } = JSON.parse(userData);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
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
    // Transform the user data to match the backend expectations
    const registerData = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      // Omit confirmPassword as it's not needed on the backend
    };

    // Send registration request directly to the users/register endpoint
    const response = await api.post("/users/register", registerData);
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const getFarms = async () => {
  try {
    // Explicitly include relationships in the request if your API supports it
    // Use your API's specific query parameter format
    const response = await api.get("/farms/my-farms");

    // Process the response based on your API's actual structure
    // This structure should match what your API returns
    let farms = [];

    // Check the actual structure of your API response
    if (response.data && response.data.data) {
      farms = response.data.data;
    } else if (Array.isArray(response.data)) {
      farms = response.data;
    } else {
      farms = []; // Fallback to empty array if unexpected structure
    }

    // For debugging, log the actual structure
    console.log("API Farm Response:", response.data);

    // Ensure we have placeholders for any missing data to prevent UI errors
    const processedFarms = farms.map((farm) => ({
      ...farm,
      // Important: Initialize with empty arrays if these properties don't exist
      members: Array.isArray(farm.members) ? farm.members : [],
      devices: Array.isArray(farm.devices) ? farm.devices : [],
    }));

    return {
      data: processedFarms,
      total: processedFarms.length,
      page: 1,
      limit: processedFarms.length,
      totalPages: 1,
    };
  } catch (error) {
    console.error("Get farms error:", error);
    throw error;
  }
};

export const getFarm = async (farmId) => {
  try {
    // Use query parameters to include relationships if supported by your API
    const response = await api.get(`/farms/${farmId}`);

    // Process the response to ensure members and devices arrays exist
    if (response.data) {
      const farm = response.data;
      return {
        ...farm,
        // Ensure members property exists
        members: farm.members || [],
        // Ensure devices property exists
        devices: farm.devices || [],
      };
    }

    return response.data;
  } catch (error) {
    console.error(`Get farm ${farmId} error:`, error);
    throw error;
  }
};

export const createFarm = async (farmData) => {
  try {
    // Ensure we're only sending the fields the backend expects
    const payload = {
      name: farmData.name,
      description: farmData.description || "",
    };

    const response = await api.post("/farms", payload);
    return response.data;
  } catch (error) {
    console.error("Farm creation error:", error);
    throw error;
  }
};

export const updateFarm = async (farmId, farmData) => {
  try {
    // Ensure we're only sending the fields the backend expects
    const payload = {
      name: farmData.name,
      description: farmData.description || "",
    };

    const response = await api.patch(`/farms/${farmId}`, payload);
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

export const getFarmMembers = async (farmId) => {
  try {
    const response = await api.get(`/farms/${farmId}/members`);
    return response.data;
  } catch (error) {
    console.error(`Get farm members error:`, error);
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

export const getDevice = async (deviceId) => {
  try {
    const response = await api.get(`/devices/${deviceId}`);
    return response.data;
  } catch (error) {
    console.error(`Get device ${deviceId} error:`, error);
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

// Sensor API calls
export const getSensors = async (deviceId) => {
  try {
    const response = await api.get(`/sensors/by-device/${deviceId}`);
    return response.data;
  } catch (error) {
    console.error("Get sensors error:", error);
    throw error;
  }
};

export const getSensor = async (sensorId) => {
  try {
    const response = await api.get(`/sensors/${sensorId}`);
    return response.data;
  } catch (error) {
    console.error(`Get sensor ${sensorId} error:`, error);
    throw error;
  }
};

export const addSensor = async (sensorData) => {
  try {
    const response = await api.post("/sensors", sensorData);
    return response.data;
  } catch (error) {
    console.error("Add sensor error:", error);
    throw error;
  }
};

export const updateSensor = async (sensorId, sensorData) => {
  try {
    const response = await api.patch(`/sensors/${sensorId}`, sensorData);
    return response.data;
  } catch (error) {
    console.error("Update sensor error:", error);
    throw error;
  }
};

export const deleteSensor = async (sensorId) => {
  try {
    const response = await api.delete(`/sensors/${sensorId}`);
    return response.data;
  } catch (error) {
    console.error("Delete sensor error:", error);
    throw error;
  }
};

// Sensor reading API calls
export const getSensorReadings = async (sensorId, params = {}) => {
  try {
    const response = await api.get(`/sensors/${sensorId}/readings`, { params });
    return response.data;
  } catch (error) {
    console.error("Get sensor readings error:", error);
    throw error;
  }
};

export const addSensorReading = async (sensorId, readingData) => {
  try {
    const response = await api.post(
      `/sensors/${sensorId}/readings`,
      readingData
    );
    return response.data;
  } catch (error) {
    console.error("Add sensor reading error:", error);
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
    // Create a copy of userData
    const dataToSend = { ...userData };

    // Convert status to isActive if status is present
    if ("status" in dataToSend) {
      dataToSend.isActive = dataToSend.status === "ACTIVE";
      delete dataToSend.status; // Remove status as it's not in the DTO
    }

    // Use register endpoint for user creation
    const response = await api.post("/users/register", dataToSend);
    return response.data;
  } catch (error) {
    console.error("Create user error:", error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    // Create a clean object with only the fields that can be updated
    const updateData = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role: userData.role,
      isActive: userData.isActive,
    };

    // Only include password if it's provided and not empty
    if (userData.password) {
      updateData.password = userData.password;
    }

    const response = await api.patch(`/users/${userId}`, updateData);
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

export const searchUsersByEmail = async (email, farmId) => {
  try {
    const params = { email };
    if (farmId) params.farmId = farmId;

    const response = await api.get("/users/search", { params });
    return response.data;
  } catch (error) {
    console.error("Error searching users:", error);
    throw error;
  }
};

export default api;
