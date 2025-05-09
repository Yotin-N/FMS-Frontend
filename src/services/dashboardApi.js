import api from "./api";

/**
 * Get dashboard summary for a farm
 * @param {string} farmId - Farm ID
 * @returns {Promise} - Promise with dashboard summary data
 */
export const getDashboardSummary = async (farmId) => {
  try {
    const response = await api.get(`/dashboard/farm/${farmId}/summary`);
    return response.data;
  } catch (error) {
    console.error(`Error getting dashboard summary for farm ${farmId}:`, error);
    throw error;
  }
};

/**
 * Get sensor data for charts
 * @param {string} farmId - Farm ID
 * @param {number} timeRange - Time range in hours (default: 24)
 * @param {string} sensorType - Optional sensor type filter
 * @returns {Promise} - Promise with sensor chart data
 */
export const getSensorChartData = async (
  farmId,
  timeRange = 24,
  sensorType = null
) => {
  try {
    const params = { timeRange };
    if (sensorType) {
      params.sensorType = sensorType;
    }

    const response = await api.get(`/dashboard/farm/${farmId}/sensor-data`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error(`Error getting sensor chart data for farm ${farmId}:`, error);
    throw error;
  }
};

export default {
  getDashboardSummary,
  getSensorChartData,
};
