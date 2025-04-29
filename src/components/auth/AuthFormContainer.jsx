// File: src/components/auth/AuthFormContainer.jsx
import { Box, Container, Paper, useTheme } from "@mui/material";

const AuthFormContainer = ({ children, maxWidth = "xs" }) => {
  const theme = useTheme();

  return (
    <Container component="main" maxWidth={maxWidth}>
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
        <Box sx={{ width: "100%" }}>{children}</Box>
      </Paper>
    </Container>
  );
};

export default AuthFormContainer;
