// src/pages/auth/LoginPage.jsx
import { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
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
  Divider,
  Alert,
  useTheme,
  Dialog,
} from "@mui/material";
import {
  LockOutlined as LockOutlinedIcon,
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
} from "@mui/icons-material";
import useAuth from "../../hooks/useAuth";
import { googleOAuth } from "../../services/authService";

const LoginPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const authError = localStorage.getItem("authError");
    if (authError) {
      setError(authError);
      localStorage.removeItem("authError");
    }

    if (location.state?.error) {
      setError(location.state.error);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

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

  const validateForm = () => {
    const errors = {};

    // Email validation
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const result = await login(formData);

      if (result.success) {
        navigate("/dashboard");
      } else {
        // Only update the error state of the input field
        // No error message text is displayed to avoid layout shift
        setValidationErrors({
          email: " ", // Just set a space to trigger the error state
          password: " ",
        });
        // Store the real error for the alert
        setError(result.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    setError("");

    try {
      // Store the intent to use Google login in localStorage
      localStorage.setItem("googleLoginPending", "true");

      // Use the authService to start Google login
      googleOAuth.startGoogleLogin();
    } catch (err) {
      console.error("Error initiating Google login:", err);
      setError("Failed to start Google login. Please try again later.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((show) => !show);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
        overflow: "hidden", // Hide any overflows
        p: 2,
        backgroundColor: theme.palette.secondary.light, // Light background
      }}
    >
      <Dialog
        open={true}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          elevation: 8,
          sx: {
            borderRadius: 2,
            overflow: "visible", // Allow animation effects
            maxWidth: "400px",
            mx: "auto",
          },
        }}
      >
        <Box
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: theme.palette.primary.main }}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Sign in
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              error={!!validationErrors.email}
              helperText={
                validationErrors.email && validationErrors.email !== " "
                  ? validationErrors.email
                  : ""
              }
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={!!validationErrors.password}
              helperText={
                validationErrors.password && validationErrors.password !== " "
                  ? validationErrors.password
                  : ""
              }
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

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={isSubmitting}
              className="hover-effect"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
              sx={{ mb: 2, py: 1.5 }}
              className="hover-effect"
            >
              Continue with Google
            </Button>
            <Button
              component={RouterLink}
              to="/register"
              fullWidth
              variant="outlined"
              sx={{ color: theme.palette.primary.main }}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export default LoginPage;
