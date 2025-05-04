import api from "./api";

// Get all devices
export const getDevices = async (farmId) => {
  try {
    // If farmId is provided, get devices by farm
    const url = farmId ? `/devices/by-farm/${farmId}` : "/devices";
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching devices:", error);
    throw error;
  }
};

// Get a specific device by ID
export const getDevice = async (id) => {
  try {
    const response = await api.get(`/devices/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching device ${id}:`, error);
    throw error;
  }
};

// Create a new device
export const createDevice = async (deviceData) => {
  try {
    const response = await api.post("/devices", deviceData);
    return response.data;
  } catch (error) {
    console.error("Error creating device:", error);
    throw error;
  }
};

// Update an existing device
export const updateDevice = async (id, deviceData) => {
  try {
    const response = await api.patch(`/devices/${id}`, deviceData);
    return response.data;
  } catch (error) {
    console.error(`Error updating device ${id}:`, error);
    throw error;
  }
};

// Delete a device
export const deleteDevice = async (id) => {
  try {
    const response = await api.delete(`/devices/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting device ${id}:`, error);
    throw error;
  }
};
