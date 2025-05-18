import { useState, useEffect } from "react";
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  IconButton, 
  Typography, 
  useTheme 
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

const SensorChartsSection = ({ chartData, onRefresh, isLoading, visibleSensors }) => {
  const theme = useTheme();

  // Helper to get color for each sensor type
  const getSensorTypeColor = (type) => {
    const colorMap = {
      pH: "#ff9800", 
      DO: "#ff9800", 
      Temperature: "#f44336", 
      TempA: "#f44336", 
      TempB: "#ef5350", 
      TempC: "#f44336",
      SALT: "#2196f3",
      Saltlinity: "#2196f3", 
      NHx: "#9c27b0", 
      NH3: "#9c27b0",
      EC: "#00bcd4", 
      TDS: "#8bc34a", 
      ORP: "#3f51b5",
      NO2: "#673ab7",
      NO: "#673ab7",
    };
    return colorMap[type] || theme.palette.grey[500];
  };

  // Function to check if data spans multiple days
  const doesDataSpanMultipleDays = (chartData) => {
    if (!Array.isArray(chartData) || chartData.length === 0) return false;
    
    // Collect all dates from all sensors
    const allDates = [];
    
    chartData.forEach(sensor => {
      if (Array.isArray(sensor.data)) {
        sensor.data.forEach(point => {
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

  // Format chart date labels
  const formatChartDate = (time) => {
    if (!time) return "";
    try {
      const date = new Date(time);
      return format(date, "MMM d");
    } catch (error) {
      console.warn("Invalid date format:", time);
      return "";
    }
  };

  // Format tooltip date
  const formatTooltipDate = (time) => {
    if (!time) return "";
    try {
      const date = new Date(time);
      return format(date, "MMM d, yyyy HH:mm");
    } catch (error) {
      console.warn("Invalid date format:", time);
      return "";
    }
  };

  // Process and validate chart data
  const validChartData = Array.isArray(chartData) ? chartData : [];
  
  // Filter chart data based on visible sensors
  const filteredChartData = visibleSensors && visibleSensors.length > 0 
    ? validChartData.filter(sensorData => visibleSensors.includes(sensorData.type))
    : validChartData;

  // If no charts are selected, show a message
  const showNoChartsMessage = filteredChartData.length === 0 && validChartData.length > 0;

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
                Toggle sensors in the Active Sensors panel to display their charts
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
                  {sensorTypeData.type ? sensorTypeData.type.toUpperCase() : "UNKNOWN"} Chart
                </Typography>
                <IconButton size="small">
                  <MoreHorizIcon />
                </IconButton>
              </Box>
              {sensorTypeData.data && Array.isArray(sensorTypeData.data) && sensorTypeData.data.length > 0 ? (
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
                            stopColor={getSensorTypeColor(
                              sensorTypeData.type
                            )}
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor={getSensorTypeColor(
                              sensorTypeData.type
                            )}
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
                        tickFormatter={formatChartDate}
                        stroke="#888"
                        axisLine={false}
                        tickLine={false}
                        tick={{ 
                          fontSize: 12,
                          fill: '#666',
                          fontFamily: 'inherit'
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
                          fill: '#666',
                          fontFamily: 'inherit'
                        }}
                      />
                      <Tooltip
                        formatter={(value) => [
                          typeof value === 'number' ? value.toFixed(2) : 'N/A',
                          sensorTypeData.type,
                        ]}
                        labelFormatter={formatTooltipDate}
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          border: "1px solid #ddd",
                          borderRadius: 4,
                          fontSize: 12,
                          fontFamily: 'inherit'
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