/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Alert,
  IconButton,
  Button,
  useTheme,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import DevicesIcon from "@mui/icons-material/Devices";
import SensorsIcon from "@mui/icons-material/Sensors";
import PeopleIcon from "@mui/icons-material/People";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import RefreshIcon from "@mui/icons-material/Refresh";
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

  const queryParams = new URLSearchParams(location.search);
  const initialFarmId = queryParams.get("farmId");

  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState(initialFarmId || "");
  const [dashboardData, setDashboardData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("24");
  const [notifications] = useState([
    { id: 1, message: "Warning pH: value exceeds limit", type: "warning" },
    { id: 2, message: "Warning DO: low oxygen levels", type: "warning" },
  ]);
  const [suggestions] = useState([
    { id: 1, message: "Adjust pH levels to improve water quality" },
    { id: 2, message: "Increase aeration to boost DO levels" },
  ]);

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
      pH: theme.palette.info.main,
      DO: theme.palette.success.main,
      Temperature: theme.palette.error.main,
      TempA: theme.palette.error.main,
      TempB: theme.palette.error.main,
      TempC: theme.palette.error.main,
      Saltlinity: theme.palette.primary.main,
      NHx: theme.palette.warning.main,
      EC: theme.palette.secondary.main,
      TDS: theme.palette.success.light,
      ORP: theme.palette.info.light,
    };
    return colorMap[type] || theme.palette.grey[500];
  };

  const formatChartDate = (time) => {
    if (!time) return "";
    const date = new Date(time);
    return format(date, "HH:mm");
  };

  return (
    <Box sx={{ maxWidth: "lg", mx: "auto" }}>
      {/* Top Bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="farm-select-label">Farm</InputLabel>
            <Select
              labelId="farm-select-label"
              value={selectedFarmId}
              onChange={handleFarmChange}
              label="Farm"
              size="small"
            >
              {farms.length === 0 ? (
                <MenuItem disabled value="">
                  No farms available
                </MenuItem>
              ) : (
                farms.map((farm) => (
                  <MenuItem key={farm.id} value={farm.id}>
                    {farm.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
          <Typography variant="body2" color="text.secondary">
            Day: {formatDateTime(dashboardData?.latestTimestamp)} Last Update:{" "}
            {formatTime(dashboardData?.latestTimestamp)}
          </Typography>
        </Box>
        <IconButton
          color="primary"
          onClick={handleRefresh}
          disabled={isLoading || !selectedFarmId}
        >
          <RefreshIcon />
        </IconButton>
      </Box>

      {/* Loading State */}
      {isLoading && <LinearProgress sx={{ mb: 3 }} />}

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* No Farm Selected State */}
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

      {/* Dashboard Content */}
      {selectedFarmId && dashboardData && (
        <>
          {/* Sensor Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {dashboardData.averages &&
              Object.entries(dashboardData.averages).map(([type, data]) => {
                const value = data.average ? data.average.toFixed(1) : "N/A";
                const unit = data.unit || "";

                return (
                  <Grid item xs={6} sm={4} md={2} key={type}>
                    <Card
                      sx={{
                        bgcolor: getSensorTypeColor(type),
                        color: "white",
                        borderRadius: 2,
                        p: 1,
                        textAlign: "center",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      <CardContent sx={{ p: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {type}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {value} {unit}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
          </Grid>

          {/* Sensor Charts */}
          <Box sx={{ maxHeight: "600px", overflowY: "auto", pr: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
              {["24", "168", "720"].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "contained" : "outlined"}
                  onClick={() => handleTimeRangeChange(range)}
                  size="small"
                  sx={{ borderRadius: 2, mx: 1 }}
                >
                  {range === "24" ? "Day" : range === "168" ? "Week" : "Month"}
                </Button>
              ))}
            </Box>
            {chartData.map((sensorTypeData) => (
              <Paper
                key={sensorTypeData.type}
                sx={{
                  p: 2,
                  mb: 3,
                  borderRadius: 2,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  {sensorTypeData.type.toUpperCase()} Chart
                </Typography>
                {sensorTypeData.data.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={sensorTypeData.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="time"
                        tickFormatter={formatChartDate}
                        stroke="#888"
                      />
                      <YAxis stroke="#888" />
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
                        fill={getSensorTypeColor(sensorTypeData.type)}
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 200,
                    }}
                  >
                    <Typography color="text.secondary">
                      No data available for this time range
                    </Typography>
                  </Box>
                )}
              </Paper>
            ))}
            {chartData.length === 0 && (
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 2,
                  textAlign: "center",
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  No sensor data available for charts.
                </Typography>
              </Paper>
            )}
          </Box>
        </>
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
  const [open, setOpen] = useState(true);

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

  const notifications = [
    { id: 1, message: "Warning pH: value exceeds limit", type: "warning" },
    { id: 2, message: "Warning DO: low oxygen levels", type: "warning" },
  ];

  const suggestions = [
    { id: 1, message: "Adjust pH levels to improve water quality" },
    { id: 2, message: "Increase aeration to boost DO levels" },
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
        variant="permanent"
        open={open}
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
        <Box sx={{ overflow: "false" }}>
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
          p: 3,
          pt: 0,
          backgroundColor: theme.palette.grey[50],
          minHeight: "100vh",
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
