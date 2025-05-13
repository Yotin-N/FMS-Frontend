
import axios from "axios";



const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

function decodeJwt(token) {
  try {
    // JWT tokens consist of three parts: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }
    
    // The payload is the second part, base64 encoded
    const base64Payload = parts[1];
    // Replace characters for base64url to standard base64
    const base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
    // Decode the base64 string to get the JSON payload
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    
    // Parse the JSON payload to an object
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT token:', error);
    return {};
  }
}

const refreshToken = async () => {
  try {
    const userData = localStorage.getItem("farmUser");
    
    // If we don't have user data, we can't refresh
    if (!userData || !userData.token) {
      throw new Error("No user data found");
    }
    
    // Call the token refresh endpoint
    const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
      token: userData.token // Send the current token, even if expired
    });
    
    // Update the stored token with the new one
    const newUserData = {
      ...JSON.parse(userData),
      token: response.data.accessToken,
      // Optionally update user information if it's returned
      ...(response.data.user && { user: response.data.user })
    };
    
    localStorage.setItem("farmUser", JSON.stringify(newUserData));
    
    return response.data.accessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    // Clear user data if refresh fails
    localStorage.removeItem("farmUser");
    // Only redirect to login if we get a 401 from the refresh attempt
    if (error.response && error.response.status === 401) {
      window.location.href = "/login";
      localStorage.setItem("authError", "Your session has expired. Please log in again.");
    }
    throw error;
  }
};

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const userData = localStorage.getItem("farmUser");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        const { token } = parsedData;
        
        if (token) {
          // Check if token is already expired
          const decoded = decodeJwt(token);
          const currentTime = Date.now() / 1000;
          
          // For logging purposes
          if (decoded.exp) {
            const timeRemaining = decoded.exp - currentTime;
            console.log(`Token expires in ${timeRemaining.toFixed(2)} seconds`);
          }

          // Add token to request header regardless of expiration
          // The response interceptor will handle expired tokens
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

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is unauthorized (401) and we haven't retried yet
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If a refresh is already in progress, add this request to the queue
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token
        const newToken = await refreshToken();
        
        // Update the authorization header for the failed request
        originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
        
        // Process any queued requests with the new token
        processQueue(null, newToken);
        
        // Retry the original request with the new token
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, process queue with error
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
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

export const refreshAuthToken = async () => {
  refreshToken
}

export const registerUser = async (userData) => {
  try {
    
    const registerData = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
     
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
