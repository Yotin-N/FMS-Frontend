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

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Auth Routes - Redirect to dashboard if already authenticated
const AuthRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Suspense fallback={<PageLoader />}>
              <ScrollToTop />
              <Routes>
                {/* Default route - redirect to dashboard */}
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />

                {/* Auth Routes (outside dashboard layout) */}
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

                {/* Google OAuth Callback */}
                <Route
                  path="/auth/google/callback"
                  element={<GoogleCallbackHandler />}
                />

                {/* ALL protected pages under a SINGLE parent route */}
                <Route
                  path="/dashboard/*"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Not Found */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </Box>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
