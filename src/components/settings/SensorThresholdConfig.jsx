/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Divider,
  Card,
  CardContent,
  Chip,
  FormControlLabel,
  Checkbox,
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  RestoreFromTrash as RestoreIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import {
  getFarmThresholds,
  upsertSensorThresholds,
  getDefaultThresholds,
} from "../../services/thresholdApi";

const SensorThresholdConfig = ({
  farmId,
  sensorType,
  onSuccess,
  onError,
  onClose,
  onSave,
  onCancel,
  onAddRange,
  onResetToDefault,
}) => {
  // State
  const [thresholds, setThresholds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Available severity levels
  const severityLevels = [
    { value: "critical", label: "Critical", color: "#f44336" },
    { value: "warning", label: "Warning", color: "#ff9800" },
    { value: "normal", label: "Normal", color: "#4caf50" },
  ];

  // Load thresholds on component mount or when props change
  useEffect(() => {
    if (farmId && sensorType) {
      loadThresholds();
    }
  }, [farmId, sensorType]);

  // Load current thresholds for this sensor type
  const loadThresholds = async () => {
    setIsLoading(true);
    try {
      const farmThresholds = await getFarmThresholds(farmId);

      // Filter thresholds for this sensor type
      const sensorThresholds = farmThresholds.filter(
        (threshold) => threshold.sensorType === sensorType
      );

      // If no thresholds exist, load defaults
      if (sensorThresholds.length === 0) {
        const defaults = await getDefaultThresholds(sensorType);
        setThresholds(
          defaults.map((threshold) => ({
            ...threshold,
            farmId,
            sensorType,
            notificationEnabled: true,
          }))
        );
      } else {
        setThresholds(sensorThresholds);
      }
    } catch (error) {
      console.error(`Error loading thresholds for ${sensorType}:`, error);
      onError(`Failed to load thresholds for ${sensorType}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new threshold range
  const addThresholdRange = () => {
    const newThreshold = {
      farmId,
      sensorType,
      severityLevel: "normal",
      minValue: null,
      maxValue: null,
      notificationEnabled: true,
      colorCode: "#4caf50",
      label: "New Range",
    };
    setThresholds((prev) => [...prev, newThreshold]);
  };

  // Remove a threshold range
  const removeThresholdRange = (index) => {
    setThresholds((prev) => prev.filter((_, i) => i !== index));
  };

  // Update a specific threshold field
  const updateThreshold = useCallback(
    (index, field, value) => {
      setThresholds((prev) => {
        const newThresholds = [...prev];

        // Create a new object for the specific threshold to avoid mutation
        newThresholds[index] = {
          ...newThresholds[index],
          [field]: value,
        };

        // Update color when severity changes
        if (field === "severityLevel") {
          const severityConfig = severityLevels.find((s) => s.value === value);
          if (severityConfig) {
            newThresholds[index].colorCode = severityConfig.color;
          }
        }

        // Format decimal values for min/max
        if (field === "minValue" || field === "maxValue") {
          if (value !== null && value !== "") {
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
              // Round to 2 decimal places
              newThresholds[index][field] = Math.round(numValue * 100) / 100;
            }
          } else {
            newThresholds[index][field] = null;
          }
        }

        return newThresholds;
      });
    },
    [severityLevels]
  );

  // Save thresholds
  const saveThresholds = async () => {
    setIsSaving(true);
    try {
      // Validate thresholds
      const validationErrors = validateThresholds();
      if (validationErrors.length > 0) {
        onError(`Validation errors: ${validationErrors.join(", ")}`);
        setIsSaving(false);
        return;
      }

      await upsertSensorThresholds(farmId, sensorType, thresholds);
      onSuccess();
      await loadThresholds(); // Reload to get updated data
    } catch (error) {
      console.error(`Error saving thresholds for ${sensorType}:`, error);
      onError(`Failed to save thresholds for ${sensorType}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to defaults and save immediately
  const resetToDefaults = async () => {
    setIsSaving(true);
    try {
      const defaults = await getDefaultThresholds(sensorType);
      const defaultThresholds = defaults.map((threshold) => ({
        ...threshold,
        farmId,
        sensorType,
        notificationEnabled: true,
      }));

      // Save defaults immediately to backend
      await upsertSensorThresholds(farmId, sensorType, defaultThresholds);

      // Update local state
      setThresholds(defaultThresholds);
      onSuccess(
        `Default thresholds for ${sensorType} have been applied and saved.`
      );
    } catch (error) {
      console.error(
        `Error resetting to default thresholds for ${sensorType}:`,
        error
      );
      onError(`Failed to reset to default thresholds for ${sensorType}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Validate thresholds
  const validateThresholds = () => {
    const errors = [];

    thresholds.forEach((threshold, index) => {
      if (threshold.minValue !== null && threshold.maxValue !== null) {
        if (threshold.minValue >= threshold.maxValue) {
          errors.push(
            `Range ${index + 1}: Min value must be less than max value`
          );
        }
      }
    });

    return errors;
  };

  // Get sensor unit based on type
  const getSensorUnit = (type) => {
    const units = {
      TempA: "°C",
      TempB: "°C",
      TempC: "°C",
      DO: "mg/L",
      Salinity: "ppt",
      pH: "pH",
      Ammonia: "PPM",
      Turbidity: "cm",
      NO2: "",
    };
    return units[type] || "";
  };

  // Format number input to 2 decimal places
  const formatDecimalInput = (value) => {
    if (value === null || value === "") return "";
    const num = parseFloat(value);
    return isNaN(num) ? "" : num.toFixed(2);
  };

  // Handle numeric input change with decimal formatting
  const handleNumericInputChange = (index, field, inputValue) => {
    if (inputValue === "") {
      updateThreshold(index, field, null);
      return;
    }

    // Allow input during typing but validate on blur
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue)) {
      updateThreshold(index, field, numValue);
    }
  };

  const unit = getSensorUnit(sensorType);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {/* Info Section */}
      <Box sx={{ mb: 3 }}>
        <Chip
          label={`${thresholds.length} threshold ranges`}
          size="small"
          sx={{ mr: 1 }}
        />
        {unit && (
          <Chip label={`Unit: ${unit}`} size="small" variant="outlined" />
        )}
      </Box>

      {/* Threshold Ranges */}
      {thresholds.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography color="text.secondary">
            No threshold ranges configured. Click "Add Range" to create one.
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            maxWidth: "600px",
            mx: "auto",
          }}
        >
          {thresholds.map((threshold, index) => (
            <Card
              key={index}
              sx={{
                width: "100%",
                border: `2px solid ${threshold.colorCode}20`,
                "&:hover": {
                  border: `2px solid ${threshold.colorCode}40`,
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Range {index + 1}
                  </Typography>
                  <IconButton
                    color="error"
                    onClick={() => removeThresholdRange(index)}
                    disabled={isSaving}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>

                <Grid container spacing={2}>
                  {/* Severity Selection */}
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Severity</InputLabel>
                      <Select
                        value={threshold.severityLevel}
                        onChange={(e) =>
                          updateThreshold(
                            index,
                            "severityLevel",
                            e.target.value
                          )
                        }
                        label="Severity"
                        disabled={isSaving}
                      >
                        {severityLevels.map((severity) => (
                          <MenuItem key={severity.value} value={severity.value}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Box
                                sx={{
                                  width: 16,
                                  height: 16,
                                  backgroundColor: severity.color,
                                  borderRadius: "50%",
                                  mr: 1,
                                }}
                              />
                              {severity.label}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Min Value */}
                  <Grid item xs={12} md={3}>
                    <TextField
                      label={`Min Value ${unit ? `(${unit})` : ""}`}
                      type="number"
                      value={
                        threshold.minValue !== null ? threshold.minValue : ""
                      }
                      onChange={(e) =>
                        handleNumericInputChange(
                          index,
                          "minValue",
                          e.target.value
                        )
                      }
                      onBlur={(e) => {
                        // Format to 2 decimal places on blur
                        const value = e.target.value;
                        if (value !== "" && !isNaN(parseFloat(value))) {
                          updateThreshold(index, "minValue", parseFloat(value));
                        }
                      }}
                      disabled={isSaving}
                      placeholder="No minimum"
                      size="small"
                      fullWidth
                      inputProps={{
                        step: "0.01",
                      }}
                    />
                  </Grid>

                  {/* Max Value */}
                  <Grid item xs={12} md={3}>
                    <TextField
                      label={`Max Value ${unit ? `(${unit})` : ""}`}
                      type="number"
                      value={
                        threshold.maxValue !== null ? threshold.maxValue : ""
                      }
                      onChange={(e) =>
                        handleNumericInputChange(
                          index,
                          "maxValue",
                          e.target.value
                        )
                      }
                      onBlur={(e) => {
                        // Format to 2 decimal places on blur
                        const value = e.target.value;
                        if (value !== "" && !isNaN(parseFloat(value))) {
                          updateThreshold(index, "maxValue", parseFloat(value));
                        }
                      }}
                      disabled={isSaving}
                      placeholder="No maximum"
                      size="small"
                      fullWidth
                      inputProps={{
                        step: "0.01",
                      }}
                    />
                  </Grid>

                  {/* Label */}
                  <Grid item xs={12} md={3}>
                    <TextField
                      label="Label"
                      value={threshold.label || ""}
                      onChange={(e) =>
                        updateThreshold(index, "label", e.target.value)
                      }
                      disabled={isSaving}
                      placeholder="Range description"
                      size="small"
                      fullWidth
                    />
                  </Grid>
                </Grid>

                {/* Additional Options */}
                <Box sx={{ mt: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={threshold.notificationEnabled || false}
                        onChange={(e) =>
                          updateThreshold(
                            index,
                            "notificationEnabled",
                            e.target.checked
                          )
                        }
                        disabled={isSaving}
                        size="small"
                      />
                    }
                    label="Enable notifications for this range"
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Pass functions and state to parent for action buttons */}
      {/* This component will expose these through props to the parent */}
      <Box sx={{ display: "none" }}>
        {/* Hidden elements that expose functionality to parent */}
        {onAddRange && onAddRange(addThresholdRange)}
        {onResetToDefault && onResetToDefault(resetToDefaults, isSaving)}
        {onSave && onSave(saveThresholds, isSaving)}
        {onCancel && onCancel()}
      </Box>
    </>
  );
};

export default SensorThresholdConfig;
