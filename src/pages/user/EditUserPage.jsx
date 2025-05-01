// src/pages/user/EditUserPage.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  MenuItem,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  IconButton,
  LinearProgress,
  Snackbar,
  Alert,
  Skeleton,
  useTheme,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  LockReset as LockResetIcon,
} from "@mui/icons-material";
import { getUserById, updateUser, resetUserPassword } from "../../services/api";
import useAuth from "../../hooks/useAuth";

const roles = [
  { value: "ADMIN", label: "Administrator" },
  { value: "MANAGER", label: "Manager" },
  { value: "USER", label: "Regular User" },
];

const EditUserPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user: currentUser } = useAuth();

  // State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    status: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [originalRole, setOriginalRole] = useState("");

  // Load user data on component mount
  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const userData = await getUserById(id);

        if (!userData) {
          throw new Error("User not found");
        }

        setFormData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          role: userData.role || "USER",
          status: userData.status || "ACTIVE",
        });

        setOriginalRole(userData.role || "USER");
      } catch (err) {
        console.error("Error loading user:", err);
        setError("Failed to load user. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
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

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Prevent users from increasing their own role (security measure)
    if (
      id === currentUser?.id &&
      formData.role !== originalRole &&
      getRoleWeight(formData.role) > getRoleWeight(originalRole)
    ) {
      newErrors.role = "You cannot increase your own role permissions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper to determine role hierarchy
  const getRoleWeight = (role) => {
    switch (role) {
      case "ADMIN":
        return 3;
      case "MANAGER":
        return 2;
      case "USER":
        return 1;
      default:
        return 0;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await updateUser(id, formData);
      setSuccess("User updated successfully!");

      // If the current user is updating themselves and changed their role,
      // they might need to reload to refresh permissions
      if (id === currentUser?.id && formData.role !== originalRole) {
        setSuccess(
          "Your role has been updated. The application will reload in a moment."
        );
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Failed to update user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await resetUserPassword(id);
      setSuccess("Password reset email has been sent to the user");
    } catch (err) {
      console.error("Error resetting password:", err);
      setError("Failed to reset password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close snackbar alerts
  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setError(null);
    setSuccess(null);
  };

  const isEditingSelf = id === currentUser?.id;

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton
          onClick={() => navigate("/dashboard/users")}
          sx={{ mr: 2 }}
          color="primary"
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          {isLoading
            ? "Loading User..."
            : `Edit User: ${formData.firstName} ${formData.lastName}`}
        </Typography>
      </Box>

      {/* Loading Indicator */}
      {isSubmitting && <LinearProgress sx={{ mb: 3 }} />}

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

      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
        }}
      >
        {isLoading ? (
          <Box sx={{ p: 2 }}>
            <Skeleton variant="rectangular" height={50} sx={{ mb: 2 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Skeleton variant="rectangular" height={56} />
              </Grid>
              <Grid item xs={12}>
                <Skeleton variant="rectangular" height={56} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Skeleton variant="rectangular" height={56} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Skeleton variant="rectangular" height={56} />
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, color: theme.palette.primary.main }}
                >
                  User Details
                </Typography>
                <Divider sx={{ mb: 3 }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  disabled={isSubmitting}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  disabled={isSubmitting}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  disabled={isSubmitting}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  error={!!errors.role}
                  helperText={errors.role}
                >
                  {roles.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      {role.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl component="fieldset" disabled={isSubmitting}>
                  <FormLabel component="legend">Status</FormLabel>
                  <RadioGroup
                    row
                    name="status"
                    value={formData.status}
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
                      disabled={isEditingSelf} // Don't allow deactivating own account
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{ mt: 2, mb: 2, color: theme.palette.primary.main }}
                >
                  Security
                </Typography>
                <Divider sx={{ mb: 3 }} />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<LockResetIcon />}
                  onClick={handleResetPassword}
                  disabled={isSubmitting}
                >
                  Reset Password
                </Button>
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ mt: 1, color: theme.palette.text.secondary }}
                >
                  This will send a password reset email to the user
                </Typography>
              </Grid>

              <Grid
                item
                xs={12}
                sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}
              >
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => navigate("/dashboard/users")}
                  sx={{ mr: 2 }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default EditUserPage;
