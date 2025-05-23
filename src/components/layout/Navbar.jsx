// src/components/layout/Navbar.jsx
import { useState } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Agriculture as AgricultureIcon,
  Devices as DevicesIcon,
  Person as PersonIcon, // Used for Profile link
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  // Notifications as NotificationsIcon, // This was imported but not used
  Close as CloseIcon,
  Menu as MenuIcon, // Added for hamburger menu
  Sensors as SensorsIcon, // Added
  People as PeopleIcon,    // Added for User Management
} from "@mui/icons-material";
import useAuth from "../../hooks/useAuth";

// Navbar component no longer needs toggleDrawer/open props from DashboardPage for this implementation
// if it's managing its own mobile drawer.
const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation(); // Added to determine active route
  const { isAuthenticated, user, logout } = useAuth();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // State for profile menu
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  // State for Navbar's own mobile drawer
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Handle profile menu clicks
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    if (mobileDrawerOpen) {
      closeMobileDrawer(); // Close mobile drawer if open
    }
    handleMenuClose(); // Close profile menu if open
    logout();
  };

  // Handle Navbar's mobile drawer
  const toggleMobileDrawer = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const closeMobileDrawer = () => {
    setMobileDrawerOpen(false);
  };

  // Define menu items for the Navbar's mobile drawer
  // Paths are absolute, matching the routes in DashboardPage.jsx
  const drawerMenuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
      roles: ["ADMIN", "USER"],
    },
    {
      text: "Farm Management",
      icon: <AgricultureIcon />,
      path: "/dashboard/farms",
      roles: ["ADMIN", "USER"],
    },
    {
      text: "Device Management",
      icon: <DevicesIcon />,
      path: "/dashboard/devices",
      roles: ["ADMIN", "USER"],
    },
    {
      text: "Sensor",
      icon: <SensorsIcon />,
      path: "/dashboard/sensors",
      roles: ["ADMIN", "USER"],
    },
    {
      text: "Settings",
      icon: <SettingsIcon />,
      path: "/dashboard/settings",
      roles: ["ADMIN"],
    },
    {
      text: "User Management",
      icon: <PeopleIcon />, // Consistent with DashboardPage sidebar
      path: "/dashboard/users",
      roles: ["ADMIN"],
    },
  ];

  const filteredDrawerMenuItems = drawerMenuItems.filter((item) => {
    if (!isAuthenticated || !user) return false;
    if (!item.roles) return true;
    return item.roles.includes(user.role);
  });

  // Helper to determine if a nav item is active
  const isActiveNavItem = (itemPath) => {
    if (itemPath === "/dashboard") {
      // Active if path is exactly /dashboard or /dashboard?query...
      return location.pathname === "/dashboard" || location.pathname.startsWith("/dashboard?");
    }
    // Active if current path starts with itemPath (e.g., /dashboard/farms will match /dashboard/farms/create)
    return location.pathname.startsWith(itemPath);
  };

  const renderProfileMenu = (
    <Menu
      anchorEl={anchorEl}
      open={isMenuOpen}
      onClose={handleMenuClose}
      sx={{ mt: 1 }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      PaperProps={{
        elevation: 3,
        sx: {
          width: 220,
          overflow: "visible",
          borderRadius: 2,
          mt: 1.5,
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
          "&:before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: "background.paper",
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
          },
        },
      }}
    >
      <Box sx={{ p: 2, pb: 1.5 }}>
        <Typography variant="subtitle1" fontWeight={600} noWrap>
          {user?.firstName || "User"} {user?.lastName || ""}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          noWrap
          className="text-ellipsis"
        >
          {user?.email || ""}
        </Typography>
      </Box>
      <Divider />
      <MenuItem
        onClick={() => {
          handleMenuClose();
          navigate("/profile"); // Assuming /profile is a valid top-level route
        }}
        sx={{ py: 1.5 }}
      >
        <ListItemIcon>
          <PersonIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </MenuItem>
      {isAuthenticated && user?.role === "ADMIN" && (
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate("/dashboard/settings"); // Corrected path
          }}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </MenuItem>
      )}
      {isAuthenticated && user?.role === "ADMIN" && (
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate("/dashboard/users");
          }}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon>
            <PeopleIcon fontSize="small" /> {/* Changed to PeopleIcon for consistency */}
          </ListItemIcon>
          <ListItemText primary="User Management" />
        </MenuItem>
      )}
      <Divider />
      <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" color="error" />
        </ListItemIcon>
        <ListItemText
          primary="Logout"
          primaryTypographyProps={{ color: "error" }}
        />
      </MenuItem>
    </Menu>
  );

  const renderMobileDrawer = (
    <Drawer
      anchor="left"
      open={mobileDrawerOpen}
      onClose={toggleMobileDrawer} // Use Navbar's own toggle
      sx={{
        "& .MuiDrawer-paper": {
          width: 280,
          boxSizing: "border-box",
          backgroundColor: theme.palette.background.default,
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <AgricultureIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
          <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
            Farm Management
          </Typography>
        </Box>
        <IconButton
          onClick={toggleMobileDrawer} // Use Navbar's own toggle
          edge="end"
          sx={{ color: theme.palette.text.secondary }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      {isAuthenticated && user && (
        <Box sx={{ p: 2, pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: theme.palette.primary.main,
                mr: 1.5,
              }}
            >
              {user.firstName?.charAt(0).toUpperCase() || "U"}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {user.firstName || "User"} {user.lastName || ""}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                className="text-ellipsis"
              >
                {user.email || ""}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Dynamic Menu List */}
      {isAuthenticated && filteredDrawerMenuItems.length > 0 && (
        <List sx={{ px: 1 }}>
          {filteredDrawerMenuItems.map((item) => {
            const active = isActiveNavItem(item.path);
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  selected={active}
                  onClick={closeMobileDrawer} // Close this drawer on click
                  sx={{
                    borderRadius: 1,
                    backgroundColor: active
                      ? theme.palette.action.selected //theme.palette.secondary.light
                      : "transparent",
                    color: active
                      ? theme.palette.primary.main
                      : "inherit",
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                    "&.Mui-selected": { // Ensure selected style overrides hover if needed
                      backgroundColor: theme.palette.action.selected,
                      "&:hover": {
                        backgroundColor: theme.palette.action.selectedHover || theme.palette.action.hover,
                      }
                    }
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: active
                        ? theme.palette.primary.main
                        : "inherit",
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: active ? 600 : 500,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      )}

      {isAuthenticated && filteredDrawerMenuItems.length > 0 && <Divider sx={{ my: 1 }} />}

      {/* Logout Link */}
      {isAuthenticated && (
        <List sx={{ px: 1 }}>
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton onClick={handleLogout} sx={{ borderRadius: 1 }}>
              <ListItemIcon>
                <LogoutIcon color="error" />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{ color: "error" }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      )}
    </Drawer>
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={0}
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <Toolbar>
        {/* Hamburger Menu Icon - visible only on mobile */}
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleMobileDrawer} // Use Navbar's own toggle
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Left Section - Logo. flexGrow: 1 makes it take available space */}
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <AgricultureIcon
            sx={{
              color: theme.palette.primary.main,
              mr: 1,
              fontSize: isMobile ? 24 : 28,
            }}
          />
          <Typography
            variant={isMobile ? "subtitle1" : "h6"}
            component={RouterLink}
            to={isAuthenticated ? "/dashboard" : "/"}
            sx={{
              fontWeight: 600,
              color: theme.palette.primary.main,
              textDecoration: "none",
              display: { xs: "none", sm: "block" }, // Show text on sm screens and up
            }}
          >
            Farm Management
          </Typography>
        </Box>

        {/* Right Section - User Profile. ml: "auto" is not needed if the logo box has flexGrow:1 */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={handleProfileMenuOpen}
            size="small"
            edge="end"
            aria-label="account of current user"
            aria-controls="primary-user-menu"
            aria-haspopup="true"
            color="inherit"
            sx={{ ml: 1 }}
          >
            <Avatar
              sx={{
                width: 35,
                height: 35,
                bgcolor: theme.palette.primary.main,
                transition: "all 0.2s",
                border: isMenuOpen
                  ? `2px solid ${theme.palette.primary.main}`
                  : "none",
              }}
            >
              {user?.firstName?.charAt(0).toUpperCase() || "U"}
            </Avatar>
          </IconButton>
          {renderProfileMenu}
        </Box>
      </Toolbar>
      {renderMobileDrawer}
    </AppBar>
  );
};

export default Navbar;