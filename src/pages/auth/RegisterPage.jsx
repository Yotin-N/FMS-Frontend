// src/pages/auth/RegisterPage.jsx
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Paper,
  Grid,
  InputAdornment,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Alert,
  useTheme,
} from "@mui/material";
import {
  PersonAdd as PersonAddIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import useAuth from "../../hooks/useAuth";

const steps = ["Account Details", "Personal Information"];

const RegisterPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { register } = useAuth();

  // Stepper state
  const [activeStep, setActiveStep] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when field changes
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateStep = () => {
    const errors = {};

    if (activeStep === 0) {
      // Email validation
      if (!formData.email) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = "Email is invalid";
      }

      // Password validation
      if (!formData.password) {
        errors.password = "Password is required";
      } else if (formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
      }

      // Confirm password validation
      if (!formData.confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    } else if (activeStep === 1) {
      // First name validation
      if (!formData.firstName) {
        errors.firstName = "First name is required";
      }

      // Last name validation
      if (!formData.lastName) {
        errors.lastName = "Last name is required";
      }

      // Phone validation
      if (!formData.phoneNumber) {
        errors.phoneNumber = "Phone number is required";
      } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ""))) {
        errors.phoneNumber = "Please enter a valid 10-digit phone number";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep()) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const result = await register(formData);

      if (result.success) {
        navigate("/login", {
          state: { message: "Registration successful! Please log in." },
        });
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((show) => !show);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((show) => !show);
  };

  // Render account details form (step 0)
  const renderAccountDetailsForm = () => (
    <Box sx={{ width: "100%" }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={formData.email}
        onChange={handleChange}
        error={!!validationErrors.email}
        helperText={validationErrors.email}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type={showPassword ? "text" : "password"}
        id="password"
        autoComplete="new-password"
        value={formData.password}
        onChange={handleChange}
        error={!!validationErrors.password}
        helperText={validationErrors.password}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={togglePasswordVisibility}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        name="confirmPassword"
        label="Confirm Password"
        type={showConfirmPassword ? "text" : "password"}
        id="confirmPassword"
        autoComplete="new-password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={!!validationErrors.confirmPassword}
        helperText={validationErrors.confirmPassword}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={toggleConfirmPasswordVisibility}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          sx={{ py: 1.5, px: 3 }}
          className="hover-effect"
        >
          Next
        </Button>
      </Box>
    </Box>
  );

  // Render personal information form (step 1)
  const renderPersonalInfoForm = () => (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
            autoComplete="given-name"
            value={formData.firstName}
            onChange={handleChange}
            error={!!validationErrors.firstName}
            helperText={validationErrors.firstName}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="family-name"
            value={formData.lastName}
            onChange={handleChange}
            error={!!validationErrors.lastName}
            helperText={validationErrors.lastName}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="phoneNumber"
            label="Phone Number"
            name="phoneNumber"
            autoComplete="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            error={!!validationErrors.phoneNumber}
            helperText={validationErrors.phoneNumber}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button onClick={handleBack} sx={{ py: 1.5, px: 3 }}>
          Back
        </Button>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          sx={{ py: 1.5, px: 3 }}
          className="hover-effect"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: theme.palette.secondary.light,
        px: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "sm",
          width: "100%",
          borderRadius: 2,
          boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: theme.palette.primary.main }}>
          <PersonAddIcon />
        </Avatar>

        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Create Account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ width: "100%", mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1, width: "100%" }}
        >
          {activeStep === 0
            ? renderAccountDetailsForm()
            : renderPersonalInfoForm()}
        </Box>

        <Box sx={{ mt: 3, width: "100%", textAlign: "center" }}>
          <Link
            component={RouterLink}
            to="/login"
            variant="body2"
            sx={{ color: theme.palette.primary.main }}
          >
            Already have an account? Sign in
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
