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
  useTheme,
  Switch,
  ListItemSecondaryAction 
} from "@mui/material";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import OpacityIcon from "@mui/icons-material/Opacity"; 
import WavesIcon from "@mui/icons-material/Waves"; 
import ScienceIcon from "@mui/icons-material/Science"; 
import BoltIcon from "@mui/icons-material/Bolt"; 
import GrainIcon from "@mui/icons-material/Grain"; 

const ActiveSensorsCard = ({ averages, visibleSensors, onToggleSensor }) => {
  const theme = useTheme();

  
  const getSensorTypeColor = (type) => {
    const colorMap = {
      pH: "#ff9800", 
      DO: "#ff9800", 
      Temperature: "#f44336", 
      TempA: "#f44336", 
      TempB: "#ef5350", 
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

  
  const getSensorIcon = (type) => {
    const iconMap = {
      pH: <OpacityIcon sx={{ fontSize: 16 }} />,
      DO: <OpacityIcon sx={{ fontSize: 16 }} />,
      Temperature: <ThermostatIcon sx={{ fontSize: 16 }} />,
      TempA: <ThermostatIcon sx={{ fontSize: 16 }} />,
      TempB: <ThermostatIcon sx={{ fontSize: 16 }} />,
      TempC: <ThermostatIcon sx={{ fontSize: 16 }} />,
      SALT: <WavesIcon sx={{ fontSize: 16 }} />,
      Saltlinity: <WavesIcon sx={{ fontSize: 16 }} />,
      NHx: <ScienceIcon sx={{ fontSize: 16 }} />,
      NH3: <ScienceIcon sx={{ fontSize: 16 }} />,
      EC: <BoltIcon sx={{ fontSize: 16 }} />,
      TDS: <GrainIcon sx={{ fontSize: 16 }} />,
    };
    return iconMap[type] || <ThermostatIcon sx={{ fontSize: 16 }} />;
  };

  
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
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
          Active Sensors
        </Typography>
        <List sx={{ p: 0 }}>
          {hasAverages ? (
            Object.entries(averages).map(([type, data]) => {
              
              const average = typeof data === 'object' && data !== null ? data.average : null;
              const unit = typeof data === 'object' && data !== null ? data.unit : '';
              
              // Display N/A if the average is not available
              const displayValue = average !== null && average !== undefined ? 
                Number(average).toFixed(1) : 'N/A';
              
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
                      {getSensorIcon(type)}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={type}
                    secondary={`${displayValue} ${unit || ''}`}
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      size="small"
                      checked={visibleSensors.includes(type)}
                      onChange={() => onToggleSensor(type)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: getSensorTypeColor(type),
                          '&:hover': {
                            backgroundColor: `${getSensorTypeColor(type)}1A`,
                          },
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: getSensorTypeColor(type),
                        },
                      }}
                    />
                  </ListItemSecondaryAction>
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