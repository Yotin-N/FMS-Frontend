// src/pages/auth/GoogleCallbackHandler.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  Paper,
  Alert,
  useTheme,
} from "@mui/material";
import { googleOAuth } from "../../services/authService";
import useAuth from "../../hooks/useAuth";

const GoogleCallbackHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { isAuthenticated } = useAuth();

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [manualStepsNeeded, setManualStepsNeeded] = useState(false);
  const [authCheckCount, setAuthCheckCount] = useState(0);

  // Parse the authorization code from the URL
  const getAuthCode = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("code");
  };

  // Complete the Google OAuth flow
  const completeGoogleAuth = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Attempt to manually complete the OAuth flow
      await googleOAuth.completeGoogleAuth();

      // Redirect to dashboard after successful authentication
      localStorage.removeItem("googleLoginPending");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error completing Google authentication:", err);
      setError("Failed to complete Google authentication. Please try again.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const completeAuth = async () => {
      // If user is already authenticated, redirect to dashboard
      if (isAuthenticated) {
        localStorage.removeItem("googleLoginPending");
        navigate("/dashboard");
        return;
      }

      // Check if this is a Google OAuth callback
      const authCode = getAuthCode();

      if (authCode) {
        try {
          // Try to process the callback with the auth code
          await googleOAuth.handleCallback(authCode);
          navigate("/dashboard");
        } catch (err) {
          console.error("Error handling Google callback:", err);
          // If the backend doesn't redirect properly, offer manual completion
          setManualStepsNeeded(true);
          setIsLoading(false);
        }
      } else {
        // Check if we have a pending Google login
        const isPending = localStorage.getItem("googleLoginPending") === "true";

        if (isPending) {
          // If we've already tried multiple times without success, offer manual completion
          if (authCheckCount > 3) {
            setManualStepsNeeded(true);
            setIsLoading(false);
          } else {
            // Try to check the OAuth status
            try {
              // Check if the user has completed authentication on the backend
              const status = await googleOAuth.checkGoogleAuthStatus();

              if (status && status.authenticated) {
                // If authentication is complete, redirect to dashboard
                localStorage.removeItem("googleLoginPending");
                navigate("/dashboard");
              } else {
                // Increment the check count and try again after a delay
                setAuthCheckCount((prev) => prev + 1);
                setTimeout(() => {
                  // Force re-render to check again
                  setIsLoading((prev) => !prev);
                }, 2000);
              }
            } catch (err) {
              console.error("Error checking Google auth status:", err);
              setManualStepsNeeded(true);
              setIsLoading(false);
            }
          }
        } else {
          // No pending Google login, redirect to login page
          navigate("/login");
        }
      }
    };

    completeAuth();
  }, [isAuthenticated, navigate, authCheckCount, isLoading]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: theme.palette.secondary.light,
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
          width: "90%",
          borderRadius: 2,
          boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
        }}
      >
        {isLoading ? (
          <>
            <CircularProgress color="primary" size={60} thickness={4} />
            <Typography variant="h6" sx={{ mt: 3, textAlign: "center" }}>
              Completing Google sign-in...
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 2, textAlign: "center" }}
            >
              Please wait while we authenticate you with Google.
            </Typography>
          </>
        ) : manualStepsNeeded ? (
          <>
            <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
              Almost there!
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: "100%", mb: 3 }}>
                {error}
              </Alert>
            )}

            <Typography variant="body1" sx={{ mb: 3, textAlign: "center" }}>
              Google authentication is in progress but needs to be completed.
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 4, textAlign: "center" }}
            >
              If you've already authorized the application on Google, click the
              button below to complete the sign-in process.
            </Typography>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="outlined" onClick={() => navigate("/login")}>
                Back to Login
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={completeGoogleAuth}
                disabled={isLoading}
              >
                Complete Google Sign-in
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Typography
              variant="h5"
              color="error"
              sx={{ mb: 3, textAlign: "center" }}
            >
              Authentication Error
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, textAlign: "center" }}>
              There was a problem completing the Google authentication process.
            </Typography>

            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default GoogleCallbackHandler;
