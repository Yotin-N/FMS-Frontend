// src/components/sensor/SensorForm.jsx
import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Grid,
  MenuItem,
  CircularProgress,
  Typography,
  Divider,
  Alert,
  InputAdornment,
} from "@mui/material";
import { SensorType } from "../../constant/sensorTypes";

const SensorForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
  isEdit = false,
}) => {
  // Initialize form data with default values
  const [formData, setFormData] = useState({
    name: "",
    serialNumber: "",
    type: "PH",
    unit: "",
    minValue: "",
    maxValue: "",
    isActive: true,
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      // Extract only the fields we need for the form
      const { name, serialNumber, type, unit, minValue, maxValue, isActive } =
        initialData;

      setFormData({
        name: name || "",
        serialNumber: serialNumber || "",
        type: type || "PH",
        unit: unit || "",
        minValue: minValue !== undefined ? minValue : "",
        maxValue: maxValue !== undefined ? maxValue : "",
        isActive: isActive !== undefined ? isActive : true,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, checked, type: inputType } = e.target;

    // Handle different input types
    const newValue = inputType === "checkbox" ? checked : value;

    // For numeric fields, ensure they're numbers or empty strings
    if ((name === "minValue" || name === "maxValue") && value !== "") {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        return; // Don't update if not a valid number
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear validation error when field changes
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate required fields
    if (!formData.name.trim()) {
      newErrors.name = "Sensor name is required";
    }

    if (!formData.serialNumber.trim()) {
      newErrors.serialNumber = "Serial number is required";
    }

    if (!formData.type) {
      newErrors.type = "Sensor type is required";
    }

    // Validate min/max values if both are provided
    if (formData.minValue !== "" && formData.maxValue !== "") {
      const min = parseFloat(formData.minValue);
      const max = parseFloat(formData.maxValue);
      if (min >= max) {
        newErrors.minValue = "Min value must be less than max value";
        newErrors.maxValue = "Max value must be greater than min value";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Convert numeric strings to numbers if not empty
      const processedData = {
        ...formData,
        minValue:
          formData.minValue !== "" ? parseFloat(formData.minValue) : null,
        maxValue:
          formData.maxValue !== "" ? parseFloat(formData.maxValue) : null,
      };

      onSubmit(processedData);
    } catch (err) {
      setError("Error submitting form: " + err.message);
    }
  };

  // Get unit placeholder based on sensor type
  const getUnitPlaceholder = (type) => {
    const unitMap = {
      PH: "pH",
      TEMP: "°C",
      SALINITY: "ppt",
      DO: "mg/L",
      ORP: "mV",
      AMMONIA: "mg/L",
      NITRITE: "mg/L",
      NITRATE: "mg/L",
    };

    return unitMap[type] || "";
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Sensor Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            label="Sensor Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            disabled={isLoading}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Serial Number"
            name="serialNumber"
            value={formData.serialNumber}
            onChange={handleChange}
            error={!!errors.serialNumber}
            helperText={errors.serialNumber}
            disabled={isLoading || (isEdit && initialData.serialNumber)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            required
            label="Sensor Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            error={!!errors.type}
            helperText={errors.type}
            disabled={isLoading || (isEdit && initialData.type)}
          >
            {Object.entries(SensorType).map(([key, value]) => (
              <MenuItem key={key} value={key}>
                {value}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Unit"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            placeholder={getUnitPlaceholder(formData.type)}
            disabled={isLoading}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={handleChange}
                name="isActive"
                color="primary"
                disabled={isLoading}
              />
            }
            label="Sensor is active"
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Range Settings (Optional)
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Minimum Value"
            name="minValue"
            type="number"
            value={formData.minValue}
            onChange={handleChange}
            error={!!errors.minValue}
            helperText={errors.minValue}
            disabled={isLoading}
            InputProps={{
              endAdornment: formData.unit ? (
                <InputAdornment position="end">{formData.unit}</InputAdornment>
              ) : null,
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Maximum Value"
            name="maxValue"
            type="number"
            value={formData.maxValue}
            onChange={handleChange}
            error={!!errors.maxValue}
            helperText={errors.maxValue}
            disabled={isLoading}
            InputProps={{
              endAdornment: formData.unit ? (
                <InputAdornment position="end">{formData.unit}</InputAdornment>
              ) : null,
            }}
          />
        </Grid>

        <Grid
          item
          xs={12}
          sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            type="button"
            variant="outlined"
            onClick={onCancel}
            sx={{ mr: 1 }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading
              ? "Saving..."
              : isEdit
              ? "Update Sensor"
              : "Create Sensor"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SensorForm;
