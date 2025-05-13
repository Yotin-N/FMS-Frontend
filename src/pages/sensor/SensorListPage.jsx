// src/pages/sensor/SensorListPage.jsx
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
  ShowChart as ShowChartIcon,
} from "@mui/icons-material";
import {
  getFarms,
  getDevices,
  getSensors,
  addSensor,
  updateSensor,
  deleteSensor,
} from "../../services/api";
import SensorForm from "../../components/sensor/SensorForm";

const SensorListPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const initialDeviceId = queryParams.get("deviceId");
  const initialFarmId = queryParams.get("farmId");

  // State
  const [sensors, setSensors] = useState([]);
  const [filteredSensors, setFilteredSensors] = useState([]);
  const [farms, setFarms] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState(initialFarmId || "");
  const [selectedDeviceId, setSelectedDeviceId] = useState(
    initialDeviceId || ""
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100); // Using a large limit to get all sensors
  const [totalPages, setTotalPages] = useState(1);

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState(null);

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
      setSelectedDeviceId("");
    }
  }, [selectedFarmId]);

  // Load sensors when selectedDeviceId changes or pagination changes
  useEffect(() => {
    if (selectedDeviceId) {
      loadSensors();
    } else {
      setSensors([]);
      setFilteredSensors([]);
    }
  }, [selectedDeviceId, page, limit]);

  // Filter sensors when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSensors(sensors);
    } else {
      const filtered = sensors.filter((sensor) =>
        sensor.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSensors(filtered);
    }
  }, [searchQuery, sensors]);

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
      const response = await getDevices(selectedFarmId, { page: 1, limit: 100 });
      const devicesData = response.data || [];
      setDevices(devicesData);

      // If initialDeviceId is set, use it if it belongs to the selected farm
      if (
        initialDeviceId &&
        devicesData.some((device) => device.id === initialDeviceId)
      ) {
        setSelectedDeviceId(initialDeviceId);
      } else if (devicesData.length > 0 && !initialDeviceId) {
        setSelectedDeviceId(devicesData[0].id);
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error loading devices:", err);
      setError("Failed to load devices. Please try again.");
      setIsLoading(false);
    }
  };

  // Load sensors from API
  const loadSensors = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getSensors(selectedDeviceId, { page, limit });
      
      // Handle response data based on your API structure
      let sensorsData = [];
      let totalPagesCount = 1;
      
      if (response.data) {
        sensorsData = response.data;
        totalPagesCount = response.totalPages || 1;
      } else if (Array.isArray(response)) {
        sensorsData = response;
        totalPagesCount = Math.ceil(response.length / limit) || 1;
      }
      
      setSensors(sensorsData);
      setFilteredSensors(sensorsData);
      setTotalPages(totalPagesCount);
      setIsLoading(false);
    } catch (err) {
      console.error("Error loading sensors:", err);
      setError("Failed to load sensors. Please try again.");
      setIsLoading(false);
    }
  };

  // Handle farm selection change
  const handleFarmChange = (event) => {
    const farmId = event.target.value;
    setSelectedFarmId(farmId);
    setSelectedDeviceId(""); // Reset device selection when farm changes
    setPage(1); // Reset to page 1

    // Update URL to include the farmId
    const params = new URLSearchParams();
    if (farmId) params.set("farmId", farmId);
    navigate(`/dashboard/sensors?${params.toString()}`, { replace: true });
  };

  // Handle device selection change
  const handleDeviceChange = (event) => {
    const deviceId = event.target.value;
    setSelectedDeviceId(deviceId);
    setPage(1); // Reset to page 1

    // Update URL to include farmId and deviceId
    const params = new URLSearchParams();
    if (selectedFarmId) params.set("farmId", selectedFarmId);
    if (deviceId) params.set("deviceId", deviceId);
    navigate(`/dashboard/sensors?${params.toString()}`, { replace: true });
  };

  // Handle sensor creation
  const handleCreateSensor = async (sensorData) => {
    setIsLoading(true);

    try {
      // Ensure deviceId is set
      const newSensorData = {
        ...sensorData,
        deviceId: selectedDeviceId,
      };

      await addSensor(newSensorData);
      await loadSensors();
      setCreateDialogOpen(false);
      setSuccess("Sensor created successfully!");
    } catch (err) {
      console.error("Error creating sensor:", err);
      setError("Failed to create sensor. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sensor update
  const handleUpdateSensor = async (sensorData) => {
    if (!selectedSensor) return;

    setIsLoading(true);

    try {
      await updateSensor(selectedSensor.id, sensorData);
      await loadSensors();
      setEditDialogOpen(false);
      setSuccess("Sensor updated successfully!");
    } catch (err) {
      console.error("Error updating sensor:", err);
      setError("Failed to update sensor. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sensor deletion
  const handleDeleteSensor = async () => {
    if (!selectedSensor) return;

    setIsLoading(true);

    try {
      await deleteSensor(selectedSensor.id);
      await loadSensors();
      setDeleteDialogOpen(false);
      setSuccess("Sensor deleted successfully!");
    } catch (err) {
      console.error("Error deleting sensor:", err);
      setError("Failed to delete sensor. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // Format date string
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
  const handleEditClick = (sensor) => {
    setSelectedSensor(sensor);
    setEditDialogOpen(true);
  };

  // Open the delete dialog
  // Open the delete dialog
  const handleDeleteClick = (sensor) => {
    setSelectedSensor(sensor);
    setDeleteDialogOpen(true);
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
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Sensor Management
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          width={{ xs: "100%", sm: "auto" }}
          alignItems="center"
        >
          <TextField
            placeholder="Search sensors..."
            variant="outlined"
            size="small"
            fullWidth
            disabled={!selectedDeviceId}
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
            disabled={!selectedDeviceId}
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
            Add Sensor
          </Button>
        </Stack>
      </Stack>

      {/* Farm and Device Selection */}
      <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <FormControl sx={{ minWidth: 200, flexGrow: 1, maxWidth: 300 }}>
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

        <FormControl
          sx={{ minWidth: 200, flexGrow: 1, maxWidth: 300 }}
          disabled={!selectedFarmId}
        >
          <InputLabel id="device-select-label">Select Device</InputLabel>
          <Select
            labelId="device-select-label"
            value={selectedDeviceId}
            onChange={handleDeviceChange}
            label="Select Device"
            displayEmpty
            renderValue={(selected) => {
              // When nothing is selected but devices exist
              if (!selected && devices.length > 0) {
                return ""; // Show just the label
              }
              // When a device is selected
              if (selected) {
                const device = devices.find((d) => d.id === selected);
                return device ? device.name : "";
              }
              // Default case
              return "";
            }}
          >
            {devices.length === 0 ? (
              <MenuItem value="" disabled>
                No devices available
              </MenuItem>
            ) : (
              [
                <MenuItem key="empty" value="" disabled>
                  Select a device
                </MenuItem>,
                ...devices.map((device) => (
                  <MenuItem key={device.id} value={device.id}>
                    {device.name}
                  </MenuItem>
                )),
              ]
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

      {/* No Selection State */}
      {!selectedDeviceId && !isLoading && (
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
            Please select a farm and device to manage sensors
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
          ) : devices.length === 0 && selectedFarmId ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                navigate(`/dashboard/devices?farmId=${selectedFarmId}`)
              }
              sx={{ mt: 2 }}
            >
              Add a Device First
            </Button>
          ) : (
            <Typography variant="body2" color="text.secondary" align="center">
              Use the dropdown above to select a farm and device
            </Typography>
          )}
        </Box>
      )}

      {/* Sensors Table */}
      {selectedDeviceId && (
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
              <TableHead
                sx={{ backgroundColor: theme.palette.secondary.light }}
              >
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Sensor Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Serial Number</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Unit</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Created At</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading && filteredSensors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1">
                        Loading sensors...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : filteredSensors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          {searchQuery
                            ? "No sensors match your search"
                            : "No sensors found for this device"}
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
                            Add Your First Sensor
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSensors.map((sensor) => (
                    <TableRow key={sensor.id} hover>
                      <TableCell>
                        <Typography fontWeight={500}>{sensor.name}</Typography>
                      </TableCell>
                      <TableCell>{sensor.serialNumber}</TableCell>
                      <TableCell>
                        <Chip
                          label={sensor.type}
                          size="small"
                          sx={{
                            fontWeight: 500,
                            backgroundColor: getSensorTypeColor(sensor.type),
                            color: "#fff",
                          }}
                        />
                      </TableCell>
                      <TableCell>{sensor.unit || "-"}</TableCell>
                      <TableCell>
                        <Chip
                          label={sensor.isActive ? "Active" : "Inactive"}
                          color={sensor.isActive ? "success" : "error"}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{formatDate(sensor.createdAt)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Tooltip title="View Readings">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() =>
                                navigate(
                                  `/dashboard/sensors/${sensor.id}/readings`
                                )
                              }
                            >
                              <ShowChartIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEditClick(sensor)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteClick(sensor)}
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

          {/* Pagination */}
          {!isLoading && filteredSensors.length > 0 && totalPages > 1 && (
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
      )}

      {/* Create Sensor Dialog */}
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
        <DialogTitle>Add New Sensor</DialogTitle>
        <DialogContent dividers>
          <SensorForm
            onSubmit={handleCreateSensor}
            onCancel={() => setCreateDialogOpen(false)}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Sensor Dialog */}
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
        <DialogTitle>Edit Sensor</DialogTitle>
        <DialogContent dividers>
          <SensorForm
            initialData={selectedSensor}
            onSubmit={handleUpdateSensor}
            onCancel={() => setEditDialogOpen(false)}
            isLoading={isLoading}
            isEdit
          />
        </DialogContent>
      </Dialog>

      {/* Delete Sensor Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          elevation: 3,
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle>Delete Sensor</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedSensor?.name}"? This
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
            onClick={handleDeleteSensor}
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

const getSensorTypeColor = (type) => {
  const colorMap = {
    TempA: "#ff5722",
    TempB: "#ff9800",
    TempC: "#ffc107",
    pH: "#8bc34a",
    DO: "#4caf50",
    Saltlinity: "#03a9f4",
    NHx: "#f44336",
    EC: "#9c27b0",
    TDS: "#00bcd4",
    ORP: "#673ab7",
  };

  return colorMap[type] || "#757575";
};

export default SensorListPage;