// src/components/device/DeviceForm.jsx
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Grid,
  MenuItem,
  Divider,
  FormControlLabel,
  Switch,
  InputAdornment,
  Typography,
  Chip,
  useTheme,
} from "@mui/material";
import {
  SaveOutlined as SaveIcon,
  DevicesOutlined as DeviceIcon,
  LocationOnOutlined as LocationIcon,
  Router as RouterIcon,
  InfoOutlined as InfoIcon,
} from "@mui/icons-material";

const deviceTypes = [
  { value: "sensor-hub", label: "Sensor Hub" },
  { value: "controller", label: "Controller" },
  { value: "gateway", label: "Gateway" },
  { value: "weather-station", label: "Weather Station" },
  { value: "irrigation-controller", label: "Irrigation Controller" },
  { value: "camera", label: "Camera" },
];

const DeviceForm = ({
  initialData = {},
  farmName,
  onSubmit,
  onCancel,
  isLoading = false,
  isEdit = false,
}) => {
  const theme = useTheme();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    macAddress: "",
    deviceType: "sensor-hub",
    isActive: true,
    ...initialData,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when field changes
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation (required)
    if (!formData.name.trim()) {
      newErrors.name = "Device name is required";
    }

    // MAC address format validation (optional field)
    if (formData.macAddress && !validateMacAddress(formData.macAddress)) {
      newErrors.macAddress =
        "Invalid MAC address format (e.g., 00:1B:44:11:3A:B7)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateMacAddress = (mac) => {
    // Basic MAC address format validation (XX:XX:XX:XX:XX:XX)
    const regex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    return regex.test(mac);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography
              variant="h6"
              sx={{ color: theme.palette.primary.main, flexGrow: 1 }}
            >
              Device Information
            </Typography>
            <Chip
              label={`Farm: ${farmName}`}
              color="primary"
              variant="outlined"
              size="small"
            />
          </Box>
          <Divider sx={{ mb: 3 }} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Device Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            placeholder="Enter device name"
            disabled={isLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DeviceIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Device Type"
            name="deviceType"
            value={formData.deviceType}
            onChange={handleChange}
            disabled={isLoading}
          >
            {deviceTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="MAC Address"
            name="macAddress"
            value={formData.macAddress}
            onChange={handleChange}
            error={!!errors.macAddress}
            helperText={errors.macAddress || "Format: XX:XX:XX:XX:XX:XX"}
            placeholder="e.g., 00:1B:44:11:3A:B7"
            disabled={isLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <RouterIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Location on Farm"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="E.g., North Field, Greenhouse 2"
            disabled={isLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            placeholder="Additional information about this device..."
            disabled={isLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <InfoIcon
                    color="primary"
                    sx={{ alignSelf: "flex-start", mt: 1.5 }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
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
            label="Device is active"
          />
        </Grid>

        <Grid
          item
          xs={12}
          sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            type="button"
            variant="outlined"
            onClick={onCancel}
            sx={{ mr: 2 }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            disabled={isLoading}
          >
            {isLoading
              ? "Saving..."
              : isEdit
              ? "Update Device"
              : "Create Device"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DeviceForm;
