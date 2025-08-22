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
    // Determine granularity based on time range
    const getGranularityMinutes = (hours) => {
      const range = Number(hours);

      if (range <= 1) {
        return 1;
      } else if (range <= 6) {
        return 5;
      } else if (range <= 24) {
        return 15;
      } else {
        return 1440; // 1440 นาที = 24 ชั่วโมง * 60 นาที
      }
    };

    const granularityMinutes = getGranularityMinutes(timeRange);
    const params = {
      timeRange,
      granularityMinutes,
    };

    if (sensorType) {
      params.sensorType = sensorType;
    }

    const response = await api.get(`/dashboard/farm/${farmId}/sensor-data`, {
      params,
    });

    // Log data points for debugging
    if (timeRange <= 1 && response.data) {
      console.log(
        `📊 Fetching ${timeRange}h data with ${granularityMinutes}min granularity`
      );
      response.data.forEach((sensorData) => {
        if (sensorData && sensorData.data) {
          console.log(
            `📈 ${sensorData.type}: ${sensorData.data.length} data points`
          );
        }
      });
    }

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
    const startDateStr =
      typeof startDate === "object" ? startDate.toISOString() : startDate;

    const endDateStr =
      typeof endDate === "object" ? endDate.toISOString() : endDate;

    const response = await api.get(
      `/dashboard/farm/${farmId}/sensor/${sensorType}/realtime-data`,
      {
        params: {
          startDate: startDateStr,
          endDate: endDateStr,
        },
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
  getSensorRealtimeData,
};
