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

/**
 * Get real-time sensor data for specific date range
 * @param {string} farmId - Farm ID
 * @param {string} sensorType - Sensor type (e.g., pH, DO)
 * @param {Date|string} startDate - Start date and time
 * @param {Date|string} endDate - End date and time
 * @returns {Promise} - Promise with real-time sensor data
 */
export const getSensorRealtimeData = async (
  farmId,
  sensorType,
  startDate,
  endDate
) => {
  try {
    // Format dates if they are Date objects
    const startDateStr = typeof startDate === 'object' 
      ? startDate.toISOString() 
      : startDate;
    
    const endDateStr = typeof endDate === 'object'
      ? endDate.toISOString()
      : endDate;

    const response = await api.get(
      `/dashboard/farm/${farmId}/sensor/${sensorType}/realtime-data`,
      {
        params: {
          startDate: startDateStr,
          endDate: endDateStr
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error getting real-time data for farm ${farmId} and sensor ${sensorType}:`,
      error
    );
    throw error;
  }
};

export default {
  getDashboardSummary,
  getSensorChartData,
  getSensorRealtimeData
};