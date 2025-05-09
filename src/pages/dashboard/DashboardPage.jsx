"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  IconButton,
  Button,
  useTheme,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  ListItemButton,
  Avatar,
  Tabs,
  Tab,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import WarningIcon from "@mui/icons-material/Warning";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import DevicesIcon from "@mui/icons-material/Devices";
import SensorsIcon from "@mui/icons-material/Sensors";
import PeopleIcon from "@mui/icons-material/People";
import { format, parseISO } from "date-fns";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getFarms } from "../../services/api";
import {
  getDashboardSummary,
  getSensorChartData,
} from "../../services/dashboardApi";
import Navbar from "../../components/layout/Navbar";
import useAuth from "../../hooks/useAuth";
import { Navigate, Routes, Route } from "react-router-dom";
import FarmListPage from "../farm/FarmListPage";
import DeviceListPage from "../device/DeviceListPage";
import SensorListPage from "../sensor/SensorListPage";
import SensorReadingsPage from "../sensor/SensorReadingsPage";
import UserListPage from "../user/UserListPage";
import CreateUserPage from "../user/CreateUserPage";
import EditUserPage from "../user/EditUserPage";

const drawerWidth = 240;

const DashboardContent = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const queryParams = new URLSearchParams(location.search);
  const initialFarmId = queryParams.get("farmId");

  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState(initialFarmId || "");
  const [dashboardData, setDashboardData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("24");
  const [selectedTab, setSelectedTab] = useState(0);
  const [notifications] = useState([
    { id: 1, message: "Warning pH: value exceeds limit", type: "warning" },
    { id: 2, message: "Warning DO: low oxygen levels", type: "warning" },
    { id: 3, message: "Warning pH: value exceeds limit", type: "warning" },
  ]);
  const [suggestions] = useState([
    { id: 1, message: "Adjust pH levels to improve water quality" },
    { id: 2, message: "Increase aeration to boost DO levels" },
    { id: 3, message: "Warning pH: value exceeds limit" },
  ]);

  // Make sure we have fallback data if real data is empty
  useEffect(() => {
    if (selectedFarmId && chartData.length === 0 && !isLoading) {
      // Create default empty chart data to maintain layout
      const defaultChartTypes = ["DO", "pH", "SALT", "TDS"];
      const defaultChartData = defaultChartTypes.map((type) => ({
        type,
        data: [], // Empty data
      }));
      setChartData(defaultChartData);
    }
  }, [selectedFarmId, chartData, isLoading]);

  useEffect(() => {
    loadFarms();
  }, []);

  useEffect(() => {
    if (selectedFarmId) {
      loadDashboardData();
      loadChartData();
    } else {
      setDashboardData(null);
      setChartData([]);
    }
  }, [selectedFarmId, timeRange]);

  const loadFarms = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getFarms();
      const farmsData = response.data || [];
      setFarms(farmsData);
      if (
        initialFarmId &&
        farmsData.some((farm) => farm.id === initialFarmId)
      ) {
        setSelectedFarmId(initialFarmId);
      } else if (farmsData.length > 0 && !initialFarmId) {
        setSelectedFarmId(farmsData[0].id);
        navigate(`/dashboard?farmId=${farmsData[0].id}`, { replace: true });
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error loading farms:", err);
      setError("Failed to load farms. Please try again.");
      setIsLoading(false);
    }
  };

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDashboardSummary(selectedFarmId);
      setDashboardData(data);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadChartData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getSensorChartData(selectedFarmId, timeRange);
      setChartData(data);
    } catch (err) {
      console.error("Error loading chart data:", err);
      setError("Failed to load chart data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFarmChange = (event) => {
    const farmId = event.target.value;
    setSelectedFarmId(farmId);
    if (farmId) {
      navigate(`/dashboard?farmId=${farmId}`, { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    try {
      return format(parseISO(dateString), "d MMM yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "-";
    try {
      return format(parseISO(dateString), "h:mm a");
    } catch (error) {
      console.error("Error formatting time:", error);
      return dateString;
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
    loadChartData();
  };

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

  const formatChartDate = (time) => {
    if (!time) return "";
    const date = new Date(time);
    return format(date, "HH:mm");
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Mock data for temperature cards
  const temperatureData = {
    surface: { value: "22", unit: "C°" },
    base: { value: "15", unit: "C°" },
  };

  // Get the parameter names for tabs
  const parameterNames = dashboardData?.averages
    ? Object.keys(dashboardData.averages)
    : ["pH", "DO", "SALT", "TDS", "EC", "NH3", "NO2"];

  // Time range buttons
  const timeRangeButtons = [
    { label: "24h", value: "24" },
    { label: "7d", value: "168" },
    { label: "30d", value: "720" },
  ];

  return (
    <Box sx={{ width: "100%", px: { xs: 0, sm: 0 } }}>
      {isLoading && <LinearProgress sx={{ mb: 3 }} />}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Farm selection and time range controls */}
      {farms.length > 0 && (
        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ minWidth: 200 }}>
            <Typography variant="subtitle2" gutterBottom>
              Farm
            </Typography>
            <select
              value={selectedFarmId}
              onChange={handleFarmChange}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                backgroundColor: "white",
              }}
            >
              {farms.map((farm) => (
                <option key={farm.id} value={farm.id}>
                  {farm.name}
                </option>
              ))}
            </select>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Time Range
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              {timeRangeButtons.map((button) => (
                <Button
                  key={button.value}
                  variant={
                    timeRange === button.value ? "contained" : "outlined"
                  }
                  size="small"
                  onClick={() => handleTimeRangeChange(button.value)}
                  sx={{ minWidth: "60px" }}
                >
                  {button.label}
                </Button>
              ))}
            </Box>
          </Box>
        </Box>
      )}

      {!selectedFarmId && !isLoading && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
            bgcolor: "background.paper",
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h6"
            color="text.secondary"
            gutterBottom
            align="center"
          >
            Please select a farm to view dashboard
          </Typography>
        </Box>
      )}

      {selectedFarmId && (
        <Grid
          container
          spacing={3}
          sx={{ width: "100%", m: 0, minHeight: "calc(100vh - 100px)" }}
        >
          {/* Left Column - 30% */}
          <Grid item xs={12} md={4}>
            {/* Date Time Card */}
            <Card
              sx={{
                mb: 3,
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Last Update
                    </Typography>
                    <Typography variant="h6">
                      {formatDateTime(dashboardData?.latestTimestamp)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatTime(dashboardData?.latestTimestamp)}
                    </Typography>
                  </Box>
                  <IconButton
                    color="primary"
                    onClick={handleRefresh}
                    disabled={isLoading}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>

            {/* Exceeded Values Card */}
            <Card
              sx={{
                mb: 3,
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Exceeded Values
                </Typography>
                <List sx={{ p: 0 }}>
                  {dashboardData?.averages &&
                    Object.entries(dashboardData.averages)
                      .filter(([_, data]) => data.average > 70)
                      .map(([type, data]) => (
                        <ListItem key={type} sx={{ px: 0, py: 1 }}>
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <Avatar
                              sx={{
                                bgcolor: getSensorTypeColor(type),
                                width: 32,
                                height: 32,
                              }}
                            >
                              <WarningIcon sx={{ fontSize: 18 }} />
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={type}
                            secondary={`${data.average.toFixed(1)} ${
                              data.unit || ""
                            }`}
                            primaryTypographyProps={{ fontWeight: 500 }}
                          />
                        </ListItem>
                      ))}
                  {dashboardData?.averages &&
                    Object.entries(dashboardData.averages).filter(
                      ([_, data]) => data.average > 70
                    ).length === 0 && (
                      <Box sx={{ p: 2, textAlign: "center" }}>
                        <Typography variant="body2" color="text.secondary">
                          No exceeded values
                        </Typography>
                      </Box>
                    )}
                </List>
              </CardContent>
            </Card>

            {/* Active Sensors Card */}
            <Card
              sx={{
                mb: 3,
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Active Sensors
                </Typography>
                <List sx={{ p: 0 }}>
                  {dashboardData?.averages &&
                    Object.entries(dashboardData.averages).map(
                      ([type, data]) => (
                        <ListItem key={type} sx={{ px: 0, py: 1 }}>
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <Avatar
                              sx={{
                                bgcolor: getSensorTypeColor(type),
                                width: 32,
                                height: 32,
                              }}
                            >
                              <ThermostatIcon sx={{ fontSize: 18 }} />
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={type}
                            secondary={`${data.average.toFixed(1)} ${
                              data.unit || ""
                            }`}
                            primaryTypographyProps={{ fontWeight: 500 }}
                          />
                        </ListItem>
                      )
                    )}
                  {!dashboardData?.averages ||
                    (Object.keys(dashboardData.averages).length === 0 && (
                      <Box sx={{ p: 2, textAlign: "center" }}>
                        <Typography variant="body2" color="text.secondary">
                          No active sensors
                        </Typography>
                      </Box>
                    ))}
                </List>
              </CardContent>
            </Card>

            {/* Notifications Card */}
            <Card
              sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Notifications
                </Typography>
                <List sx={{ p: 0 }}>
                  {notifications.map((notification) => (
                    <ListItem key={notification.id} sx={{ px: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Avatar
                          sx={{ bgcolor: "error.main", width: 32, height: 32 }}
                        >
                          <WarningIcon sx={{ fontSize: 18 }} />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={notification.message}
                        secondary="2 hours ago"
                        primaryTypographyProps={{ fontWeight: 500 }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - 70% */}
          <Grid
            item
            xs={12}
            md={8}
            sx={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            {/* Sensor Values Cards */}
            <Card
              sx={{
                mb: 3,
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                width: "100%",
              }}
            >
              <CardContent>
                <Grid container spacing={2} sx={{ width: "100%" }}>
                  {dashboardData?.averages &&
                    Object.entries(dashboardData.averages).map(
                      ([type, data]) => (
                        <Grid item xs={6} sm={4} md={3} key={type}>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              bgcolor: getSensorTypeColor(type),
                              color: "white",
                              textAlign: "center",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {type}
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                              {data.average ? data.average.toFixed(1) : "N/A"}{" "}
                              {data.unit || ""}
                            </Typography>
                          </Box>
                        </Grid>
                      )
                    )}
                  {(!dashboardData?.averages ||
                    Object.keys(dashboardData.averages).length === 0) && (
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          p: 4,
                          textAlign: "center",
                          bgcolor: theme.palette.grey[100],
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="body1" color="text.secondary">
                          No sensor data available
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>

            {/* Charts Section */}
            <Box
              sx={{
                flexGrow: 1,
                minHeight: 0,
                overflowY: "auto",
                width: "100%",
                mr: 0,
                ml: 0,
                pl: 0,
                pr: 0,
              }}
            >
              {chartData.length > 0 ? (
                chartData.map((sensorTypeData) => (
                  <Card
                    key={sensorTypeData.type}
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
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Typography variant="h6">
                          {sensorTypeData.type.toUpperCase()} Chart
                        </Typography>
                        <IconButton size="small">
                          <MoreHorizIcon />
                        </IconButton>
                      </Box>
                      {sensorTypeData.data && sensorTypeData.data.length > 0 ? (
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
                                  value.toFixed(2),
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
                        onClick={handleRefresh}
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
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

const DashboardPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [open, setOpen] = useState(!isMobile);

  useEffect(() => {
    const handleResize = () => {
      setOpen(window.innerWidth > 900);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const pathname = location.pathname;
    if (pathname.includes("/dashboard/farms")) setSelectedIndex(1);
    else if (
      pathname.includes("/dashboard/devices") ||
      (pathname === "/dashboard" && location.search.includes("farmId="))
    )
      setSelectedIndex(2);
    else if (pathname.includes("/dashboard/sensors")) setSelectedIndex(3);
    else if (pathname.includes("/dashboard/users")) setSelectedIndex(4);
    else if (pathname === "/dashboard" || pathname === "/dashboard/")
      setSelectedIndex(0);
  }, [location]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "" },
    { text: "Farm Management", icon: <AgricultureIcon />, path: "/farms" },
    { text: "Device Management", icon: <DevicesIcon />, path: "/devices" },
    { text: "Sensor", icon: <SensorsIcon />, path: "/sensors" },
    { text: "User Management", icon: <PeopleIcon />, path: "/users" },
  ];

  const handleListItemClick = (index, path) => {
    setSelectedIndex(index);
    navigate(`/dashboard${path}`);
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Top Navbar */}
      <Navbar toggleDrawer={toggleDrawer} open={open} />

      {/* Sidebar */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={isMobile ? toggleDrawer : undefined}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: `1px solid ${theme.palette.divider}`,
            ...(!open && {
              overflowX: "hidden",
              width: theme.spacing(7),
              [theme.breakpoints.up("sm")]: { width: theme.spacing(9) },
            }),
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {menuItems.map((item, index) => (
              <ListItem
                key={item.text}
                disablePadding
                sx={{
                  display: "block",
                  backgroundColor:
                    selectedIndex === index
                      ? theme.palette.secondary.light
                      : "transparent",
                  color:
                    selectedIndex === index
                      ? theme.palette.primary.main
                      : "inherit",
                  borderRadius: 1,
                  mx: 1,
                  mb: 0.5,
                }}
              >
                <ListItemButton
                  selected={selectedIndex === index}
                  onClick={() => handleListItemClick(index, item.path)}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    borderRadius: 1,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color:
                        selectedIndex === index
                          ? theme.palette.primary.main
                          : "inherit",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      opacity: open ? 1 : 0,
                      "& .MuiTypography-root": {
                        fontWeight: selectedIndex === index ? 600 : 400,
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 0, sm: 1, md: 2 },
          pt: 0,
          backgroundColor: theme.palette.grey[50],
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <Toolbar />
        <Routes>
          <Route path="/" element={<DashboardContent />} />
          <Route path="/farms/*" element={<FarmListPage />} />
          <Route path="/devices/*" element={<DeviceListPage />} />
          <Route path="/sensors" element={<SensorListPage />} />
          <Route
            path="/sensors/:id/readings"
            element={<SensorReadingsPage />}
          />
          <Route
            path="/users/*"
            element={
              user && user.role === "ADMIN" ? (
                <UserListPage />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route path="/users/create" element={<CreateUserPage />} />
          <Route path="/users/edit/:id" element={<EditUserPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default DashboardPage;
