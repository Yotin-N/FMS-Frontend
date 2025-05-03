// src/components/farm/FarmCard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
  alpha,
  useTheme,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  People as PeopleIcon,
  Room as RoomIcon,
  ArrowForward as ArrowForwardIcon,
  Spa as SpaIcon,
  WbSunny as SunnyIcon,
  Terrain as TerrainIcon,
  WaterDrop as WaterDropIcon,
} from "@mui/icons-material";

const FarmCard = ({ farm, onEditClick, onDeleteClick, onMembersClick }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Menu state
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const isMenuOpen = Boolean(menuAnchorEl);

  // Handle menu open/close
  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // Handlers with menu close
  const handleEdit = () => {
    handleMenuClose();
    onEditClick(farm);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDeleteClick(farm);
  };

  const handleMembers = () => {
    handleMenuClose();
    onMembersClick(farm);
  };

  // Navigate to devices for this farm
  const handleViewDevices = () => {
    navigate(`/devices?farmId=${farm.id}`);
  };

  // Helper to get icon for farm type
  const getFarmTypeIcon = () => {
    switch (farm.farmType) {
      case "Crop Farm":
        return <SpaIcon fontSize="small" />;
      case "Orchard":
        return <SpaIcon fontSize="small" />;
      case "Greenhouse":
        return <SunnyIcon fontSize="small" />;
      default:
        return <TerrainIcon fontSize="small" />;
    }
  };

  return (
    <Card
      elevation={1}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        borderRadius: 2,
        overflow: "visible",
        "&:hover": {
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          transform: "translateY(-4px)",
        },
      }}
    >
      {/* Farm Type Indicator */}
      <Box
        sx={{
          position: "absolute",
          top: -10,
          left: 16,
          backgroundColor: alpha(theme.palette.primary.main, 0.9),
          color: "#fff",
          borderRadius: 2,
          px: 1.5,
          py: 0.5,
          zIndex: 1,
          fontWeight: 500,
          fontSize: "0.75rem",
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {getFarmTypeIcon()}
        {farm.farmType || "Farm"}
      </Box>

      {/* Menu Button */}
      <IconButton
        size="small"
        onClick={handleMenuOpen}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 1,
          backgroundColor: isMenuOpen
            ? alpha(theme.palette.primary.light, 0.1)
            : "transparent",
          "&:hover": {
            backgroundColor: alpha(theme.palette.primary.light, 0.1),
          },
        }}
      >
        <MoreVertIcon />
      </IconButton>

      {/* Content */}
      <CardContent sx={{ flexGrow: 1, pt: 3, pb: 2 }}>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          className="text-ellipsis"
          sx={{
            pr: 4, // Space for menu button
            fontWeight: 600,
            mb: 1.5,
            color: theme.palette.text.primary,
          }}
          title={farm.name} // Shows full name on hover
        >
          {farm.name}
        </Typography>

        {farm.location && (
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <RoomIcon
              fontSize="small"
              color="action"
              sx={{ mr: 0.5, color: theme.palette.text.secondary }}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              className="text-ellipsis"
              title={farm.location} // Shows full location on hover
            >
              {farm.location}
            </Typography>
          </Box>
        )}

        {/* Farm Stats */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 2 }}>
          {/* Area */}
          {farm.area && (
            <Chip
              label={`${farm.area} ha`}
              size="small"
              variant="outlined"
              sx={{
                borderColor: theme.palette.divider,
                fontSize: "0.75rem",
              }}
            />
          )}

          {/* Soil Type */}
          {farm.soilType && (
            <Chip
              icon={<TerrainIcon style={{ fontSize: 14 }} />}
              label={farm.soilType}
              size="small"
              variant="outlined"
              sx={{
                borderColor: theme.palette.divider,
                fontSize: "0.75rem",
              }}
            />
          )}

          {/* Irrigation */}
          {farm.irrigationSource && (
            <Chip
              icon={<WaterDropIcon style={{ fontSize: 14 }} />}
              label={farm.irrigationSource}
              size="small"
              variant="outlined"
              sx={{
                borderColor: theme.palette.divider,
                fontSize: "0.75rem",
              }}
            />
          )}
        </Box>

        {/* Members info */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mt: "auto",
            pt: 1,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <PeopleIcon
            fontSize="small"
            sx={{ mr: 0.5, color: theme.palette.text.secondary }}
          />
          <Typography variant="body2" color="text.secondary">
            {farm.members?.length || 1}{" "}
            {farm.members?.length === 1 ? "Member" : "Members"}
          </Typography>
        </Box>

        {/* Description (if available) */}
        {farm.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2 }}
            className="multi-line-ellipsis"
            title={farm.description} // Shows full description on hover
          >
            {farm.description}
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0, justifyContent: "flex-end" }}>
        <Tooltip title="View farm devices">
          <Box>
            <IconButton
              onClick={handleViewDevices}
              color="primary"
              sx={{
                ml: "auto",
                backgroundColor: theme.palette.primary.light + "20",
                "&:hover": {
                  backgroundColor: theme.palette.primary.light + "30",
                },
              }}
            >
              <ArrowForwardIcon />
            </IconButton>
          </Box>
        </Tooltip>
      </CardActions>

      {/* Farm Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            width: 200,
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
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleEdit} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit Farm
        </MenuItem>

        <MenuItem onClick={handleMembers} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <PeopleIcon fontSize="small" />
          </ListItemIcon>
          Manage Members
        </MenuItem>

        <MenuItem
          onClick={handleDelete}
          sx={{ color: theme.palette.error.main, py: 1.5 }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          Delete Farm
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default FarmCard;
