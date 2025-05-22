import api from "./api";

/**
 * Get all thresholds for a farm
 * @param {string} farmId - Farm ID
 * @returns {Promise} - Promise with threshold data
 */
export const getFarmThresholds = async (farmId) => {
  try {
    const response = await api.get(`/sensor-thresholds/farm/${farmId}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting thresholds for farm ${farmId}:`, error);
    throw error;
  }
};

/**
 * Create or update thresholds for a specific sensor type in a farm
 * @param {string} farmId - Farm ID
 * @param {string} sensorType - Sensor type
 * @param {Array} thresholds - Array of threshold objects
 * @returns {Promise} - Promise with updated threshold data
 */
export const upsertSensorThresholds = async (
  farmId,
  sensorType,
  thresholds
) => {
  try {
    // Prepare the threshold data according to your DTO structure
    const thresholdData = thresholds.map((threshold) => ({
      farmId,
      sensorType,
      severityLevel: threshold.severityLevel,
      minValue: threshold.minValue,
      maxValue: threshold.maxValue,
      notificationEnabled: threshold.notificationEnabled,
      colorCode: threshold.colorCode,
      label: threshold.label,
    }));

    const response = await api.post(
      `/sensor-thresholds/farm/${farmId}/sensor/${sensorType}`,
      thresholdData
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error upserting thresholds for ${sensorType} in farm ${farmId}:`,
      error
    );
    throw error;
  }
};

/**
 * Get default thresholds for a sensor type
 * @param {string} sensorType - Sensor type
 * @returns {Promise} - Promise with default threshold data
 */
export const getDefaultThresholds = async (sensorType) => {
  try {
    const response = await api.get(`/sensor-thresholds/defaults/${sensorType}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting default thresholds for ${sensorType}:`, error);
    throw error;
  }
};

export default {
  getFarmThresholds,
  upsertSensorThresholds,
  getDefaultThresholds,
};
