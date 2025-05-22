import { useState, useEffect } from "react";
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Refresh as RefreshIcon,
  RestoreFromTrash as RestoreIcon,
} from "@mui/icons-material";
import {
  getFarmThresholds,
  upsertSensorThresholds,
  getDefaultThresholds,
} from "../../services/thresholdApi";

const SensorThresholdConfig = ({ farmId, sensorType, onSuccess, onError }) => {
  // State
  const [thresholds, setThresholds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Available severity levels
  const severityLevels = [
    { value: "critical", label: "Critical", color: "#f44336" },
    { value: "warning", label: "Warning", color: "#ff9800" },
    { value: "normal", label: "Normal", color: "#4caf50" },
  ];

  // Load thresholds on component mount
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
    setThresholds([...thresholds, newThreshold]);
  };

  // Remove a threshold range
  const removeThresholdRange = (index) => {
    const updatedThresholds = thresholds.filter((_, i) => i !== index);
    setThresholds(updatedThresholds);
  };

  // Update a specific threshold
  const updateThreshold = (index, field, value) => {
    const updatedThresholds = [...thresholds];
    updatedThresholds[index] = {
      ...updatedThresholds[index],
      [field]: value,
    };

    // Update color when severity changes
    if (field === "severityLevel") {
      const severityConfig = severityLevels.find((s) => s.value === value);
      if (severityConfig) {
        updatedThresholds[index].colorCode = severityConfig.color;
      }
    }

    setThresholds(updatedThresholds);
  };

  // Save thresholds
  const saveThresholds = async () => {
    setIsLoading(true);
    try {
      // Validate thresholds
      const validationErrors = validateThresholds();
      if (validationErrors.length > 0) {
        onError(`Validation errors: ${validationErrors.join(", ")}`);
        setIsLoading(false);
        return;
      }

      await upsertSensorThresholds(farmId, sensorType, thresholds);
      onSuccess();
      await loadThresholds(); // Reload to get updated data
    } catch (error) {
      console.error(`Error saving thresholds for ${sensorType}:`, error);
      onError(`Failed to save thresholds for ${sensorType}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to defaults
  const resetToDefaults = async () => {
    setIsLoading(true);
    try {
      const defaults = await getDefaultThresholds(sensorType);
      setThresholds(
        defaults.map((threshold) => ({
          ...threshold,
          farmId,
          sensorType,
          notificationEnabled: true,
        }))
      );
    } catch (error) {
      console.error(
        `Error loading default thresholds for ${sensorType}:`,
        error
      );
      onError(`Failed to load default thresholds for ${sensorType}`);
    } finally {
      setIsLoading(false);
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

  const unit = getSensorUnit(sensorType);

  return (
    <Accordion
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      sx={{ mb: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {sensorType} Thresholds
          </Typography>
          <Chip
            label={`${thresholds.length} ranges`}
            size="small"
            sx={{ ml: 2 }}
          />
          {unit && (
            <Chip label={unit} size="small" variant="outlined" sx={{ ml: 1 }} />
          )}
        </Box>
      </AccordionSummary>

      <AccordionDetails>
        <Box sx={{ width: "100%" }}>
          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={saveThresholds}
              disabled={isLoading}
              sx={{ textTransform: "none" }}
            >
              Save Changes
            </Button>
            <Button
              variant="outlined"
              startIcon={<RestoreIcon />}
              onClick={resetToDefaults}
              disabled={isLoading}
              sx={{ textTransform: "none" }}
            >
              Reset to Default
            </Button>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addThresholdRange}
              disabled={isLoading}
              sx={{ textTransform: "none" }}
            >
              Add Range
            </Button>
          </Box>

          {/* Threshold Ranges */}
          {thresholds.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography color="text.secondary">
                No threshold ranges configured. Click "Add Range" to create one.
              </Typography>
            </Box>
          ) : (
            thresholds.map((threshold, index) => (
              <Card
                key={index}
                sx={{ mb: 2, border: `2px solid ${threshold.colorCode}20` }}
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
                      disabled={isLoading}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: 2,
                    }}
                  >
                    {/* Severity Selection */}
                    <FormControl fullWidth>
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
                        disabled={isLoading}
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

                    {/* Min Value */}
                    <TextField
                      label={`Min Value ${unit ? `(${unit})` : ""}`}
                      type="number"
                      value={threshold.minValue || ""}
                      onChange={(e) =>
                        updateThreshold(
                          index,
                          "minValue",
                          e.target.value ? parseFloat(e.target.value) : null
                        )
                      }
                      disabled={isLoading}
                      placeholder="No minimum"
                    />

                    {/* Max Value */}
                    <TextField
                      label={`Max Value ${unit ? `(${unit})` : ""}`}
                      type="number"
                      value={threshold.maxValue || ""}
                      onChange={(e) =>
                        updateThreshold(
                          index,
                          "maxValue",
                          e.target.value ? parseFloat(e.target.value) : null
                        )
                      }
                      disabled={isLoading}
                      placeholder="No maximum"
                    />

                    {/* Label */}
                    <TextField
                      label="Label"
                      value={threshold.label || ""}
                      onChange={(e) =>
                        updateThreshold(index, "label", e.target.value)
                      }
                      disabled={isLoading}
                      placeholder="Range description"
                    />
                  </Box>

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
                          disabled={isLoading}
                        />
                      }
                      label="Enable notifications for this range"
                    />
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default SensorThresholdConfig;
