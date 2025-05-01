// src/pages/NotFoundPage.jsx
import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const NotFoundPage = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          py: 5,
        }}
      >
        <ErrorOutlineIcon
          sx={{ fontSize: 120, color: theme.palette.primary.main, mb: 4 }}
        />

        <Typography variant="h1" component="h1" sx={{ mb: 2, fontWeight: 600 }}>
          404
        </Typography>

        <Typography
          variant="h4"
          component="h2"
          sx={{ mb: 3, color: theme.palette.text.secondary }}
        >
          Page Not Found
        </Typography>

        <Typography variant="body1" sx={{ mb: 4, maxWidth: 480 }}>
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </Typography>

        <Button
          component={RouterLink}
          to="/dashboard"
          variant="contained"
          color="primary"
          size="large"
          startIcon={<ArrowBackIcon />}
          sx={{ py: 1.5, px: 4 }}
          className="hover-effect"
        >
          Back to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
