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
  Collapse,
  Fade,
  CircularProgress,
  useTheme,
} from "@mui/material";
import {
  PersonAdd as PersonAddIcon,
  Visibility,
  VisibilityOff,
  CheckCircleOutline,
} from "@mui/icons-material";
import useAuth from "../../hooks/useAuth";

const steps = ["Account Details", "Personal Info"];

const RegisterPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { register } = useAuth();

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateStep = () => {
    const errors = {};
    if (activeStep === 0) {
      if (!formData.email) errors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        errors.email = "Invalid email";

      if (!formData.password) errors.password = "Password required";
      else if (formData.password.length < 8)
        errors.password = "Min 8 characters";

      if (!formData.confirmPassword)
        errors.confirmPassword = "Please confirm password";
      else if (formData.confirmPassword !== formData.password)
        errors.confirmPassword = "Passwords do not match";
    } else {
      if (!formData.firstName) errors.firstName = "First name required";
      if (!formData.lastName) errors.lastName = "Last name required";
      if (!formData.phoneNumber) errors.phoneNumber = "Phone number required";
      else if (!/^\d{10}$/.test(formData.phoneNumber))
        errors.phoneNumber = "Invalid phone";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setIsSubmitting(true);
    setError("");
    try {
      const result = await register(formData);
      if (result.success) {
        setSuccess(true);
        setTimeout(
          () =>
            navigate("/login", {
              state: { message: "Registration successful!" },
            }),
          2000
        );
      } else {
        setError(result.message || "Registration failed");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: theme.palette.grey[100],
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          maxWidth: 480,
          width: "100%",
          borderRadius: 3,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box textAlign="center">
          <Avatar
            sx={{ bgcolor: theme.palette.primary.main, mx: "auto", mb: 1 }}
          >
            <PersonAddIcon />
          </Avatar>
          <Typography variant="h5" mb={2}>
            Create Your Account
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Collapse in={!!error}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        </Collapse>

        <Collapse in={success}>
          <Alert
            icon={<CheckCircleOutline fontSize="inherit" />}
            severity="success"
            sx={{ mb: 2 }}
          >
            Registration Successful!
          </Alert>
        </Collapse>

        <form onSubmit={handleSubmit}>
          {activeStep === 0 ? (
            <>
              <TextField
                label="Email"
                name="email"
                fullWidth
                margin="normal"
                value={formData.email}
                onChange={handleChange}
                error={!!validationErrors.email}
                helperText={validationErrors.email}
              />
              <TextField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                value={formData.password}
                onChange={handleChange}
                error={!!validationErrors.password}
                helperText={validationErrors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((s) => !s)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!validationErrors.confirmPassword}
                helperText={validationErrors.confirmPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword((s) => !s)}
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3 }}
                onClick={handleNext}
              >
                Next
              </Button>
            </>
          ) : (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="First Name"
                    name="firstName"
                    fullWidth
                    value={formData.firstName}
                    onChange={handleChange}
                    error={!!validationErrors.firstName}
                    helperText={validationErrors.firstName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Last Name"
                    name="lastName"
                    fullWidth
                    value={formData.lastName}
                    onChange={handleChange}
                    error={!!validationErrors.lastName}
                    helperText={validationErrors.lastName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Phone Number"
                    name="phoneNumber"
                    fullWidth
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    error={!!validationErrors.phoneNumber}
                    helperText={validationErrors.phoneNumber}
                  />
                </Grid>
              </Grid>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
              >
                <Button onClick={handleBack}>Back</Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting || success}
                  endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                >
                  {isSubmitting ? "Registering..." : "Register"}
                </Button>
              </Box>
            </>
          )}
        </form>

        <Box mt={4} textAlign="center">
          <Link
            component={RouterLink}
            to="/login"
            variant="body2"
            underline="hover"
          >
            ← Back to Sign In
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
