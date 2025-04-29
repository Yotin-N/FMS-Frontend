import { useState } from "react";

import { Link as RouterLink, useNavigate } from "react-router-dom";

import {
  Avatar,
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link,
  Grid,
  Paper,
  IconButton,
  InputAdornment,
  useTheme,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";

import PersonAddIcon from "@mui/icons-material/PersonAdd";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import Visibility from "@mui/icons-material/Visibility";

import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { registerUser } from "../services/api";

const steps = ["Account Details", "Personal Information"];

const RegisterPage = () => {
  const navigate = useNavigate();

  const theme = useTheme();

  const [activeStep, setActiveStep] = useState(0);

  const [formData, setFormData] = useState({
    email: "",

    password: "",

    confirmPassword: "",

    firstName: "",

    lastName: "",

    phoneNumber: "",
  });

  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,

      [name]: value,
    }));

    // Clear error when user starts typing

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,

        [name]: "",
      }));
    }
  };

  const validateStep = () => {
    const newErrors = {};

    if (activeStep === 0) {
      // Email validation

      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email address is invalid";
      }

      // Password validation

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }

      // Confirm password validation

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    } else if (activeStep === 1) {
      // First name validation

      if (!formData.firstName) {
        newErrors.firstName = "First name is required";
      }

      // Last name validation

      if (!formData.lastName) {
        newErrors.lastName = "Last name is required";
      }

      // Phone validation

      if (!formData.phoneNumber) {
        newErrors.phoneNumber = "Phone number is required";
      } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ""))) {
        newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep()) return;

    setIsSubmitting(true);

    try {
      // Call the API service

      const response = await registerUser(formData);

      console.log("Registration successful:", response);

      // Redirect to login with success message

      navigate("/login", {
        state: { message: "Registration successful! Please log in." },
      });
    } catch (error) {
      console.error("Registration failed:", error);

      setErrors({
        form: "Registration failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
        error={!!errors.email}
        helperText={errors.email}
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
        error={!!errors.password}
        helperText={errors.password}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleTogglePassword}
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
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleToggleConfirmPassword}
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
            error={!!errors.firstName}
            helperText={errors.firstName}
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
            error={!!errors.lastName}
            helperText={errors.lastName}
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
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
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
        >
          {isSubmitting ? "Registering..." : "Register"}
        </Button>
      </Box>
    </Box>
  );

  return (
    <Container component="main" maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          mt: 8,

          p: 4,

          display: "flex",

          flexDirection: "column",

          alignItems: "center",

          borderRadius: 2,

          border: `1px solid ${theme.palette.secondary.light}`,
        }}
      >
        <Box sx={{ mb: 2, width: "100%" }}>
          <IconButton
            component={RouterLink}
            to="/"
            sx={{ p: 0, color: theme.palette.primary.main }}
          >
            <ArrowBackIcon />

            <Typography variant="body2" sx={{ ml: 1 }}>
              Back to Home
            </Typography>
          </IconButton>
        </Box>

        <Avatar sx={{ m: 1, bgcolor: theme.palette.primary.main }}>
          <PersonAddIcon />
        </Avatar>

        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Create Account
        </Typography>

        {errors.form && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {errors.form}
          </Typography>
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
    </Container>
  );
};

export default RegisterPage;
