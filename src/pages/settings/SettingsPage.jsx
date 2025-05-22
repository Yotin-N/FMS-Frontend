import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Alert,
  Snackbar,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  Close as CloseIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { getFarms } from "../../services/api";
import SensorThresholdConfig from "../../components/settings/SensorThresholdConfig";

const SettingsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get farmId and sensorType from query parameters
  const queryParams = new URLSearchParams(location.search);
  const initialFarmId = queryParams.get("farmId");
  const initialSensorType = queryParams.get("sensorType");

  // State
  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState(initialFarmId || "");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSensorType, setEditingSensorType] = useState(null);

  // Available sensor types (from your backend enum)
  const availableSensorTypes = [
    { type: "TempA", name: "Temperature A", unit: "°C", color: "#f44336" },
    { type: "TempB", name: "Temperature B", unit: "°C", color: "#ff5722" },
    { type: "TempC", name: "Temperature C", unit: "°C", color: "#ff9800" },
    { type: "DO", name: "Dissolved Oxygen", unit: "mg/L", color: "#4caf50" },
    { type: "Salinity", name: "Salinity", unit: "ppt", color: "#03a9f4" },
    { type: "pH", name: "pH Level", unit: "pH", color: "#8bc34a" },
    { type: "Ammonia", name: "Ammonia", unit: "PPM", color: "#9c27b0" },
    { type: "Turbidity", name: "Turbidity", unit: "cm", color: "#0A5EB0" },
    { type: "NO2", name: "Nitrite", unit: "", color: "#673ab7" },
  ];

  // Load farms on component mount
  useEffect(() => {
    loadFarms();
  }, []);

  // Open modal if sensorType is specified in URL
  useEffect(() => {
    if (initialSensorType && selectedFarmId) {
      handleEditSensorType(initialSensorType);
    }
  }, [initialSensorType, selectedFarmId]);

  // Load farms from API
  const loadFarms = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getFarms();
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
        navigate(`/dashboard/settings?farmId=${farmsData[0].id}`, {
          replace: true,
        });
      }
    } catch (err) {
      console.error("Error loading farms:", err);
      setError("Failed to load farms. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle farm selection change
  const handleFarmChange = (event) => {
    const farmId = event.target.value;
    setSelectedFarmId(farmId);

    // Update URL to include the farmId
    if (farmId) {
      navigate(`/dashboard/settings?farmId=${farmId}`, { replace: true });
    } else {
      navigate("/dashboard/settings", { replace: true });
    }
  };

  // Handle opening the edit modal for a sensor type
  const handleEditSensorType = (sensorType) => {
    setEditingSensorType(sensorType);
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSensorType(null);
    // Remove sensorType from URL but keep farmId
    if (selectedFarmId) {
      navigate(`/dashboard/settings?farmId=${selectedFarmId}`, {
        replace: true,
      });
    }
  };

  // Handle successful threshold update
  const handleThresholdUpdate = (sensorType) => {
    setSuccess(`Thresholds for ${sensorType} updated successfully!`);
  };

  // Handle threshold update error
  const handleThresholdError = (errorMessage) => {
    setError(errorMessage);
  };

  // Close snackbar alerts
  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setError(null);
    setSuccess(null);
  };

  // Get sensor type details
  const getSensorTypeDetails = (type) => {
    return (
      availableSensorTypes.find((sensor) => sensor.type === type) || {
        type,
        name: type,
        unit: "",
        color: "#9e9e9e",
      }
    );
  };

  return (
    <Box>
      {/* Page Header */}
      <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 600 }}>
        Sensor Threshold Settings
      </Typography>

      {/* Farm Selection */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <FormControl fullWidth sx={{ maxWidth: 400 }}>
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
              <MenuItem disabled value="">
                No farms available
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
      </Paper>

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
            Please select a farm to configure sensor thresholds
          </Typography>
        </Box>
      )}

      {/* Sensor Type Cards */}
      {selectedFarmId && (
        <Box>
          <Typography
            variant="h5"
            component="h2"
            sx={{ mb: 3, fontWeight: 600 }}
          >
            Sensor Types
          </Typography>
          <Grid container spacing={3}>
            {availableSensorTypes.map((sensorInfo) => {
              const { type, name, unit, color } = sensorInfo;

              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={type}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 2,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      border: `2px solid ${color}20`,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                        border: `2px solid ${color}40`,
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      {/* Sensor Icon/Color */}
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          backgroundColor: color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 2,
                        }}
                      >
                        <SettingsIcon sx={{ color: "white" }} />
                      </Box>

                      {/* Sensor Name */}
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{ fontWeight: 600, mb: 1 }}
                      >
                        {name}
                      </Typography>

                      {/* Sensor Type */}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        Type: {type}
                      </Typography>

                      {/* Unit Chip */}
                      {unit && (
                        <Chip
                          label={unit}
                          size="small"
                          sx={{
                            backgroundColor: `${color}15`,
                            color: color,
                            fontWeight: 500,
                          }}
                        />
                      )}
                    </CardContent>

                    <CardActions sx={{ p: 3, pt: 0 }}>
                      <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() => handleEditSensorType(type)}
                        fullWidth
                        sx={{
                          backgroundColor: color,
                          "&:hover": {
                            backgroundColor: `${color}dd`,
                          },
                          textTransform: "none",
                          fontWeight: 500,
                        }}
                      >
                        Edit Thresholds
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}

      {/* Edit Modal */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 2,
          }}
        >
          <Box>
            <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
              {editingSensorType &&
                `Configure ${
                  getSensorTypeDetails(editingSensorType).name
                } Thresholds`}
            </Typography>
            {editingSensorType && (
              <Typography variant="body2" color="text.secondary">
                Farm: {farms.find((f) => f.id === selectedFarmId)?.name} • Type:{" "}
                {editingSensorType}
                {getSensorTypeDetails(editingSensorType).unit &&
                  ` • Unit: ${getSensorTypeDetails(editingSensorType).unit}`}
              </Typography>
            )}
          </Box>
          <IconButton
            edge="end"
            onClick={handleCloseModal}
            aria-label="close"
            sx={{
              color: "grey.500",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.04)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          {editingSensorType && selectedFarmId && (
            <SensorThresholdConfig
              farmId={selectedFarmId}
              sensorType={editingSensorType}
              onSuccess={() => handleThresholdUpdate(editingSensorType)}
              onError={handleThresholdError}
            />
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleCloseModal}
            variant="outlined"
            sx={{
              borderRadius: 1,
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SettingsPage;
