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
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";

const FarmCard = ({ farm, onEditClick, onDeleteClick, onMembersClick }) => {
  const navigate = useNavigate();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

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

        {/* Members count */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
          <PeopleIcon
            fontSize="small"
            sx={{ mr: 0.5, color: "text.secondary", opacity: 0.8 }}
          />
          <Typography variant="body2" color="text.secondary">
            {farm.members?.length || 1} Members
          </Typography>
        </Box>

        {/* Description */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {farm.description || `A test farm ${farm.name.split(" ").pop()}`}
        </Typography>
      </CardContent>

      {/* Action button - matching Device Management page */}
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
