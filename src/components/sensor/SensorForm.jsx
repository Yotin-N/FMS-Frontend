// src/components/sensor/SensorForm.jsx - Updated to match FarmForm layout
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
  MenuItem,
  InputAdornment,
  useTheme,
} from "@mui/material";
import { SaveOutlined as SaveIcon } from "@mui/icons-material";
import { SensorType } from "../../constant/sensorTypes";

const SensorForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
  isEdit = false,
}) => {
  const theme = useTheme();

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
      console.error("Error submitting form:", err);
    }
  };

  // Get unit placeholder based on sensor type
  const getUnitPlaceholder = (type) => {
    const unitMap = {
      PH: "pH",
      TEMP: "°C",
      Salinity: "ppt",
      DO: "mg/L",
      AMMONIA: "PPM",
      NO2: "",
      Turbidity: "cm"
    };

    return unitMap[type] || "";
  };



  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {/* Sensor Name Field */}
      <Box sx={{ mb: 3 }}>
        <Typography
          component="label"
          htmlFor="sensor-name"
          sx={{
            color: theme.palette.primary.main,
            display: "block",
            mb: 1,
            fontWeight: 500,
          }}
        >
          Sensor Name
        </Typography>
        <TextField
          required
          fullWidth
          id="sensor-name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
          placeholder="Enter sensor name"
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

      {/* Serial Number Field */}
      <Box sx={{ mb: 3 }}>
        <Typography
          component="label"
          htmlFor="sensor-serialNumber"
          sx={{
            color: theme.palette.primary.main,
            display: "block",
            mb: 1,
            fontWeight: 500,
          }}
        >
          Serial Number
        </Typography>
        <TextField
          required
          fullWidth
          id="sensor-serialNumber"
          name="serialNumber"
          value={formData.serialNumber}
          onChange={handleChange}
          error={!!errors.serialNumber}
          helperText={errors.serialNumber}
          placeholder="Enter serial number"
          disabled={isLoading || (isEdit && initialData.serialNumber)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 1,
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.main,
                borderWidth: 2,
              },
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: errors.serialNumber
                ? theme.palette.error.main
                : "#e0e0e0",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: errors.serialNumber
                ? theme.palette.error.main
                : theme.palette.primary.light,
            },
          }}
          variant="outlined"
        />
      </Box>

      {/* Type and Unit in a row */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Typography
            component="label"
            htmlFor="sensor-type"
            sx={{
              color: theme.palette.primary.main,
              display: "block",
              mb: 1,
              fontWeight: 500,
            }}
          >
            Sensor Type
          </Typography>
          <TextField
            select
            fullWidth
            id="sensor-type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            error={!!errors.type}
            helperText={errors.type}
            disabled={isLoading || (isEdit && initialData.type)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 2,
                },
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: errors.type ? theme.palette.error.main : "#e0e0e0",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: errors.type
                  ? theme.palette.error.main
                  : theme.palette.primary.light,
              },
            }}
            variant="outlined"
          >
            {Object.entries(SensorType).map(([key, value]) => (
              <MenuItem key={key} value={key}>
                {value}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography
            component="label"
            htmlFor="sensor-unit"
            sx={{
              color: theme.palette.primary.main,
              display: "block",
              mb: 1,
              fontWeight: 500,
            }}
          >
            Unit
          </Typography>
          <TextField
            fullWidth
            id="sensor-unit"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            placeholder={getUnitPlaceholder(formData.type)}
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
      </Box>

      {/* Min/Max Values in a row */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Typography
            component="label"
            htmlFor="sensor-minValue"
            sx={{
              color: theme.palette.primary.main,
              display: "block",
              mb: 1,
              fontWeight: 500,
            }}
          >
            Minimum Value
          </Typography>
          <TextField
            fullWidth
            id="sensor-minValue"
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
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 2,
                },
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: errors.minValue
                  ? theme.palette.error.main
                  : "#e0e0e0",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: errors.minValue
                  ? theme.palette.error.main
                  : theme.palette.primary.light,
              },
            }}
            variant="outlined"
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography
            component="label"
            htmlFor="sensor-maxValue"
            sx={{
              color: theme.palette.primary.main,
              display: "block",
              mb: 1,
              fontWeight: 500,
            }}
          >
            Maximum Value
          </Typography>
          <TextField
            fullWidth
            id="sensor-maxValue"
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
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 2,
                },
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: errors.maxValue
                  ? theme.palette.error.main
                  : "#e0e0e0",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: errors.maxValue
                  ? theme.palette.error.main
                  : theme.palette.primary.light,
              },
            }}
            variant="outlined"
          />
        </Box>
      </Box>

      {/* Is Active Switch */}
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
          label={
            <Typography
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 500,
              }}
            >
              Sensor is active
            </Typography>
          }
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
          startIcon={<SaveIcon />}
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
            ? "Update Sensor"
            : "Create Sensor"}
        </Button>
      </Box>
    </Box>
  );
};

export default SensorForm;