import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  useTheme,
  Switch,
  Divider
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
      pH: <OpacityIcon />,
      DO: <OpacityIcon />,
      Temperature: <ThermostatIcon />,
      TempA: <ThermostatIcon />,
      TempB: <ThermostatIcon />,
      TempC: <ThermostatIcon />,
      SALT: <WavesIcon />,
      Saltlinity: <WavesIcon />,
      NHx: <ScienceIcon />,
      NH3: <ScienceIcon />,
      EC: <BoltIcon />,
      TDS: <GrainIcon />,
    };
    return iconMap[type] || <ThermostatIcon />;
  };

  const hasAverages = averages && typeof averages === 'object' && Object.keys(averages).length > 0;

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        height: "auto",
        maxHeight: 400
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* Header */}
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
            Active Sensors
          </Typography>
        </Box>
        <Divider />

        {/* Scrollable content */}
        <Box 
          sx={{ 
            overflowY: "auto", 
            maxHeight: "300px",
            // Firefox scrollbar
            scrollbarWidth: 'thin',
            scrollbarColor: `${theme.palette.grey[400]} ${theme.palette.grey[100]}`,
            // WebKit scrollbar
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: theme.palette.grey[100],
            },
            '&::-webkit-scrollbar-thumb': {
              background: theme.palette.grey[400],
              borderRadius: '6px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: theme.palette.grey[500],
            },
          }}
        >
          {hasAverages ? (
            Object.entries(averages).map(([type, data]) => {
              const average = typeof data === 'object' && data !== null ? data.average : null;
              const unit = typeof data === 'object' && data !== null ? data.unit : '';
              const displayValue = average !== null && average !== undefined ? 
                Number(average).toFixed(1) : 'N/A';
              const sensorColor = getSensorTypeColor(type);
              
              return (
                <Box 
                  key={type} 
                  sx={{ 
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: `1px solid ${theme.palette.grey[100]}`,
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      backgroundColor: theme.palette.grey[50]
                    }
                  }}
                >
                  {/* Left - Icon and sensor info */}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: sensorColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        mr: 2,
                        '& svg': {
                          fontSize: 20
                        }
                      }}
                    >
                      {getSensorIcon(type)}
                    </Box>
                    <Box>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 600, 
                          color: theme.palette.text.primary,
                          lineHeight: 1.2
                        }}
                      >
                        {type}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: displayValue === 'N/A' ? 
                            theme.palette.text.disabled : 
                            theme.palette.text.secondary,
                          fontWeight: 500
                        }}
                      >
                        {displayValue} {unit}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Right - Switch */}
                  <Switch
                    checked={visibleSensors.includes(type)}
                    onChange={() => onToggleSensor(type)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: sensorColor,
                        '&:hover': {
                          backgroundColor: `${sensorColor}1A`,
                        },
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: sensorColor,
                        opacity: 0.5
                      },
                    }}
                  />
                </Box>
              );
            })
          ) : (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                No active sensors
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ActiveSensorsCard;