// src/styles/theme.js - Updated theme
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1e8e3e", // Slightly more vibrant green
      light: "#66bb6a",
      dark: "#0d652d",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ecf8ee",
      light: "#f8fdf9",
      dark: "#c8e6c9",
      contrastText: "#0d652d",
    },
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
    text: {
      primary: "#212121",
      secondary: "#5f6368",
    },
    error: {
      main: "#d32f2f",
      light: "#ef5350",
    },
    warning: {
      main: "#f57c00",
      light: "#ffb74d",
    },
    info: {
      main: "#0288d1",
      light: "#4fc3f7",
    },
    success: {
      main: "#2e7d32",
      light: "#66bb6a",
    },
    divider: "rgba(0, 0, 0, 0.09)",
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: "2.5rem",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.75rem",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 16px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          },
        },
        contained: {
          boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(20px)",
        },
        elevation1: {
          boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
        },
        elevation3: {
          boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
  shadows: [
    "none",
    "0 2px 4px rgba(0,0,0,0.05)",
    "0 3px 6px rgba(0,0,0,0.07)",
    "0 5px 12px rgba(0,0,0,0.09)",
    // ... more shadow levels
  ],
});

export default theme;
