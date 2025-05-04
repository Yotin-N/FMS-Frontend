// src/components/user/UserForm.jsx
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  InputAdornment,
  IconButton,
  useTheme,
  Grid,
} from "@mui/material";
import {
  SaveOutlined as SaveIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";

const UserForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
  isEdit = false,
}) => {
  const theme = useTheme();

  // Form state with default values
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    role: "USER",
    status: "ACTIVE",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      const formattedData = { ...initialData };

      // Handle status/isActive conversion
      if (
        initialData.status === undefined &&
        initialData.isActive !== undefined
      ) {
        formattedData.status =
          initialData.isActive !== false ? "ACTIVE" : "INACTIVE";
      }

      setFormData(formattedData);
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

    // First name validation
    if (!formData.firstName?.trim()) {
      newErrors.firstName = "First name is required";
    }

    // Last name validation
    if (!formData.lastName?.trim()) {
      newErrors.lastName = "Last name is required";
    }

    // Password validation - only required for new users
    if (!isEdit && !formData.password) {
      newErrors.password = "Password is required for new users";
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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

    // Only include editable fields in the submission
    const submitData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      role: formData.role,
    };

    // Handle password specially - only include if provided
    if (formData.password && formData.password.trim() !== "") {
      submitData.password = formData.password;
    }

    // Convert status to isActive boolean
    submitData.isActive = formData.status === "ACTIVE";

    onSubmit(submitData);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {/* Name Fields - First and Last on same line */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <Typography
            component="label"
            htmlFor="user-firstName"
            sx={{
              color: theme.palette.primary.main,
              display: "block",
              mb: 1,
              fontWeight: 500,
            }}
          >
            First Name
          </Typography>
          <TextField
            required
            fullWidth
            id="user-firstName"
            name="firstName"
            value={formData.firstName || ""}
            onChange={handleChange}
            error={!!errors.firstName}
            helperText={errors.firstName}
            placeholder="Enter first name"
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
                borderColor: errors.firstName
                  ? theme.palette.error.main
                  : "#e0e0e0",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: errors.firstName
                  ? theme.palette.error.main
                  : theme.palette.primary.light,
              },
            }}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={6}>
          <Typography
            component="label"
            htmlFor="user-lastName"
            sx={{
              color: theme.palette.primary.main,
              display: "block",
              mb: 1,
              fontWeight: 500,
            }}
          >
            Last Name
          </Typography>
          <TextField
            required
            fullWidth
            id="user-lastName"
            name="lastName"
            value={formData.lastName || ""}
            onChange={handleChange}
            error={!!errors.lastName}
            helperText={errors.lastName}
            placeholder="Enter last name"
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
                borderColor: errors.lastName
                  ? theme.palette.error.main
                  : "#e0e0e0",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: errors.lastName
                  ? theme.palette.error.main
                  : theme.palette.primary.light,
              },
            }}
            variant="outlined"
          />
        </Grid>
      </Grid>

      {/* Password Field */}
      <Box sx={{ mb: 3 }}>
        <Typography
          component="label"
          htmlFor="user-password"
          sx={{
            color: theme.palette.primary.main,
            display: "block",
            mb: 1,
            fontWeight: 500,
          }}
        >
          {isEdit ? "New Password (leave blank to keep current)" : "Password"}
        </Typography>
        <TextField
          fullWidth
          id="user-password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password || ""}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          placeholder={isEdit ? "Enter new password" : "Enter password"}
          disabled={isLoading}
          required={!isEdit}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 1,
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.main,
                borderWidth: 2,
              },
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: errors.password
                ? theme.palette.error.main
                : "#e0e0e0",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: errors.password
                ? theme.palette.error.main
                : theme.palette.primary.light,
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={togglePasswordVisibility}
                  edge="end"
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
      </Box>

      {/* Role and Status Fields - on same line */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6}>
          <Typography
            component="label"
            htmlFor="user-role"
            sx={{
              color: theme.palette.primary.main,
              display: "block",
              mb: 1,
              fontWeight: 500,
            }}
          >
            Role
          </Typography>
          <TextField
            select
            fullWidth
            id="user-role"
            name="role"
            value={formData.role || "USER"}
            onChange={handleChange}
            disabled={isLoading}
            SelectProps={{
              native: true,
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
                borderColor: "#e0e0e0",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.light,
              },
            }}
            variant="outlined"
          >
            <option value="ADMIN">Administrator</option>
            <option value="USER">Regular User</option>
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <Typography
            component="label"
            sx={{
              color: theme.palette.primary.main,
              display: "block",
              mb: 1,
              fontWeight: 500,
            }}
          >
            Status
          </Typography>
          <FormControl component="fieldset" fullWidth disabled={isLoading}>
            <RadioGroup
              row
              name="status"
              value={formData.status || "ACTIVE"}
              onChange={handleChange}
            >
              <FormControlLabel
                value="ACTIVE"
                control={<Radio color="primary" />}
                label="Active"
              />
              <FormControlLabel
                value="INACTIVE"
                control={<Radio color="primary" />}
                label="Inactive"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>

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
          {isLoading ? "Saving..." : isEdit ? "Update User" : "Create User"}
        </Button>
      </Box>
    </Box>
  );
};

export default UserForm;
