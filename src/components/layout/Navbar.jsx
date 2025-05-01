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
  Button,
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
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Agriculture as AgricultureIcon,
  Devices as DevicesIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Profile menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  // Mobile drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Navigation links based on auth status
  const navLinks = isAuthenticated
    ? [
        { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
        { text: "Farms", icon: <AgricultureIcon />, path: "/farms" },
        { text: "Devices", icon: <DevicesIcon />, path: "/devices" },
      ]
    : [
        { text: "Login", path: "/login" },
        { text: "Register", path: "/register" },
      ];

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

  // Determine if a nav link is active
  const isActive = (path) => {
    return location.pathname.startsWith(path);
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
          width: 200,
          overflow: "visible",
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
      <MenuItem
        onClick={() => {
          handleMenuClose();
          navigate("/profile");
        }}
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
      >
        <ListItemIcon>
          <SettingsIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Settings" />
      </MenuItem>

      <Divider />

      <MenuItem onClick={handleLogout}>
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
          width: 250,
          boxSizing: "border-box",
          backgroundColor: theme.palette.background.default,
        },
      }}
    >
      <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
        <AgricultureIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
        <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
          Farm Management
        </Typography>
      </Box>

      <Divider />

      <List>
        {navLinks.map((link) => (
          <ListItem key={link.text} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={link.path}
              selected={isActive(link.path)}
              onClick={toggleDrawer}
              sx={{
                backgroundColor: isActive(link.path)
                  ? theme.palette.secondary.light
                  : "transparent",
                color: isActive(link.path)
                  ? theme.palette.primary.main
                  : "inherit",
                "&:hover": {
                  backgroundColor: theme.palette.secondary.light,
                },
              }}
            >
              {link.icon && (
                <ListItemIcon
                  sx={{
                    color: isActive(link.path)
                      ? theme.palette.primary.main
                      : "inherit",
                  }}
                >
                  {link.icon}
                </ListItemIcon>
              )}
              <ListItemText primary={link.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {isAuthenticated && (
        <>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
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
        </>
      )}
    </Drawer>
  );

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={0}
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: "white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      }}
    >
      <Toolbar>
        {isAuthenticated && isMobile && (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <AgricultureIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
          <Typography
            variant="h6"
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

        <Box sx={{ flexGrow: 1 }} />

        {/* Desktop Navigation Links */}
        {!isMobile && (
          <Box sx={{ display: "flex" }}>
            {navLinks.map((link) => (
              <Button
                key={link.text}
                component={RouterLink}
                to={link.path}
                color="inherit"
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  backgroundColor: isActive(link.path)
                    ? theme.palette.secondary.light
                    : "transparent",
                  color: isActive(link.path)
                    ? theme.palette.primary.main
                    : "inherit",
                  "&:hover": {
                    backgroundColor: theme.palette.secondary.light,
                  },
                }}
                startIcon={link.icon}
              >
                {link.text}
              </Button>
            ))}
          </Box>
        )}

        {/* User Profile Section */}
        {isAuthenticated && (
          <Box>
            <IconButton
              onClick={handleProfileMenuOpen}
              size="small"
              edge="end"
              aria-label="account of current user"
              aria-controls="primary-user-menu"
              aria-haspopup="true"
              color="inherit"
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: theme.palette.primary.main,
                }}
              >
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </Avatar>
            </IconButton>
            {renderProfileMenu}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
