/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  MenuItem,
  CircularProgress,
  Typography,
  Divider,
  Alert,
  useTheme,
} from "@mui/material";
import { getFarms } from "../../services/api"; // Make sure this import matches your API structure

const DeviceForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
  isEdit = false,
}) => {
  const theme = useTheme();

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
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Device Name */}
      <Box sx={{ mb: 3 }}>
        <Typography
          component="label"
          htmlFor="device-name"
          sx={{
            color: theme.palette.primary.main,
            display: "block",
            mb: 1,
            fontWeight: 500,
          }}
        >
          Device Name
        </Typography>
        <TextField
          required
          fullWidth
          id="device-name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
          placeholder="Enter device name"
          disabled={isLoading}
          autoFocus
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 1,
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.main,
                borderWidth: 2,
              },
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: errors.name ? theme.palette.error.main : "#e0e0e0",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: errors.name
                ? theme.palette.error.main
                : theme.palette.primary.light,
            },
          }}
          variant="outlined"
        />
      </Box>

      {/* Description */}
      <Box sx={{ mb: 3 }}>
        <Typography
          component="label"
          htmlFor="device-description"
          sx={{
            color: theme.palette.primary.main,
            display: "block",
            mb: 1,
            fontWeight: 500,
          }}
        >
          Description
        </Typography>
        <TextField
          fullWidth
          id="device-description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={3}
          placeholder="Additional information about this device..."
          disabled={isLoading}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 1,
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.main,
                borderWidth: 2,
              },
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#e0e0e0",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.light,
            },
          }}
          variant="outlined"
        />
      </Box>

      {/* Farm Selection (only for create) */}
      {!isEdit && (
        <Box sx={{ mb: 3 }}>
          <Typography
            component="label"
            htmlFor="device-farm"
            sx={{
              color: theme.palette.primary.main,
              display: "block",
              mb: 1,
              fontWeight: 500,
            }}
          >
            Farm
          </Typography>
          <TextField
            select
            fullWidth
            required
            id="device-farm"
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
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 2,
                },
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: errors.farmId ? theme.palette.error.main : "#e0e0e0",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: errors.farmId
                  ? theme.palette.error.main
                  : theme.palette.primary.light,
              },
            }}
            variant="outlined"
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
        </Box>
      )}

      {/* Active Switch */}
      <Box sx={{ mb: 4 }}>
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
      </Box>

      {/* Buttons */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          sx={{
            color: theme.palette.primary.main,
            border: "none",
            padding: "10px 24px",
            borderRadius: 1,
            textTransform: "none",
            fontWeight: 500,
            fontSize: "16px",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
          sx={{
            padding: "10px 24px",
            borderRadius: 1,
            textTransform: "none",
            fontWeight: 500,
            fontSize: "16px",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
            },
          }}
        >
          {isLoading
            ? "Saving..."
            : isEdit
            ? "Update Device"
            : "Create Device"}
        </Button>
      </Box>
    </Box>
  );
};

export default DeviceForm;
