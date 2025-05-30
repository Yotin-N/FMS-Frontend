/* eslint-disable no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  LinearProgress,
  Alert,
  useTheme,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  ListItemButton,
  Container,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import DevicesIcon from "@mui/icons-material/Devices";
import SensorsIcon from "@mui/icons-material/Sensors";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
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
import SettingsPage from "../settings/SettingsPage";

// Dashboard components
import DashboardControls from "../../components/dashboard/DashboardControls";
import LatestTimestampCard from "../../components/dashboard/LatestTimestampCard";
import AverageValueCardsGrid from "../../components/dashboard/AverageValueCardsGrid";
import ActiveSensorsCard from "../../components/dashboard/ActiveSensorsCard";
import SensorChartsSection from "../../components/dashboard/SensorChartsSection";

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
  // State for controlling gauge display (new addition)
  const [showAllGauges, setShowAllGauges] = useState(false);
  const [visibleSensors, setVisibleSensors] = useState([]);

  // Make sure we have fallback data if real data is empty
  useEffect(() => {
    if (selectedFarmId && chartData.length === 0 && !isLoading) {
      const defaultChartTypes = ["DO", "pH", "SALT", "TDS"];
      const defaultChartData = defaultChartTypes.map((type) => ({
        type,
        data: [],
      }));
      setChartData(defaultChartData);
    }
  }, [selectedFarmId, chartData, isLoading]);

  useEffect(() => {
    loadFarms();
  }, []);

  useEffect(() => {
    console.log("DashboardContent - visibleSensors:", visibleSensors);
  }, [visibleSensors]);

  useEffect(() => {
    console.log("DashboardContent - dashboardData:", dashboardData);

    if (dashboardData && dashboardData.averages) {
      const sensorTypes = Object.keys(dashboardData.averages);
      console.log(
        "DashboardContent - Setting visibleSensors from dashboardData:",
        sensorTypes
      );
      setVisibleSensors(sensorTypes);
    } else if (chartData && chartData.length > 0) {
      const chartTypes = chartData.map((chart) => chart.type);
      console.log(
        "DashboardContent - Setting visibleSensors from chartData:",
        chartTypes
      );
      setVisibleSensors(chartTypes);
    }
  }, [dashboardData, chartData]);

  useEffect(() => {
    if (selectedFarmId) {
      loadDashboardData();
      loadChartData();
    } else {
      setDashboardData(null);
      setChartData([]);
    }
  }, [selectedFarmId, timeRange]);

  useEffect(() => {
    console.log("DashboardContent - dashboardData:", dashboardData);
    console.log("DashboardContent - visibleSensors:", visibleSensors);

    if (dashboardData && dashboardData.averages) {
      Object.entries(dashboardData.averages).forEach(([type, data]) => {
        console.log(`Sensor ${type} data:`, {
          latestValue: data.latestValue,
          gaugeMin: data.gaugeMin,
          gaugeMax: data.gaugeMax,
          severityColor: data.severityColor,
          thresholdRanges: data.thresholdRanges,
          unit: data.unit,
        });
      });
    }
  }, [dashboardData, visibleSensors]);

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

  const handleToggleSensor = (sensorType) => {
    setVisibleSensors((prev) => {
      if (prev.includes(sensorType)) {
        return prev.filter((type) => type !== sensorType);
      } else {
        return [...prev, sensorType];
      }
    });
  };

  // New function to handle show all gauges toggle
  const handleToggleShowAllGauges = () => {
    setShowAllGauges((prev) => !prev);
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

  const handleSensorConfigClick = (sensorType) => {
    console.log(`Config clicked for sensor: ${sensorType}`);
    navigate(
      `/dashboard/settings?farmId=${selectedFarmId}&sensorType=${sensorType}`
    );
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

  const handleRefresh = () => {
    loadDashboardData();
    loadChartData();
  };

  return (
    <Box sx={{ width: "100%" }}>
      {isLoading && <LinearProgress sx={{ mb: 3 }} />}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {farms.length > 0 && (
        <DashboardControls
          farms={farms}
          selectedFarmId={selectedFarmId}
          timeRange={timeRange}
          onFarmChange={handleFarmChange}
          onTimeRangeChange={handleTimeRangeChange}
        />
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
        <Box sx={{ width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
              // KEEP ORIGINAL: Fixed height for dashboard
              height: { md: "calc(100vh - 180px)" },
            }}
          >
            {/* Left sidebar with cards - UPDATED: Removed NotificationsCard */}
            <Box
              sx={{
                width: { xs: "100%", md: "25%" },
                minWidth: { md: "250px" },
                maxWidth: { md: "350px" },
                order: { xs: 2, md: 1 },
                display: "flex",
                flexDirection: "column",
                height: { md: "100%" },
              }}
            >
              {/* Date Time Card */}
              <LatestTimestampCard
                timestamp={dashboardData?.latestTimestamp}
                onRefresh={handleRefresh}
                isLoading={isLoading}
              />

              {/* Active Sensors Card - Make it fill remaining space */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                <ActiveSensorsCard
                  averages={dashboardData?.averages}
                  visibleSensors={visibleSensors}
                  onToggleSensor={handleToggleSensor}
                  showAllGauges={showAllGauges}
                  onToggleShowAllGauges={handleToggleShowAllGauges}
                />
              </Box>
            </Box>

            {/* Container for sensor values and charts */}
            <Box
              sx={{
                flex: 1,
                width: { xs: "100%", md: "75%" },
                order: { xs: 1, md: 2 },
                display: "flex",
                flexDirection: "column",
                height: { md: "100%" },
                overflow: "hidden", // Prevent overflow
              }}
            >
              {/* Sensor Values Cards */}
              <AverageValueCardsGrid
                sensorData={dashboardData?.averages}
                visibleSensors={visibleSensors}
                showAllGauges={showAllGauges}
                onSensorConfigClick={handleSensorConfigClick}
              />

              {/* Charts Section - Make it fill remaining space */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex", // Add this
                  flexDirection: "column", // Add this
                  minHeight: 0, // Critical for flex child to respect parent boundaries
                  overflowY: "auto",
                  overflowX: "hidden",
                  // Custom scrollbar styling
                  scrollbarWidth: "thin",
                  scrollbarColor: `${theme.palette.grey[400]} ${theme.palette.grey[100]}`,
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: theme.palette.grey[100],
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: theme.palette.grey[400],
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: theme.palette.grey[500],
                  },
                  // Smooth scrolling
                  scrollBehavior: "smooth",
                  // Add padding for better visual spacing
                  pr: 1,
                }}
              >
                <SensorChartsSection
                  chartData={chartData}
                  onRefresh={handleRefresh}
                  isLoading={isLoading}
                  visibleSensors={visibleSensors}
                  timeRange={timeRange}
                  sx={{ flex: 1 }} // Make it fill the container
                />
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

