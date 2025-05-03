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
  Menu,
  MenuItem,
  ListItemIcon,
  Button,
  Chip,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  ArrowForward as ArrowForwardIcon,
  DevicesOther as DevicesIcon,
} from "@mui/icons-material";

const FarmCard = ({ farm, onEditClick, onDeleteClick, onMembersClick }) => {
  const navigate = useNavigate();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  // Get the correct member count
  const memberCount = farm.members?.length || 0;

  // Get the correct device count
  const deviceCount = farm.devices?.length || 0;

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

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

  const viewDevices = () => {
    navigate(`/devices?farmId=${farm.id}`);
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <CardContent sx={{ p: 2, flexGrow: 1 }}>
        {/* Title and menu */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
          <Typography variant="h6" component="h2" fontWeight={500}>
            {farm.name}
          </Typography>

          <IconButton
            size="small"
            onClick={handleMenuOpen}
            sx={{ mt: -0.5, mr: -0.5 }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Description */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {farm.description || "No description provided"}
        </Typography>

        {/* Stats */}
        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          <Chip
            icon={<PeopleIcon style={{ fontSize: 16 }} />}
            label={`${memberCount} Members`}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 400 }}
          />

          <Chip
            icon={<DevicesIcon style={{ fontSize: 16 }} />}
            label={`${deviceCount} Devices`}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 400 }}
          />
        </Box>
      </CardContent>

      {/* Action button */}
      <CardActions
        sx={{ pt: 0, pb: 2, px: 2, mt: "auto", justifyContent: "flex-end" }}
      >
        <Button
          color="primary"
          variant="text"
          endIcon={<ArrowForwardIcon />}
          onClick={viewDevices}
          sx={{
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          View Devices
        </Button>
      </CardActions>

      {/* Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit Farm
        </MenuItem>
        <MenuItem onClick={handleMembers}>
          <ListItemIcon>
            <PeopleIcon fontSize="small" />
          </ListItemIcon>
          Manage Members
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
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
