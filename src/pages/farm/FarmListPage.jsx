// src/pages/farm/FarmListPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  LinearProgress,
  Snackbar,
  Alert,
  Tooltip,
  Chip,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  People as PeopleIcon,
  DevicesOther as DevicesIcon,
  Visibility as VisibilityIcon,
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
          (farm.description &&
            farm.description.toLowerCase().includes(searchQuery.toLowerCase()))
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
      // Add mock device count to each farm
      const farmsWithDeviceCount = (response.data || []).map((farm) => ({
        ...farm,
        deviceCount: Math.floor(Math.random() * 10),
      }));
      setFarms(farmsWithDeviceCount);
      setFilteredFarms(farmsWithDeviceCount);
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

  // Format date string to display in a readable format
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Open the edit dialog
  const handleEditClick = (farm) => {
    setSelectedFarm(farm);
    setEditDialogOpen(true);
  };

  // Open the delete dialog
  const handleDeleteClick = (farm) => {
    setSelectedFarm(farm);
    setDeleteDialogOpen(true);
  };

  // Open the members dialog
  const handleMembersClick = (farm) => {
    setSelectedFarm(farm);
    setMembersDialogOpen(true);
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
                height: 40,
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
              height: 40,
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

      {/* Farms Table */}
      <Paper
        sx={{
          width: "100%",
          mb: 2,
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: theme.palette.secondary.light }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Farm Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Plan Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Create Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Devices</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading && filteredFarms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">Loading farms...</Typography>
                  </TableCell>
                </TableRow>
              ) : filteredFarms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      {searchQuery
                        ? "No farms match your search"
                        : "No farms found"}
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
                  </TableCell>
                </TableRow>
              ) : (
                filteredFarms.map((farm) => (
                  <TableRow key={farm.id} hover>
                    <TableCell>{farm.name}</TableCell>
                    <TableCell>{farm.description || "-"}</TableCell>
                    <TableCell>{formatDate(farm.createdAt)}</TableCell>
                    <TableCell>
                      <Chip
                        icon={<DevicesIcon style={{ fontSize: 16 }} />}
                        label={`${farm.deviceCount || 0} Devices`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 400 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="View Devices">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleViewDevices(farm.id)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Manage Members">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleMembersClick(farm)}
                          >
                            <PeopleIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditClick(farm)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteClick(farm)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

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
