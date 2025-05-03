// src/components/farm/FarmForm.jsx
import { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { SaveOutlined as SaveIcon } from "@mui/icons-material";

const FarmForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
  isEdit = false,
}) => {
  const theme = useTheme();

  // Form state with default values
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when field changes
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate the form
  const validateForm = () => {
    const newErrors = {};

    // Name validation (required)
    if (!formData.name.trim()) {
      newErrors.name = "Farm name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {/* Farm Name Field */}
      <Box sx={{ mb: 3 }}>
        <Typography
          component="label"
          htmlFor="farm-name"
          sx={{
            color: theme.palette.primary.main,
            display: "block",
            mb: 1,
            fontWeight: 500,
          }}
        >
          Farm Name
        </Typography>
        <TextField
          required
          fullWidth
          id="farm-name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
          placeholder="Enter farm name"
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

      {/* Description Field */}
      <Box sx={{ mb: 4 }}>
        <Typography
          component="label"
          htmlFor="farm-description"
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
          id="farm-description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={4}
          placeholder="Additional information about this farm..."
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
          {isLoading ? "Saving..." : isEdit ? "Update Farm" : "Create Farm"}
        </Button>
      </Box>
    </Box>
  );
};

export default FarmForm;
