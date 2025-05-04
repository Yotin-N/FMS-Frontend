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
import FarmDialog from "../../components/farm/FarmDialog";
import DeleteFarmDialog from "../../components/farm/DeleteFarmDialog";
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

      // Make sure we have the data in the expected format
      const farmsData = response.data || [];

      // Process the farms to ensure members and devices properties exist
      const processedFarms = farmsData.map((farm) => ({
        ...farm,
        // Ensure members property exists
        members: farm.members || [],
        // Ensure devices property exists
        devices: farm.devices || [],
      }));

      setFarms(processedFarms);
      setFilteredFarms(processedFarms);
    } catch (err) {
      console.error("Error loading farms:", err);
      setError("Failed to load farms. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMembersUpdate = () => {
    loadFarms();
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
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
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
            size="small"
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
              borderRadius: 1,
              textTransform: "none",
              fontWeight: 500,
              boxShadow: "none",
              px: 2,
              py: 1,
              "&:hover": {
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              },
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
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: theme.palette.secondary.light }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Farm Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Members</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Devices</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading && filteredFarms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">Loading farms...</Typography>
                  </TableCell>
                </TableRow>
              ) : filteredFarms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
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
                          sx={{
                            borderRadius: 1,
                            textTransform: "none",
                            fontWeight: 500,
                            boxShadow: "none",
                            "&:hover": {
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            },
                          }}
                        >
                          Add Your First Farm
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredFarms.map((farm) => (
                  <TableRow key={farm.id} hover>
                    <TableCell>
                      <Typography fontWeight={500}>{farm.name}</Typography>
                    </TableCell>
                    <TableCell>{farm.description || "-"}</TableCell>
                    <TableCell>{formatDate(farm.createdAt)}</TableCell>
                    <TableCell>
                      <Chip
                        icon={<PeopleIcon style={{ fontSize: 16 }} />}
                        label={`${farm.members?.length || 0} Members`}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 400 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<DevicesIcon style={{ fontSize: 16 }} />}
                        label={`${farm.devices?.length || 0} Devices`}
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

      {/* Farm Dialogs */}
      {/* Create Farm Dialog */}
      <FarmDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateFarm}
        isLoading={isLoading}
        title="Add New Farm"
      />

      {/* Edit Farm Dialog */}
      <FarmDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSubmit={handleUpdateFarm}
        initialData={selectedFarm || {}}
        isLoading={isLoading}
        isEdit={true}
        title="Edit Farm"
      />

      {/* Delete Farm Dialog */}
      <DeleteFarmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteFarm}
        farmName={selectedFarm?.name || ""}
        isLoading={isLoading}
      />

      {/* Farm Members Dialog */}
      {selectedFarm && (
        <FarmMembersDialog
          open={membersDialogOpen}
          onClose={() => setMembersDialogOpen(false)}
          farmId={selectedFarm.id}
          farmName={selectedFarm.name}
          onUpdate={handleMembersUpdate}
        />
      )}
    </Box>
  );
};

export default FarmListPage;