// Rest of the DashboardPage component remains the same...
const DashboardPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [open, setOpen] = useState(!isMobile);

  // NEW: Determine if we're on the main dashboard or other pages
  const isDashboardHome =
    location.pathname === "/dashboard" ||
    location.pathname === "/dashboard/" ||
    location.pathname.startsWith("/dashboard?");

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
    if (pathname.includes("/dashboard/farms")) {
      setSelectedIndex(1);
    } else if (pathname.includes("/dashboard/devices")) {
      setSelectedIndex(2);
    } else if (pathname.includes("/dashboard/sensors")) {
      setSelectedIndex(3);
    } else if (pathname.includes("/dashboard/settings")) {
      setSelectedIndex(4);
    } else if (pathname.includes("/dashboard/users")) {
      setSelectedIndex(5);
    } else if (
      pathname === "/dashboard" ||
      pathname === "/dashboard/" ||
      pathname.startsWith("/dashboard?")
    ) {
      setSelectedIndex(0);
    }
  }, [location.pathname]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "",
      roles: ["ADMIN", "USER"],
    },
    {
      text: "Farm Management",
      icon: <AgricultureIcon />,
      path: "/farms",
      roles: ["ADMIN", "USER"],
    },
    {
      text: "Device Management",
      icon: <DevicesIcon />,
      path: "/devices",
      roles: ["ADMIN", "USER"],
    },
    {
      text: "Sensor",
      icon: <SensorsIcon />,
      path: "/sensors",
      roles: ["ADMIN", "USER"],
    },
    {
      text: "Settings",
      icon: <SettingsIcon />,
      path: "/settings",
      roles: ["ADMIN"],
    },
    {
      text: "User Management",
      icon: <PeopleIcon />,
      path: "/users",
      roles: ["ADMIN"],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role);
  });

  const handleListItemClick = (index, path) => {
    setSelectedIndex(index);
    if (path === "") {
      navigate("/dashboard");
    } else {
      navigate(`/dashboard${path}`);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar toggleDrawer={toggleDrawer} open={open} />

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
            overflowX: "hidden",
            ...(!open && {
              overflowX: "hidden",
              width: theme.spacing(7),
              [theme.breakpoints.up("sm")]: { width: theme.spacing(9) },
            }),
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto", overflowX: "hidden" }}>
          <List>
            {filteredMenuItems.map((item, index) => (
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

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          backgroundColor: theme.palette.grey[50],
          // CONDITIONAL STYLING: Different for dashboard vs other pages
          ...(isDashboardHome
            ? {
                // Dashboard: Fixed height, no scroll
                minHeight: "100vh",
                height: "100vh",
                width: "100%",
                maxWidth: "100%",
                overflowX: "hidden",
                display: "flex",
                flexDirection: "column",
                overflowY: "hidden", // Dashboard doesn't scroll at main level
              }
            : {
                // Other pages: Allow scrolling
                minHeight: "100vh",
                width: "100%",
                maxWidth: "100%",
                overflowX: "hidden",
                display: "flex",
                flexDirection: "column",
                overflowY: "auto", // Other pages can scroll
              }),
        }}
      >
        <Toolbar />
        <Container
          maxWidth="xl"
          disableGutters
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            // CONDITIONAL STYLING: Different overflow for dashboard vs other pages
            ...(isDashboardHome
              ? {
                  overflow: "hidden", // Dashboard: contained
                }
              : {
                  overflow: "visible", // Other pages: scrollable
                }),
          }}
        >
          <Routes>
            <Route path="" element={<DashboardContent />} />
            <Route path="farms/*" element={<FarmListPage />} />
            <Route path="devices/*" element={<DeviceListPage />} />
            <Route path="sensors" element={<SensorListPage />} />
            <Route
              path="sensors/:id/readings"
              element={<SensorReadingsPage />}
            />

            {isAuthenticated && user?.role === "ADMIN" && (
              <>
                <Route path="settings/*" element={<SettingsPage />} />
                <Route path="users/*" element={<UserListPage />} />
                <Route path="users/create" element={<CreateUserPage />} />
                <Route path="users/edit/:id" element={<EditUserPage />} />
              </>
            )}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardPage;
