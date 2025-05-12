// src/components/dashboard/ActiveSensorsCard.jsx
import { 
  Avatar, 
  Box, 
  Card, 
  CardContent, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  useTheme 
} from "@mui/material";
import ThermostatIcon from "@mui/icons-material/Thermostat";

const ActiveSensorsCard = ({ averages }) => {
  const theme = useTheme();

  // Helper function to get color for each sensor type
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
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Active Sensors
        </Typography>
        <List sx={{ p: 0 }}>
          {hasAverages ? (
            Object.entries(averages).map(([type, data]) => {
              // Ensure data is an object and has the expected properties
              const average = typeof data === 'object' && data !== null ? data.average : null;
              const unit = typeof data === 'object' && data !== null ? data.unit : '';
              
              return (
                <ListItem key={type} sx={{ px: 0, py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Avatar
                      sx={{
                        bgcolor: getSensorTypeColor(type),
                        width: 32,
                        height: 32,
                      }}
                    >
                      <ThermostatIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={type}
                    secondary={`${typeof average === 'number' ? average.toFixed(1) : 'N/A'} ${unit || ''}`}
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>
              );
            })
          ) : (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                No active sensors
              </Typography>
            </Box>
          )}
        </List>
      </CardContent>
    </Card>
  );
};

export default ActiveSensorsCard;