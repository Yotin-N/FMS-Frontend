// src/components/layout/Navbar.jsx
import { useState } from "react";
import { NavLink, Link as RouterLink, useNavigate } from "react-router-dom";
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
  Person as PersonIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // State
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMenuOpen = Boolean(anchorEl);

  // Handle profile menu clicks
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  // Handle drawer
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  // Render the profile menu
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
          navigate("/profile");
        }}
        sx={{ py: 1.5 }}
      >
        <ListItemIcon>
          <PersonIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </MenuItem>

      <MenuItem
        onClick={() => {
          handleMenuClose();
          navigate("/settings");
        }}
        sx={{ py: 1.5 }}
      >
        <ListItemIcon>
          <SettingsIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Settings" />
      </MenuItem>

      {isAuthenticated && user?.role === "ADMIN" && (
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate("/dashboard/users");
          }}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon>
            <PersonIcon fontSize="small" />
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

  // Render mobile drawer
  const renderMobileDrawer = (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={toggleDrawer}
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
          onClick={toggleDrawer}
          edge="end"
          sx={{ color: theme.palette.text.secondary }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      {isAuthenticated && (
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: theme.palette.primary.main,
                mr: 1.5,
              }}
            >
              {user?.firstName?.charAt(0).toUpperCase() || "U"}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {user?.firstName || "User"} {user?.lastName || ""}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                className="text-ellipsis"
              >
                {user?.email || ""}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {isAuthenticated && user?.role === "ADMIN" && (
        <>
          <List sx={{ px: 1 }}>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={RouterLink}
                to="/dashboard/users"
                selected={location.pathname.startsWith("/dashboard/users")}
                onClick={closeDrawer}
                sx={{
                  borderRadius: 1,
                  backgroundColor: location.pathname.startsWith(
                    "/dashboard/users"
                  )
                    ? theme.palette.secondary.light
                    : "transparent",
                  color: location.pathname.startsWith("/dashboard/users")
                    ? theme.palette.primary.main
                    : "inherit",
                  "&:hover": {
                    backgroundColor: theme.palette.secondary.light,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname.startsWith("/dashboard/users")
                      ? theme.palette.primary.main
                      : "inherit",
                    minWidth: 40,
                  }}
                >
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText
                  primary="User Management"
                  primaryTypographyProps={{
                    fontWeight: location.pathname.startsWith("/dashboard/users")
                      ? 600
                      : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider sx={{ my: 1 }} />
        </>
      )}

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

  // If not authenticated, don't render the navbar
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
        {/* Left Section - Logo */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
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
                display: { xs: "none", sm: "block" },
              }}
            >
              Farm Management
            </Typography>
          </Box>
        </Box>

        {/* Right Section - User Profile */}
        <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
          {/* User Profile Avatar */}
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
