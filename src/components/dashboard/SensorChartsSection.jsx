/* eslint-disable no-unused-vars */
"use client";
import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  useTheme,
  Tabs,
  Tab,
  Chip,
  Divider,
} from "@mui/material";
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

const SensorChartsSection = ({
  chartData,
  onRefresh,
  visibleSensors,
  timeRange = "24",
  enhanced = false, // New prop for enhanced layout
}) => {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = React.useState(0);
  // Remove grid view - only use single view mode

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

  // Dynamic X-axis formatter based on time range
  const getTimeRangeFormatter = (timeRange) => {
    const range = Number.parseInt(timeRange);

    if (range <= 1) {
      // For 1h: show minutes (HH:mm)
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
    } else if (range <= 24) {
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

  // Enhanced tooltip formatter for different time ranges
  const getTooltipFormatter = (timeRange) => {
    const range = Number.parseInt(timeRange);

    if (range <= 1) {
      // For 1h: show precise time with seconds
      return (time) => {
        if (!time) return "";
        try {
          const date = new Date(time);
          return format(date, "HH:mm:ss");
        } catch (error) {
          console.warn("Invalid date format:", time);
          return "";
        }
      };
    } else if (range <= 24) {
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

  // Process and validate chart data
  const validChartData = Array.isArray(chartData) ? chartData : [];

  // Filter the chart data based on visibleSensors array
  const filteredChartData = validChartData.filter(
    (sensorData) => visibleSensors && visibleSensors.includes(sensorData.type)
  );

  // If no charts are selected but there is chart data available, show a message
  const showNoChartsMessage =
    filteredChartData.length === 0 && validChartData.length > 0;

  const handleTabChange = (_, newValue) => {
    setSelectedTab(newValue);
  };

  // Removed toggleViewMode function

  // Enhanced layout with tabs and better organization
  if (enhanced) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header with controls */}
        <Box
          sx={{
            p: 3,
            pb: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            bgcolor: "background.paper",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: theme.palette.primary.main }}
            >
              Sensor Data Analysis
            </Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Chip
                label={`${
                  timeRange <= 1
                    ? timeRange + "h"
                    : timeRange <= 24
                    ? timeRange + "h"
                    : Math.round(timeRange / 24) + "d"
                } range`}
                size="small"
                color="primary"
                variant="outlined"
              />
              {/* Removed view mode toggle */}
            </Box>
          </Box>

          {filteredChartData.length > 0 && (
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: theme.palette.primary.main,
                },
                "& .MuiTab-root": {
                  textTransform: "none",
                  minWidth: 80,
                  fontWeight: 500,
                },
              }}
            >
              {filteredChartData.map((sensor, index) => (
                <Tab
                  key={sensor.type}
                  label={sensor.type}
                  sx={{
                    fontWeight: selectedTab === index ? 600 : 500,
                    color: getSensorTypeColor(sensor.type),
                  }}
                />
              ))}
            </Tabs>
          )}
        </Box>

        {/* Content area */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            p: 3,
            bgcolor: theme.palette.grey[50],
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: theme.palette.grey[100],
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: theme.palette.grey[400],
              borderRadius: "3px",
            },
          }}
        >
          {showNoChartsMessage ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                textAlign: "center",
              }}
            >
              <Typography color="text.secondary" variant="h6" gutterBottom>
                No sensor charts selected
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Toggle sensors in the Active Sensors panel to display their
                charts
              </Typography>
            </Box>
          ) : filteredChartData.length > 0 ? (
            // Single chart view only
            filteredChartData[selectedTab] && (
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                }}
              >
                <CardContent
                  sx={{
                    p: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        color: getSensorTypeColor(
                          filteredChartData[selectedTab]?.type
                        ),
                      }}
                    >
                      {filteredChartData[selectedTab]?.type?.toUpperCase()}{" "}
                      Analysis
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <Chip
                        label={`${
                          filteredChartData[selectedTab]?.data?.length || 0
                        } data points`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  {filteredChartData[selectedTab]?.data &&
                  filteredChartData[selectedTab]?.data.length > 0 ? (
                    <Box sx={{ flex: 1, width: "100%", minHeight: "100%" }}>
                      {(() => {
                        const currentChartData =
                          filteredChartData[selectedTab].data;
                        let yAxisTicks;

                        if (currentChartData.length === 1) {
                          yAxisTicks = [currentChartData[0].value];
                        }

                        return (
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={currentChartData}
                              margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 60,
                              }}
                            >
                              <defs>
                                <linearGradient
                                  id={`gradient-large-${filteredChartData[selectedTab].type}`}
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="5%"
                                    stopColor={getSensorTypeColor(
                                      filteredChartData[selectedTab].type
                                    )}
                                    stopOpacity={0.8}
                                  />
                                  <stop
                                    offset="95%"
                                    stopColor={getSensorTypeColor(
                                      filteredChartData[selectedTab].type
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
                                tickFormatter={tickFormatter}
                                stroke="#888"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12 }}
                                angle={-45}
                                textAnchor="end"
                                height={60}
                                interval="preserveStartEnd"
                              />
                              <YAxis
                                stroke="#888"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12 }}
                                width={60}
                                domain={[
                                  (dataMin) =>
                                    dataMin - (Math.abs(dataMin) * 0.1 || 1),
                                  (dataMax) =>
                                    dataMax + (Math.abs(dataMax) * 0.1 || 1),
                                ]}
                                tickFormatter={(value) => value.toFixed(2)}
                                ticks={yAxisTicks}
                              />

                              <Tooltip
                                formatter={(value) => [
                                  typeof value === "number"
                                    ? value.toFixed(2)
                                    : "N/A",
                                  filteredChartData[selectedTab].type,
                                ]}
                                labelFormatter={tooltipLabelFormatter}
                                contentStyle={{
                                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                                  border: `1px solid ${getSensorTypeColor(
                                    filteredChartData[selectedTab].type
                                  )}`,
                                  borderRadius: 4,
                                  fontSize: 12,
                                }}
                              />
                              <Area
                                type="monotone"
                                dataKey="value"
                                stroke={getSensorTypeColor(
                                  filteredChartData[selectedTab].type
                                )}
                                fill={`url(#gradient-large-${filteredChartData[selectedTab].type})`}
                                strokeWidth={3}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        );
                      })()}
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "action.hover",
                        borderRadius: 1,
                      }}
                    >
                      <Typography color="text.secondary" variant="h6">
                        No data available for this time range
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            )
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                textAlign: "center",
              }}
            >
              <Typography color="text.secondary" variant="h6" gutterBottom>
                No chart data available
              </Typography>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={onRefresh}
                sx={{ mt: 2, textTransform: "none" }}
              >
                Refresh Data
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    );
  }

  // Original layout for backward compatibility
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
                    {Number.parseInt(timeRange) <= 1
                      ? `${timeRange}h`
                      : Number.parseInt(timeRange) <= 24
                      ? `${timeRange}h`
                      : Number.parseInt(timeRange) <= 168
                      ? `${Math.round(Number.parseInt(timeRange) / 24)}d`
                      : `${Math.round(Number.parseInt(timeRange) / 24)}d`}
                    )
                  </Typography>
                </Typography>
              </Box>
              {sensorTypeData.data &&
              Array.isArray(sensorTypeData.data) &&
              sensorTypeData.data.length > 0 ? (
                <Box sx={{ width: "100%", height: 250 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={sensorTypeData.data}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
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
                        tickFormatter={tickFormatter}
                        stroke="#888"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 12,
                          fill: "#666",
                          fontFamily: "inherit",
                        }}
                        angle={0}
                        textAnchor="middle"
                        height={30}
                        interval="preserveStartEnd"
                        minTickGap={30}
                        dy={10}
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
                        labelFormatter={tooltipLabelFormatter}
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
