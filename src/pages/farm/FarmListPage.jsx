/* eslint-disable no-unused-vars */
// src/pages/farm/FarmListPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  LinearProgress,
  Snackbar,
  Alert,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  InputAdornment,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  People as PeopleIcon,
  Room as RoomIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import {
  getFarms,
  createFarm,
  updateFarm,
  deleteFarm,
} from "../../services/api";
import FarmForm from "../../components/farm/FarmForm";
import FarmMembersDialog from "../../components/farm/members/FarmMembersDialog";

const FarmListPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Responsive breakpoints
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  // State
  const [farms, setFarms] = useState([]);
  const [filteredFarms, setFilteredFarms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [membersDialogOpen, setMembersDialogOpen] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState(null);

  // Menu state
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuFarmId, setMenuFarmId] = useState(null);

  // Load farms on component mount
  useEffect(() => {
    loadFarms();
  }, []);

  // Filter farms when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFarms(farms);
    } else {
      const filtered = farms.filter(
        (farm) =>
          farm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (farm.location &&
            farm.location.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredFarms(filtered);
    }
  }, [searchQuery, farms]);

  // Load farms from API
  const loadFarms = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getFarms();
      setFarms(response.data || []);
      setFilteredFarms(response.data || []);
    } catch (err) {
      console.error("Error loading farms:", err);
      setError("Failed to load farms. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle farm creation
  const handleCreateFarm = async (farmData) => {
    setIsLoading(true);

    try {
      await createFarm(farmData);
      await loadFarms();
      setCreateDialogOpen(false);
      setSuccess("Farm created successfully!");
    } catch (err) {
      console.error("Error creating farm:", err);
      setError("Failed to create farm. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle farm update
  const handleUpdateFarm = async (farmData) => {
    if (!selectedFarm) return;

    setIsLoading(true);

    try {
      await updateFarm(selectedFarm.id, farmData);
      await loadFarms();
      setEditDialogOpen(false);
      setSuccess("Farm updated successfully!");
    } catch (err) {
      console.error("Error updating farm:", err);
      setError("Failed to update farm. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle farm deletion
  const handleDeleteFarm = async () => {
    if (!selectedFarm) return;

    setIsLoading(true);

    try {
      await deleteFarm(selectedFarm.id);
      await loadFarms();
      setDeleteDialogOpen(false);
      setSuccess("Farm deleted successfully!");
    } catch (err) {
      console.error("Error deleting farm:", err);
      setError("Failed to delete farm. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Open the farm menu
  const handleMenuOpen = (event, farmId) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuFarmId(farmId);
  };

  // Close the farm menu
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuFarmId(null);
  };

  // Open the edit dialog
  const handleEditClick = (farm) => {
    setSelectedFarm(farm);
    setEditDialogOpen(true);
    handleMenuClose();
  };

  // Open the delete dialog
  const handleDeleteClick = (farm) => {
    setSelectedFarm(farm);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  // Open the members dialog
  const handleMembersClick = (farm) => {
    setSelectedFarm(farm);
    setMembersDialogOpen(true);
    handleMenuClose();
  };

  // Navigate to devices for a specific farm
  const handleViewDevices = (farmId) => {
    navigate(`/devices?farmId=${farmId}`);
  };

  // Close snackbar alerts
  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setError(null);
    setSuccess(null);
  };

  return (
    <Box>
      {/* Page Header */}
      <Stack
        direction={isSmallScreen ? "column" : "row"}
        justifyContent="space-between"
        alignItems={isSmallScreen ? "stretch" : "center"}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Typography variant="h4" component="h1">
          Farm Management
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          width={isSmallScreen ? "100%" : "auto"}
          alignItems="center"
        >
          <TextField
            placeholder="Search farms..."
            variant="outlined"
            size="medium"
            fullWidth={isSmallScreen}
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
              flex: isSmallScreen ? 1 : "none",
              minWidth: { sm: "200px" },
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{
              whiteSpace: "nowrap",
              flexShrink: 0,
              height: "40px",
            }}
          >
            Add Farm
          </Button>
        </Stack>
      </Stack>

      {/* Loading State */}
      {isLoading && <LinearProgress sx={{ mb: 3 }} />}

      {/* Error Display */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleAlertClose}
      >
        <Alert
          onClose={handleAlertClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

      {/* Success Display */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={handleAlertClose}
      >
        <Alert
          onClose={handleAlertClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {success}
        </Alert>
      </Snackbar>

      {/* Farms Grid */}
      {filteredFarms.length === 0 && !isLoading ? (
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
            {searchQuery ? "No farms match your search" : "No farms found"}
          </Typography>

          {!searchQuery && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
              sx={{ mt: 2 }}
            >
              Add Your First Farm
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredFarms.map((farm) => (
            <Grid item key={farm.id} xs={12} sm={6} lg={4}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  transition: "all 0.3s ease",
                  borderRadius: 2,
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, farm.id)}
                  sx={{ position: "absolute", top: 8, right: 8 }}
                >
                  <MoreVertIcon />
                </IconButton>

                <CardContent sx={{ flexGrow: 1, pt: 3 }}>
                  <Typography
                    variant="h5"
                    component="h2"
                    gutterBottom
                    noWrap
                    sx={{
                      pr: 4,
                      fontSize: { xs: "1.25rem", sm: "1.5rem" },
                    }}
                  >
                    {farm.name}
                  </Typography>

                  {farm.location && (
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <RoomIcon
                        fontSize="small"
                        color="action"
                        sx={{ mr: 0.5, flexShrink: 0 }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {farm.location}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <PeopleIcon
                      fontSize="small"
                      color="action"
                      sx={{ mr: 0.5, flexShrink: 0 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {farm.members?.length || 1}{" "}
                      {farm.members?.length === 1 ? "Member" : "Members"}
                    </Typography>
                  </Box>

                  {farm.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 2,
                        display: "-webkit-box",
                        overflow: "hidden",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 3,
                      }}
                    >
                      {farm.description}
                    </Typography>
                  )}
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0, justifyContent: "flex-end" }}>
                  <Button
                    size="small"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => handleViewDevices(farm.id)}
                  >
                    View Devices
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Farm Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: { width: 200 },
        }}
      >
        <MenuItem
          onClick={() =>
            handleEditClick(farms.find((f) => f.id === menuFarmId))
          }
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit Farm
        </MenuItem>

        <MenuItem
          onClick={() =>
            handleMembersClick(farms.find((f) => f.id === menuFarmId))
          }
        >
          <ListItemIcon>
            <PeopleIcon fontSize="small" />
          </ListItemIcon>
          Manage Members
        </MenuItem>

        <MenuItem
          onClick={() =>
            handleDeleteClick(farms.find((f) => f.id === menuFarmId))
          }
          sx={{ color: theme.palette.error.main }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          Delete Farm
        </MenuItem>
      </Menu>

      {/* Create Farm Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          elevation: 5,
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle>Add New Farm</DialogTitle>
        <DialogContent dividers>
          <FarmForm
            onSubmit={handleCreateFarm}
            onCancel={() => setCreateDialogOpen(false)}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Farm Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          elevation: 5,
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle>Edit Farm</DialogTitle>
        <DialogContent dividers>
          {selectedFarm && (
            <FarmForm
              initialData={selectedFarm}
              onSubmit={handleUpdateFarm}
              onCancel={() => setEditDialogOpen(false)}
              isLoading={isLoading}
              isEdit
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Farm Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          elevation: 5,
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle>Delete Farm</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{selectedFarm?.name}"? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteFarm}
            color="error"
            variant="contained"
            disabled={isLoading}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Farm Members Dialog */}
      {selectedFarm && (
        <FarmMembersDialog
          open={membersDialogOpen}
          onClose={() => setMembersDialogOpen(false)}
          farmId={selectedFarm.id}
          farmName={selectedFarm.name}
        />
      )}
    </Box>
  );
};

export default FarmListPage;
