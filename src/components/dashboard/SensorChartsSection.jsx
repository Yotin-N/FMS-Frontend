// src/components/dashboard/SensorChartsSection.jsx
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
import { format } from "date-fns";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SensorChartsSection = ({ chartData, onRefresh, isLoading }) => {
  const theme = useTheme();

  // Helper to get color for each sensor type
  const getSensorTypeColor = (type) => {
    const colorMap = {
      pH: "#4caf50",
      DO: "#ff9800",
      Temperature: "#f44336",
      TempA: "#f44336",
      TempB: "#f44336",
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

  // Format chart date labels
  const formatChartDate = (time) => {
    if (!time) return "";
    const date = new Date(time);
    return format(date, "HH:mm");
  };

  // Process and validate chart data
  const validChartData = Array.isArray(chartData) ? chartData : [];

  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: 0,
        width: "100%",
        // Expand to full width
        maxWidth: "100%",
        ml: { xs: -2, sm: -2, md: -2 },
        mr: { xs: -2, sm: -2, md: -2 },
        px: { xs: 2, sm: 2, md: 2 },
        boxSizing: "border-box",
      }}
    >
      {validChartData.length > 0 ? (
        validChartData.map((sensorTypeData) => (
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
                <Typography variant="h6">
                  {sensorTypeData.type ? sensorTypeData.type.toUpperCase() : "UNKNOWN"} Chart
                </Typography>
                <IconButton size="small">
                  <MoreHorizIcon />
                </IconButton>
              </Box>
              {sensorTypeData.data && Array.isArray(sensorTypeData.data) && sensorTypeData.data.length > 0 ? (
                <Box sx={{ width: "100%", height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sensorTypeData.data}>
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
                      />
                      <YAxis
                        stroke="#888"
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        formatter={(value) => [
                          typeof value === 'number' ? value.toFixed(2) : 'N/A',
                          sensorTypeData.type,
                        ]}
                        labelFormatter={formatChartDate}
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          border: "1px solid #ddd",
                          borderRadius: 4,
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