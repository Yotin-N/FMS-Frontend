// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Box, CircularProgress, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { AuthProvider } from "./context/AuthContext";
import useAuth from "./hooks/useAuth";
import Navbar from "./components/layout/Navbar";
import theme from "./styles/theme";

// Lazy loaded pages for better performance
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const DashboardPage = lazy(() => import("./pages/dashboard/DashboardPage"));
const FarmListPage = lazy(() => import("./pages/farm/FarmListPage"));
const DeviceListPage = lazy(() => import("./pages/device/DeviceListPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const GoogleCallbackHandler = lazy(() =>
  import("./pages/auth/GoogleCallbackHandler")
);
const UserListPage = lazy(() => import("./pages/user/UserListPage"));
const CreateUserPage = lazy(() => import("./pages/user/CreateUserPage"));
const EditUserPage = lazy(() => import("./pages/user/EditUserPage"));

// Loading component
const PageLoader = () => (
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

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Auth Routes - Redirect to dashboard if already authenticated
const AuthRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

// Route Configuration
const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
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

          {/* User Management Routes */}
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UserListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/users/create"
            element={
              <ProtectedRoute>
                <CreateUserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/users/edit/:id"
            element={
              <ProtectedRoute>
                <EditUserPage />
              </ProtectedRoute>
            }
          />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
};

// Main App Component
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          {/* Navbar is outside the main content area */}
          <Navbar />

          {/* Main content area with top padding for navbar */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              paddingTop: 0,
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <AppRoutes />
          </Box>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
