/* eslint-disable no-unused-vars */
// src/pages/user/UserManagementPage.jsx
import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Container,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import {
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  Tune as TuneIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import UserListPage from "./UserListPage";
import CreateUserPage from "./CreateUserPage";
import EditUserPage from "./EditUserPage";
import useAuth from "../../hooks/useAuth";

const drawerWidth = 240;

const UserManagementPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Handle drawer toggling
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Update drawer state on window resize
  useEffect(() => {
    const handleResize = () => {
      setDrawerOpen(!isMobile);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  // Update selected menu item based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/dashboard/users/create")) {
      setSelectedIndex(1);
    } else if (path.includes("/dashboard/users/edit")) {
      setSelectedIndex(2);
    } else {
      setSelectedIndex(0);
    }
  }, [location.pathname]);

  // Menu items for user management
  const menuItems = [
    { text: "User List", icon: <PeopleIcon />, path: "/dashboard/users" },
    {
      text: "Create User",
      icon: <PersonAddIcon />,
      path: "/dashboard/users/create",
    },
    {
      text: "User Settings",
      icon: <TuneIcon />,
      path: "/dashboard/users/settings",
    },
  ];

  // Navigate when menu item is clicked
  const handleListItemClick = (index, path) => {
    setSelectedIndex(index);
    navigate(path);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: `1px solid ${theme.palette.divider}`,
            mt: { xs: "56px", sm: "64px" }, // Adjust for navbar height
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto", pt: 2 }}>
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
                    borderRadius: 1,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 2,
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
          width: { xs: "100%", sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        {/* Mobile menu toggle */}
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{
              mr: 2,
              display: { sm: "none" },
              position: "fixed",
              top: 72,
              left: 16,
              zIndex: 1100,
              backgroundColor: theme.palette.background.paper,
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Container maxWidth="lg" sx={{ mt: 2 }}>
          <Routes>
            <Route path="/" element={<UserListPage />} />
            <Route path="/create" element={<CreateUserPage />} />
            <Route path="/edit/:id" element={<EditUserPage />} />
            <Route
              path="/settings"
              element={
                <Paper sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h5">User Settings</Typography>
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    This is a placeholder for user settings configuration.
                  </Typography>
                </Paper>
              }
            />
            <Route
              path="*"
              element={<Navigate to="/dashboard/users" replace />}
            />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
};

// export default UserManagementPage;
