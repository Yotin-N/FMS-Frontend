// src/services/sensorApi.js
import api from "./api";

/**
 * Get all sensors with optional pagination
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise} - Promise with sensor data
 */
export const getAllSensors = async (page = 1, limit = 10) => {
  try {
    const response = await api.get("/sensors", { params: { page, limit } });
    return response.data;
  } catch (error) {
    console.error("Error getting all sensors:", error);
    throw error;
  }
};

/**
 * Get sensors for a specific device
 * @param {string} deviceId - Device ID
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise} - Promise with sensor data
 */
export const getSensorsByDevice = async (deviceId, page = 1, limit = 10) => {
  try {
    const response = await api.get(`/sensors/by-device/${deviceId}`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error(`Error getting sensors for device ${deviceId}:`, error);
    throw error;
  }
};

/**
 * Get a specific sensor by ID
 * @param {string} id - Sensor ID
 * @returns {Promise} - Promise with sensor data
 */
export const getSensor = async (id) => {
  try {
    const response = await api.get(`/sensors/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting sensor ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new sensor
 * @param {object} sensorData - Sensor data
 * @returns {Promise} - Promise with created sensor
 */
export const createSensor = async (sensorData) => {
  try {
    const response = await api.post("/sensors", sensorData);
    return response.data;
  } catch (error) {
    console.error("Error creating sensor:", error);
    throw error;
  }
};

/**
 * Update an existing sensor
 * @param {string} id - Sensor ID
 * @param {object} sensorData - Updated sensor data
 * @returns {Promise} - Promise with updated sensor
 */
export const updateSensor = async (id, sensorData) => {
  try {
    const response = await api.patch(`/sensors/${id}`, sensorData);
    return response.data;
  } catch (error) {
    console.error(`Error updating sensor ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a sensor
 * @param {string} id - Sensor ID
 * @returns {Promise} - Promise with deletion result
 */
export const deleteSensor = async (id) => {
  try {
    const response = await api.delete(`/sensors/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting sensor ${id}:`, error);
    throw error;
  }
};

/**
 * Get readings for a specific sensor
 * @param {string} sensorId - Sensor ID
 * @param {object} params - Optional parameters (startDate, endDate, page, limit)
 * @returns {Promise} - Promise with sensor readings
 */
export const getSensorReadings = async (sensorId, params = {}) => {
  try {
    const response = await api.get(`/sensors/${sensorId}/readings`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error getting readings for sensor ${sensorId}:`, error);
    throw error;
  }
};

/**
 * Get the latest reading for a sensor
 * @param {string} sensorId - Sensor ID
 * @returns {Promise} - Promise with latest reading
 */
export const getLatestReading = async (sensorId) => {
  try {
    const response = await api.get(`/sensors/${sensorId}/readings/latest`);
    return response.data;
  } catch (error) {
    console.error(
      `Error getting latest reading for sensor ${sensorId}:`,
      error
    );
    throw error;
  }
};

/**
 * Add a new reading to a sensor
 * @param {string} sensorId - Sensor ID
 * @param {object} readingData - Reading data (value, timestamp optional)
 * @returns {Promise} - Promise with created reading
 */
export const addSensorReading = async (sensorId, readingData) => {
  try {
    const response = await api.post(
      `/sensors/${sensorId}/readings`,
      readingData
    );
    return response.data;
  } catch (error) {
    console.error(`Error adding reading to sensor ${sensorId}:`, error);
    throw error;
  }
};

/**
 * Update an existing reading
 * @param {string} sensorId - Sensor ID
 * @param {string} readingId - Reading ID
 * @param {object} readingData - Updated reading data
 * @returns {Promise} - Promise with updated reading
 */
export const updateSensorReading = async (sensorId, readingId, readingData) => {
  try {
    const response = await api.patch(
      `/sensors/${sensorId}/readings/${readingId}`,
      readingData
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating reading ${readingId}:`, error);
    throw error;
  }
};

/**
 * Delete a sensor reading
 * @param {string} sensorId - Sensor ID
 * @param {string} readingId - Reading ID
 * @returns {Promise} - Promise with deletion result
 */
export const deleteSensorReading = async (sensorId, readingId) => {
  try {
    const response = await api.delete(
      `/sensors/${sensorId}/readings/${readingId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting reading ${readingId}:`, error);
    throw error;
  }
};

/**
 * Get statistics for a sensor's readings within a time period
 * @param {string} sensorId - Sensor ID
 * @param {string} startDate - Start date (ISO string)
 * @param {string} endDate - End date (ISO string, optional)
 * @returns {Promise} - Promise with reading statistics
 */
export const getSensorStats = async (sensorId, startDate, endDate) => {
  try {
    const params = { startDate };
    if (endDate) params.endDate = endDate;

    const response = await api.get(`/sensors/${sensorId}/readings/stats`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error(`Error getting statistics for sensor ${sensorId}:`, error);
    throw error;
  }
};

export default {
  getAllSensors,
  getSensorsByDevice,
  getSensor,
  createSensor,
  updateSensor,
  deleteSensor,
  getSensorReadings,
  getLatestReading,
  addSensorReading,
  updateSensorReading,
  deleteSensorReading,
  getSensorStats,
};
