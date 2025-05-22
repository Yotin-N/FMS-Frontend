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
} from "@mui/material";
import { getFarms } from "../../services/api";
import SensorThresholdConfig from "../../components/settings/SensorThresholdConfig";

const SettingsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get farmId from query parameter
  const queryParams = new URLSearchParams(location.search);
  const initialFarmId = queryParams.get("farmId");

  // State
  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState(initialFarmId || "");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Available sensor types (from your backend enum)
  const availableSensorTypes = [
    "TempA",
    "TempB",
    "TempC",
    "DO",
    "Salinity",
    "pH",
    "Ammonia",
    "Turbidity",
    "NO2",
  ];

  // Load farms on component mount
  useEffect(() => {
    loadFarms();
  }, []);

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

      {/* Sensor Threshold Configuration */}
      {selectedFarmId && (
        <Box>
          {availableSensorTypes.map((sensorType) => (
            <SensorThresholdConfig
              key={sensorType}
              farmId={selectedFarmId}
              sensorType={sensorType}
              onSuccess={() => handleThresholdUpdate(sensorType)}
              onError={handleThresholdError}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SettingsPage;
