/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import RefreshIcon from "@mui/icons-material/Refresh";
import { format, isValid } from "date-fns";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SensorChartsSection = ({
  chartData,
  onRefresh,
  isLoading,
  visibleSensors,
  timeRange = "24", // ✅ NEW: Receive timeRange prop for dynamic formatting
}) => {
  const theme = useTheme();

  const getSensorTypeColor = (type) => {
    const colorMap = {
      TempA: "#f44336",
      TempB: "#ff5722",
      TempC: "#ff9800",
      DO: "#4caf50",
      Salinity: "#03a9f4",
      pH: "#8bc34a",
      Ammonia: "#9c27b0",
      Turbidity: "#0A5EB0",
      NO2: "#673ab7",
    };
    return colorMap[type] || theme.palette.grey[500];
  };

  // ✅ FIX: Dynamic X-axis formatter based on time range
  const getTimeRangeFormatter = (timeRange) => {
    const range = parseInt(timeRange);

    if (range <= 24) {
      // For 24h or less: show time (hours:minutes)
      return (time) => {
        if (!time) return "";
        try {
          const date = new Date(time);
          return format(date, "HH:mm");
        } catch (error) {
          console.warn("Invalid date format:", time);
          return "";
        }
      };
    } else if (range <= 168) {
      // For 7 days (168h): show day of week
      return (time) => {
        if (!time) return "";
        try {
          const date = new Date(time);
          return format(date, "EEE"); // Mon, Tue, Wed
        } catch (error) {
          console.warn("Invalid date format:", time);
          return "";
        }
      };
    } else {
      // For 30 days or longer: show month and date
      return (time) => {
        if (!time) return "";
        try {
          const date = new Date(time);
          return format(date, "MMM d");
        } catch (error) {
          console.warn("Invalid date format:", time);
          return "";
        }
      };
    }
  };

  // ✅ FIX: Enhanced tooltip formatter for different time ranges
  const getTooltipFormatter = (timeRange) => {
    const range = parseInt(timeRange);

    if (range <= 24) {
      // For 24h: show full date and time
      return (time) => {
        if (!time) return "";
        try {
          const date = new Date(time);
          return format(date, "MMM d, HH:mm");
        } catch (error) {
          console.warn("Invalid date format:", time);
          return "";
        }
      };
    } else if (range <= 168) {
      // For 7d: show day and date
      return (time) => {
        if (!time) return "";
        try {
          const date = new Date(time);
          return format(date, "EEE, MMM d");
        } catch (error) {
          console.warn("Invalid date format:", time);
          return "";
        }
      };
    } else {
      // For 30d+: show full date
      return (time) => {
        if (!time) return "";
        try {
          const date = new Date(time);
          return format(date, "MMM d, yyyy");
        } catch (error) {
          console.warn("Invalid date format:", time);
          return "";
        }
      };
    }
  };

  // Get the formatters for current time range
  const tickFormatter = getTimeRangeFormatter(timeRange);
  const tooltipLabelFormatter = getTooltipFormatter(timeRange);

  // Function to check if data spans multiple days
  const doesDataSpanMultipleDays = (chartData) => {
    if (!Array.isArray(chartData) || chartData.length === 0) return false;

    // Collect all dates from all sensors
    const allDates = [];

    chartData.forEach((sensor) => {
      if (Array.isArray(sensor.data)) {
        sensor.data.forEach((point) => {
          if (point.time) {
            // Extract just the date part (without time)
            const date = new Date(point.time);
            if (isValid(date)) {
              allDates.push(format(date, "yyyy-MM-dd"));
            }
          }
        });
      }
    });

    // If we have unique dates more than 1, data spans multiple days
    const uniqueDates = [...new Set(allDates)];
    return uniqueDates.length > 1;
  };

  // Process and validate chart data
  const validChartData = Array.isArray(chartData) ? chartData : [];

  // FIXED: Explicitly filter the chart data based on visibleSensors array
  // Only include a sensor if it exists in visibleSensors array
  const filteredChartData = validChartData.filter(
    (sensorData) => visibleSensors && visibleSensors.includes(sensorData.type)
  );

  // If no charts are selected but there is chart data available, show a message
  const showNoChartsMessage =
    filteredChartData.length === 0 && validChartData.length > 0;

  return (
    <Box sx={{ width: "100%" }}>
      {showNoChartsMessage ? (
        <Card
          sx={{
            mb: 3,
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            width: "100%",
          }}
        >
          <CardContent sx={{ p: 2, width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: 200,
                bgcolor: "action.hover",
                borderRadius: 1,
                width: "100%",
              }}
            >
              <Typography color="text.secondary" gutterBottom>
                No sensor charts selected
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Toggle sensors in the Active Sensors panel to display their
                charts
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : filteredChartData.length > 0 ? (
        filteredChartData.map((sensorTypeData) => (
          <Card
            key={sensorTypeData.type}
            sx={{
              mb: 3,
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              width: "100%",
              overflow: "hidden",
            }}
          >
            <CardContent sx={{ p: 2, width: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  {sensorTypeData.type
                    ? sensorTypeData.type.toUpperCase()
                    : "UNKNOWN"}{" "}
                  Chart
                  {/* ✅ NEW: Show time range info */}
                  <Typography
                    component="span"
                    variant="caption"
                    sx={{
                      ml: 1,
                      color: "text.secondary",
                      fontWeight: 400,
                    }}
                  >
                    (
                    {parseInt(timeRange) <= 24
                      ? `${timeRange}h`
                      : parseInt(timeRange) <= 168
                      ? `${Math.round(parseInt(timeRange) / 24)}d`
                      : `${Math.round(parseInt(timeRange) / 24)}d`}
                    )
                  </Typography>
                </Typography>
                <IconButton size="small">
                  <MoreHorizIcon />
                </IconButton>
              </Box>
              {sensorTypeData.data &&
              Array.isArray(sensorTypeData.data) &&
              sensorTypeData.data.length > 0 ? (
                <Box sx={{ width: "100%", height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={sensorTypeData.data}
                      margin={{ top: 10, right: 10, left: 0, bottom: 40 }}
                    >
                      <defs>
                        <linearGradient
                          id={`gradient-${sensorTypeData.type}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={getSensorTypeColor(sensorTypeData.type)}
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor={getSensorTypeColor(sensorTypeData.type)}
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#f0f0f0"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="time"
                        tickFormatter={tickFormatter} // ✅ FIX: Use dynamic formatter
                        stroke="#888"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 12,
                          fill: "#666",
                          fontFamily: "inherit",
                        }}
                        angle={-45}
                        textAnchor="end"
                        height={50}
                        interval="preserveStartEnd"
                        minTickGap={30}
                      />
                      <YAxis
                        stroke="#888"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 12,
                          fill: "#666",
                          fontFamily: "inherit",
                        }}
                      />
                      <Tooltip
                        formatter={(value) => [
                          typeof value === "number" ? value.toFixed(2) : "N/A",
                          sensorTypeData.type,
                        ]}
                        labelFormatter={tooltipLabelFormatter} // ✅ FIX: Use dynamic tooltip formatter
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          border: "1px solid #ddd",
                          borderRadius: 4,
                          fontSize: 12,
                          fontFamily: "inherit",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={getSensorTypeColor(sensorTypeData.type)}
                        fill={`url(#gradient-${sensorTypeData.type})`}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 200,
                    bgcolor: "action.hover",
                    borderRadius: 1,
                    width: "100%",
                  }}
                >
                  <Typography color="text.secondary">
                    No data available for this time range
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <Card
          sx={{
            mb: 3,
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            width: "100%",
          }}
        >
          <CardContent sx={{ p: 2, width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: 200,
                bgcolor: "action.hover",
                borderRadius: 1,
                width: "100%",
              }}
            >
              <Typography color="text.secondary" gutterBottom>
                No chart data available
              </Typography>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={onRefresh}
                size="small"
                sx={{ mt: 1 }}
              >
                Refresh Data
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default SensorChartsSection;
