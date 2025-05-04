/* eslint-disable no-unused-vars */
// src/components/device/DeviceForm.jsx
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
} from "@mui/material";
import { getFarms } from "../../services/api"; // Make sure this import matches your API structure

const DeviceForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
  isEdit = false,
}) => {
  // Initialize form data with only the fields needed for create/update
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    farmId: "",
    isActive: true,
  });

  const [farms, setFarms] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoadingFarms, setIsLoadingFarms] = useState(false);
  const [error, setError] = useState(null);

  // Load farms for the dropdown
  useEffect(() => {
    const loadFarms = async () => {
      setIsLoadingFarms(true);
      try {
        const response = await getFarms();
        setFarms(response.data || []);
      } catch (err) {
        setError("Failed to load farms. Please try again.");
        console.error("Error loading farms:", err);
      } finally {
        setIsLoadingFarms(false);
      }
    };

    loadFarms();
  }, []);

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      // Extract only the fields we need for the form
      const { name, description, farmId, isActive } = initialData;
      setFormData({
        name: name || "",
        description: description || "",
        farmId: farmId || "",
        isActive: isActive !== undefined ? isActive : true,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
      newErrors.name = "Device name is required";
    }

    // Only validate farmId for new devices, not for edits
    if (!isEdit && !formData.farmId) {
      newErrors.farmId = "Farm is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // When submitting for update, don't include farmId
    if (isEdit) {
      const { farmId, ...updateData } = formData;
      onSubmit(updateData);
    } else {
      onSubmit(formData);
    }
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
            Device Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            label="Device Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            disabled={isLoading}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            multiline
            rows={3}
            disabled={isLoading}
          />
        </Grid>

        {/* Only show farm selection for new devices */}
        {!isEdit && (
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              required
              label="Farm"
              name="farmId"
              value={formData.farmId}
              onChange={handleChange}
              error={!!errors.farmId}
              helperText={errors.farmId}
              disabled={isLoading || isLoadingFarms}
              InputProps={{
                endAdornment: isLoadingFarms ? (
                  <CircularProgress size={20} />
                ) : null,
              }}
            >
              <MenuItem value="" disabled>
                Select a farm
              </MenuItem>
              {farms.map((farm) => (
                <MenuItem key={farm.id} value={farm.id}>
                  {farm.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        )}

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
