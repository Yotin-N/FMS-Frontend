// src/pages/device/DeviceListPage.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Snackbar,
  Alert,
  Tooltip,
  Stack,
  Pagination,
  useTheme,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Sensors as SensorsIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import {
  getDevices,
  createDevice,
  updateDevice,
  deleteDevice,
} from "../../services/deviceApi";

import { getFarms } from "../../services/api";
import DeviceForm from "../../components/device/DeviceForm";
import useAuth from "../../hooks/useAuth";

const DeviceListPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Get farmId from query parameter
  const queryParams = new URLSearchParams(location.search);
  const initialFarmId = queryParams.get("farmId");

  // State
  const [devices, setDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState(initialFarmId || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100); // Using a large limit to get all devices
  const [totalPages, setTotalPages] = useState(1);

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const {user, isAuthenticated} = useAuth();

  // Load farms on component mount
  useEffect(() => {
    loadFarms();
  }, []);

  // Load devices when selectedFarmId changes
  useEffect(() => {
    if (selectedFarmId) {
      loadDevices();
    } else {
      setDevices([]);
      setFilteredDevices([]);
    }
  }, [selectedFarmId, page, limit]);

  // Filter devices when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredDevices(devices);
    } else {
      const filtered = devices.filter(
        (device) =>
          device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (device.description &&
            device.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      );
      setFilteredDevices(filtered);
    }
  }, [searchQuery, devices]);

  // Load farms from API
  const loadFarms = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getFarms();

      // Make sure we have the data in the expected format
      const farmsData = response.data || [];
      setFarms(farmsData);

      // If initialFarmId is set, use it
      // Otherwise, use the first farm if available
      if (
        initialFarmId &&
        farmsData.some((farm) => farm.id === initialFarmId)
      ) {
        setSelectedFarmId(initialFarmId);
      } else if (farmsData.length > 0 && !initialFarmId) {
        setSelectedFarmId(farmsData[0].id);
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error loading farms:", err);
      setError("Failed to load farms. Please try again.");
      setIsLoading(false);
    }
  };

  // Load devices from API
  const loadDevices = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getDevices(selectedFarmId, { page, limit });
      
      // Handle response data based on your API structure
      let devicesData = [];
      let totalPagesCount = 1;
      
      if (response.data) {
        devicesData = response.data;
        totalPagesCount = response.totalPages || 1;
      } else if (Array.isArray(response)) {
        devicesData = response;
        totalPagesCount = Math.ceil(response.length / limit) || 1;
      }
      
      setDevices(devicesData);
      setFilteredDevices(devicesData);
      setTotalPages(totalPagesCount);
      setIsLoading(false);
    } catch (err) {
      console.error("Error loading devices:", err);
      setError("Failed to load devices. Please try again.");
      setIsLoading(false);
    }
  };

  // Handle farm selection change
  const handleFarmChange = (event) => {
    const farmId = event.target.value;
    setSelectedFarmId(farmId);
    setPage(1); // Reset to first page when farm changes

    // Update URL to include the farmId
    if (farmId) {
      navigate(`/dashboard/devices?farmId=${farmId}`, { replace: true });
    } else {
      navigate("/dashboard/devices", { replace: true });
    }
  };

  // Handle device creation
  const handleCreateDevice = async (deviceData) => {
    setIsLoading(true);

    try {
      await createDevice(deviceData);
      await loadDevices();
      setCreateDialogOpen(false);
      setSuccess("Device created successfully!");
    } catch (err) {
      console.error("Error creating device:", err);
      setError("Failed to create device. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateDevice = async (deviceData) => {
    if (!selectedDevice) return;

    setIsLoading(true);

    try {
      // Create a clean object with only the fields that can be updated
      const updateData = {
        name: deviceData.name,
        description: deviceData.description,
        isActive: deviceData.isActive,
      };

      // Send only the valid fields for updating
      await updateDevice(selectedDevice.id, updateData);
      await loadDevices();
      setEditDialogOpen(false);
      setSuccess("Device updated successfully!");
    } catch (err) {
      console.error("Error updating device:", err);
      setError("Failed to update device. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle device deletion
  const handleDeleteDevice = async () => {
    if (!selectedDevice) return;

    setIsLoading(true);

    try {
      await deleteDevice(selectedDevice.id);
      await loadDevices();
      setDeleteDialogOpen(false);
      setSuccess("Device deleted successfully!");
    } catch (err) {
      console.error("Error deleting device:", err);
      setError("Failed to delete device. Please try again.");
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
  const handleEditClick = (device) => {
    setSelectedDevice(device);
    setEditDialogOpen(true);
  };

  // Open the delete dialog
  const handleDeleteClick = (device) => {
    setSelectedDevice(device);
    setDeleteDialogOpen(true);
  };

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // Close snackbar alerts
  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setError(null);
    setSuccess(null);
  };

  // Get farm name by id
  const getFarmName = (farmId) => {
    const farm = farms.find((farm) => farm.id === farmId);
    return farm ? farm.name : "Unknown Farm";
  };

  return (
    <Box>
      {/* Page Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Device Management
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          width={{ xs: "100%", sm: "auto" }}
          alignItems="center"
        >
          <TextField
            placeholder="Search devices..."
            variant="outlined"
            size="small"
            fullWidth
            disabled={!selectedFarmId}
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
              flex: 1,
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
            disabled={!selectedFarmId}
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
            Add Device
          </Button>
        </Stack>
      </Stack>

      {/* Farm Selection */}
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth sx={{ maxWidth: 300 }}>
          <InputLabel id="farm-select-label">Select Farm</InputLabel>
          <Select
            labelId="farm-select-label"
            value={selectedFarmId}
            onChange={handleFarmChange}
            label="Select Farm"
            displayEmpty
            renderValue={(selected) => {
              if (!selected || selected.length === 0) {
                return null;
              }

              const farm = farms.find((f) => f.id === selected);
              return farm ? farm.name : "";
            }}
          >
            {farms.length === 0 ? (
              <MenuItem disabled value=""></MenuItem>
            ) : (
              farms.map((farm) => (
                <MenuItem key={farm.id} value={farm.id}>
                  {farm.name}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      </Box>

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

      {/* No Farm Selected State */}
      {!selectedFarmId && !isLoading && (
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
            Please select a farm to manage devices
          </Typography>

          {farms.length === 0 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/dashboard/farms")}
              sx={{ mt: 2 }}
            >
              Create a Farm First
            </Button>
          ) : (
            <Typography variant="body2" color="text.secondary" align="center">
              Use the dropdown above to select a farm
            </Typography>
          )}
        </Box>
      )}

      {/* Devices Table */}
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
                <TableCell sx={{ fontWeight: 600 }}>Device Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Farm</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Created At</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading && filteredDevices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">Loading devices...</Typography>
                  </TableCell>
                </TableRow>
              ) : filteredDevices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {searchQuery
                          ? "No devices match your search"
                          : "No devices found"}
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
                          Add Your First Device
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredDevices.map((device) => (
                  <TableRow key={device.id} hover>
                    <TableCell>
                      <Typography fontWeight={500}>{device.name}</Typography>
                    </TableCell>
                    <TableCell>{device.description || "-"}</TableCell>
                    <TableCell>
                      {device.farm?.name || getFarmName(device.farmId)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={device.isActive ? "Active" : "Inactive"}
                        color={device.isActive ? "success" : "error"}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{formatDate(device.createdAt)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="View Sensors">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() =>
                              navigate(
                                `/dashboard/sensors?deviceId=${device.id}`
                              )
                            }
                          >
                            <SensorsIcon fontSize="small" />
                          </IconButton>

                          
                        </Tooltip>
                        { isAuthenticated && user?.role === "ADMIN" && (
                       <>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditClick(device)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteClick(device)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        </> )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {!isLoading && filteredDevices.length > 0 && totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </Paper>

      {/* Create Device Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          elevation: 3,
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle>Add New Device</DialogTitle>
        <DialogContent dividers>
          <DeviceForm
            initialData={{ farmId: selectedFarmId }}
            onSubmit={handleCreateDevice}
            onCancel={() => setCreateDialogOpen(false)}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Device Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          elevation: 3,
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle>Edit Device</DialogTitle>
        <DialogContent dividers>
          <DeviceForm
            initialData={selectedDevice}
            onSubmit={handleUpdateDevice}
            onCancel={() => setEditDialogOpen(false)}
            isLoading={isLoading}
            isEdit
          />
        </DialogContent>
      </Dialog>

      {/* Delete Device Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          elevation: 3,
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle>Delete Device</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedDevice?.name}"? This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteDevice}
            color="error"
            variant="contained"
            disabled={isLoading}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeviceListPage;