/* eslint-disable no-unused-vars */
// src/pages/device/DeviceListPage.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  LinearProgress,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  ListItemIcon,
  InputAdornment,
  Chip,
  FormControl,
  InputLabel,
  Select,
  useTheme,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Sensors as SensorsIcon,
  DevicesOther as DevicesOtherIcon,
  SignalCellularAlt as SignalIcon,
  SignalCellularConnectedNoInternet0Bar as NoSignalIcon,
} from "@mui/icons-material";
import {
  getDevices,
  getFarms,
  addDevice,
  updateDevice,
  deleteDevice,
} from "../../services/api";
import DeviceForm from "../../components/device/DeviceForm";
import useAuth from "../../hooks/useAuth";

const DeviceListPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

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

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

  // Menu state
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuDeviceId, setMenuDeviceId] = useState(null);

  // Load farms and devices on component mount
  useEffect(() => {
    loadFarms();
  }, []);

  // Load devices when selectedFarmId changes
  useEffect(() => {
    if (selectedFarmId) {
      loadDevices(selectedFarmId);
    } else {
      setDevices([]);
      setFilteredDevices([]);
    }
  }, [selectedFarmId]);

  // Filter devices when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredDevices(devices);
    } else {
      const filtered = devices.filter(
        (device) =>
          device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (device.location &&
            device.location.toLowerCase().includes(searchQuery.toLowerCase()))
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
      setFarms(response.data || []);

      // If we have an initialFarmId and it's in the list of farms, use it
      // Otherwise, use the first farm in the list if available
      if (
        initialFarmId &&
        response.data.some((farm) => farm.id === initialFarmId)
      ) {
        setSelectedFarmId(initialFarmId);
      } else if (response.data.length > 0 && !initialFarmId) {
        setSelectedFarmId(response.data[0].id);
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error loading farms:", err);
      setError("Failed to load farms. Please try again.");
      setIsLoading(false);
    }
  };

  // Load devices for a specific farm
  const loadDevices = async (farmId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getDevices(farmId);
      setDevices(response.data || []);
      setFilteredDevices(response.data || []);
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

    // Update URL to include the farmId
    if (farmId) {
      navigate(`/devices?farmId=${farmId}`, { replace: true });
    } else {
      navigate("/devices", { replace: true });
    }
  };

  // Handle device creation
  const handleCreateDevice = async (deviceData) => {
    setIsLoading(true);

    try {
      const newDevice = {
        ...deviceData,
        farmId: selectedFarmId,
      };

      await addDevice(newDevice);
      await loadDevices(selectedFarmId);
      setCreateDialogOpen(false);
      setSuccess("Device created successfully!");
    } catch (err) {
      console.error("Error creating device:", err);
      setError("Failed to create device. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle device update
  const handleUpdateDevice = async (deviceData) => {
    if (!selectedDevice) return;

    setIsLoading(true);

    try {
      await updateDevice(selectedDevice.id, deviceData);
      await loadDevices(selectedFarmId);
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
      await loadDevices(selectedFarmId);
      setDeleteDialogOpen(false);
      setSuccess("Device deleted successfully!");
    } catch (err) {
      console.error("Error deleting device:", err);
      setError("Failed to delete device. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Open the device menu
  const handleMenuOpen = (event, deviceId) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuDeviceId(deviceId);
  };

  // Close the device menu
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuDeviceId(null);
  };

  // Open the edit dialog
  const handleEditClick = (device) => {
    setSelectedDevice(device);
    setEditDialogOpen(true);
    handleMenuClose();
  };

  // Open the delete dialog
  const handleDeleteClick = (device) => {
    setSelectedDevice(device);
    setDeleteDialogOpen(true);
    handleMenuClose();
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Typography variant="h4" component="h1">
          Device Management
        </Typography>

        <Box
          sx={{ display: "flex", gap: 2, width: { xs: "100%", sm: "auto" } }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            disabled={!selectedFarmId}
            sx={{ whiteSpace: "nowrap" }}
          >
            Add Device
          </Button>
        </Box>
      </Box>

      {/* Farm Selection and Search */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "stretch", md: "center" },
          gap: 2,
          mb: 3,
        }}
      >
        <FormControl sx={{ minWidth: 200, flex: { md: 1 } }}>
          <InputLabel id="farm-select-label">Select Farm</InputLabel>
          <Select
            labelId="farm-select-label"
            value={selectedFarmId}
            onChange={handleFarmChange}
            label="Select Farm"
            displayEmpty
          >
            {farms.length === 0 ? (
              <MenuItem disabled value="">
                <em>No farms available</em>
              </MenuItem>
            ) : (
              farms.map((farm) => (
                <MenuItem key={farm.id} value={farm.id}>
                  {farm.name}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        <TextField
          placeholder="Search devices..."
          variant="outlined"
          size="small"
          fullWidth
          disabled={!selectedFarmId}
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{
            flex: { md: 3 },
            backgroundColor: "white",
            borderRadius: 1,
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
          <DevicesOtherIcon
            sx={{ fontSize: 60, color: theme.palette.primary.light, mb: 2 }}
          />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Please select a farm to manage devices
          </Typography>

          {farms.length === 0 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/farms")}
              sx={{ mt: 2 }}
            >
              Create a Farm First
            </Button>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Use the dropdown above to select a farm
            </Typography>
          )}
        </Box>
      )}

      {/* Devices Grid */}
      {selectedFarmId && filteredDevices.length === 0 && !isLoading ? (
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
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchQuery ? "No devices match your search" : "No devices found"}
          </Typography>

          {!searchQuery && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
              sx={{ mt: 2 }}
            >
              Add Your First Device
            </Button>
          )}
        </Box>
      ) : (
        selectedFarmId && (
          <Grid container spacing={3}>
            {filteredDevices.map((device) => (
              <Grid item key={device.id} xs={12} sm={6} md={4}>
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
                    onClick={(e) => handleMenuOpen(e, device.id)}
                    sx={{ position: "absolute", top: 8, right: 8 }}
                  >
                    <MoreVertIcon />
                  </IconButton>

                  <CardContent sx={{ flexGrow: 1, pt: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="h5"
                        component="h2"
                        gutterBottom
                        noWrap
                        sx={{ pr: 4 }}
                      >
                        {device.name}
                      </Typography>
                      <Chip
                        icon={
                          device.isActive ? <SignalIcon /> : <NoSignalIcon />
                        }
                        label={device.isActive ? "Active" : "Inactive"}
                        size="small"
                        color={device.isActive ? "success" : "error"}
                        sx={{ mt: 0.5 }}
                      />
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Chip
                        label={device.macAddress || "No MAC Address"}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: "0.75rem" }}
                      />
                    </Box>

                    {device.location && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        Location: {device.location}
                      </Typography>
                    )}

                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      <SensorsIcon
                        fontSize="small"
                        color="action"
                        sx={{ mr: 0.5 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {device.sensors?.length || 0} Sensors
                      </Typography>
                    </Box>

                    {device.description && (
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
                        {device.description}
                      </Typography>
                    )}
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0, justifyContent: "flex-end" }}>
                    <Button
                      size="small"
                      onClick={() => handleEditClick(device)}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )
      )}

      {/* Device Menu */}
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
            handleEditClick(devices.find((d) => d.id === menuDeviceId))
          }
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit Device
        </MenuItem>

        <MenuItem
          onClick={() =>
            handleDeleteClick(devices.find((d) => d.id === menuDeviceId))
          }
          sx={{ color: theme.palette.error.main }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          Delete Device
        </MenuItem>
      </Menu>

      {/* Create Device Dialog */}
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
        <DialogTitle>Add New Device</DialogTitle>
        <DialogContent dividers>
          <DeviceForm
            farmId={selectedFarmId}
            farmName={getFarmName(selectedFarmId)}
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
          elevation: 5,
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle>Edit Device</DialogTitle>
        <DialogContent dividers>
          {selectedDevice && (
            <DeviceForm
              initialData={selectedDevice}
              farmId={selectedFarmId}
              farmName={getFarmName(selectedFarmId)}
              onSubmit={handleUpdateDevice}
              onCancel={() => setEditDialogOpen(false)}
              isLoading={isLoading}
              isEdit
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Device Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          elevation: 5,
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
        <Box sx={{ p: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
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
        </Box>
      </Dialog>
    </Box>
  );
};

export default DeviceListPage;
