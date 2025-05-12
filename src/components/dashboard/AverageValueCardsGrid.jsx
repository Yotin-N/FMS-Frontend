  // src/components/dashboard/AverageValueCardsGrid.jsx
import { Box, Card, CardContent, Grid, Typography, useTheme } from "@mui/material";

const AverageValueCardsGrid = ({ averages }) => {
  const theme = useTheme();

  // Helper to get color for each sensor type
  const getSensorTypeColor = (type) => {
    const colorMap = {
      pH: "#4caf50",
      DO: "#ff9800",
      Temperature: "#f44336",
      TempA: "#f44336",
      TempB: "#f44336",
      TempC: "#f44336",
      SALT: "#2196f3",
      Saltlinity: "#2196f3",
      NHx: "#9c27b0",
      NH3: "#9c27b0",
      EC: "#00bcd4",
      TDS: "#8bc34a",
      ORP: "#3f51b5",
      NO2: "#673ab7",
      NO: "#673ab7",
    };
    return colorMap[type] || theme.palette.grey[500];
  };

  // Safely check if averages exist and have entries
  const hasAverages = averages && typeof averages === 'object' && Object.keys(averages).length > 0;

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        width: "100%",
      }}
    >
      <CardContent>
        <Grid container spacing={2} sx={{ width: "100%" }}>
          {hasAverages ? (
            Object.entries(averages).map(([type, data]) => {
              // Ensure data is an object and has the expected properties
              const average = typeof data === 'object' && data !== null ? data.average : null;
              const unit = typeof data === 'object' && data !== null ? data.unit : '';
              
              return (
                <Grid item xs={6} sm={4} md={3} key={type}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: getSensorTypeColor(type),
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {type}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {typeof average === 'number' ? average.toFixed(1) : "N/A"}{" "}
                      {unit || ""}
                    </Typography>
                  </Box>
                </Grid>
              );
            })
          ) : (
            <Grid item xs={12}>
              <Box
                sx={{
                  p: 4,
                  textAlign: "center",
                  bgcolor: theme.palette.grey[100],
                  borderRadius: 2,
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  No sensor data available
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AverageValueCardsGrid;