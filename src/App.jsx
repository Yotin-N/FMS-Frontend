// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { AuthProvider } from "./context/AuthContext";
import useAuth from "./hooks/useAuth";

// Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import FarmListPage from "./pages/farm/FarmListPage";
import DeviceListPage from "./pages/device/DeviceListPage";
import NotFoundPage from "./pages/NotFoundPage";
import GoogleCallbackHandler from "./pages/auth/GoogleCallbackHandler";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Auth Routes - Redirect to dashboard if already authenticated
const AuthRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

// App Root Component
function AppRoot() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Routes>
        {/* Default route - redirect to login or dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            <AuthRoute>
              <LoginPage />
            </AuthRoute>
          }
        />
        <Route
          path="/register"
          element={
            <AuthRoute>
              <RegisterPage />
            </AuthRoute>
          }
        />

        {/* Google OAuth Callback Route */}
        <Route
          path="/auth/google/callback"
          element={<GoogleCallbackHandler />}
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farms/*"
          element={
            <ProtectedRoute>
              <FarmListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/devices/*"
          element={
            <ProtectedRoute>
              <DeviceListPage />
            </ProtectedRoute>
          }
        />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Box>
  );
}

// Main App component with Providers
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoot />
      </AuthProvider>
    </Router>
  );
}

export default App;
