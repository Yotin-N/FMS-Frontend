/* eslint-disable no-unused-vars */
// src/pages/dashboard/DashboardPage.jsx
import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Container,
  useTheme,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Agriculture as AgricultureIcon,
  Devices as DevicesIcon,
  People as PeopleIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

import useAuth from "../../hooks/useAuth";
import Navbar from "../../components/layout/Navbar";
import FarmListPage from "../farm/FarmListPage";
import DeviceListPage from "../device/DeviceListPage";
import UserListPage from "../user/UserListPage";
import CreateUserPage from "../user/CreateUserPage";
import EditUserPage from "../user/EditUserPage";
const drawerWidth = 240;

const DashboardPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [open, setOpen] = useState(true);

  // Adjust drawer when window size changes
  useEffect(() => {
    const handleResize = () => {
      setOpen(window.innerWidth > 900);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial state

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleListItemClick = (index, path) => {
    setSelectedIndex(index);
    navigate(`/dashboard${path}`);
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "" },
    { text: "Farm Management", icon: <AgricultureIcon />, path: "/farms" },
    { text: "Device Management", icon: <DevicesIcon />, path: "/devices" },
    { text: "User Management", icon: <PeopleIcon />, path: "/users" },
  ];

  // Dashboard overview content
  const renderDashboardOverview = () => (
    <>
      <Typography variant="h4" gutterBottom component="h2" sx={{ mb: 3 }}>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3}>
        {/* Farm Stats Card */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
              borderRadius: 2,
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.primary.main,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
              },
            }}
          >
            <Typography component="h3" variant="h6" gutterBottom>
              Total Farms
            </Typography>
            <Typography component="p" variant="h3">
              3
            </Typography>
          </Paper>
        </Grid>

        {/* Devices Card */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
              borderRadius: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
              },
            }}
          >
            <Typography
              component="h3"
              variant="h6"
              color="text.secondary"
              gutterBottom
            >
              Active Devices
            </Typography>
            <Typography component="p" variant="h3">
              12
            </Typography>
          </Paper>
        </Grid>

        {/* Issues Card */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
              borderRadius: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
              },
            }}
          >
            <Typography
              component="h3"
              variant="h6"
              color="text.secondary"
              gutterBottom
            >
              Issues Reported
            </Typography>
            <Typography component="p" variant="h3">
              0
            </Typography>
          </Paper>
        </Grid>

        {/* Status Card */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
              borderRadius: 2,
              backgroundColor: theme.palette.primary.light,
              color: "white",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
              },
            }}
          >
            <Typography component="h3" variant="h6" gutterBottom>
              System Status
            </Typography>
            <Typography component="p" variant="h5">
              Healthy
            </Typography>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              borderRadius: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
              },
            }}
          >
            <Typography
              component="h3"
              variant="h6"
              color="text.secondary"
              gutterBottom
            >
              Recent Activity
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              No recent activity to display.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </>
  );

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
              [theme.breakpoints.up("sm")]: {
                width: theme.spacing(9),
              },
            }),
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "hidden" }}>
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
        <Container maxWidth="lg" sx={{ mt: 2 }}>
          <Routes>
            <Route path="/" element={renderDashboardOverview()} />
            <Route path="/farms/*" element={<FarmListPage />} />
            <Route path="/devices/*" element={<DeviceListPage />} />
            <Route path="/users" element={<UserListPage />} />
            <Route path="/users/create" element={<CreateUserPage />} />
            <Route path="/users/edit/:id" element={<EditUserPage />} />
            <Route
              path="/analytics"
              element={
                <Typography variant="h4">Analytics Placeholder</Typography>
              }
            />
            <Route
              path="/settings"
              element={
                <Typography variant="h4">Settings Placeholder</Typography>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardPage;
