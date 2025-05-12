// src/components/dashboard/ExceededValuesCard.jsx
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
import WarningIcon from "@mui/icons-material/Warning";

const ExceededValuesCard = ({ averages }) => {
  const theme = useTheme();

  // Safely check if averages exist and have entries
  const hasAverages = averages && typeof averages === 'object';
  
  // Filter averages to only include exceeded values (values > 70 as in original code)
  const exceededAverages = hasAverages ? 
    Object.entries(averages).filter(([_, data]) => data && data.average !== undefined && data.average > 70) : 
    [];
  
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
          Exceeded Values
        </Typography>
        <List sx={{ p: 0 }}>
          {exceededAverages.length > 0 ? (
            exceededAverages.map(([type, data]) => (
              <ListItem key={type} sx={{ px: 0, py: 1 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Avatar
                    sx={{
                      bgcolor: getSensorTypeColor(type),
                      width: 32,
                      height: 32,
                    }}
                  >
                    <WarningIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={type}
                  secondary={`${data.average !== undefined ? data.average.toFixed(1) : 'N/A'} ${
                    data.unit || ""
                  }`}
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItem>
            ))
          ) : (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                No exceeded values
              </Typography>
            </Box>
          )}
        </List>
      </CardContent>
    </Card>
  );
};

export default ExceededValuesCard;