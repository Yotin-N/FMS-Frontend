import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  Switch,
  Divider,
  FormControlLabel,
} from "@mui/material";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import OpacityIcon from "@mui/icons-material/Opacity";
import WavesIcon from "@mui/icons-material/Waves";
import ScienceIcon from "@mui/icons-material/Science";
import BoltIcon from "@mui/icons-material/Bolt";
import GrainIcon from "@mui/icons-material/Grain";

const ActiveSensorsCard = ({
  averages,
  visibleSensors,
  onToggleSensor,
  showAllGauges,
  onToggleShowAllGauges,
}) => {
  const theme = useTheme();

  const getSensorTypeColor = (type) => {
    const colorMap = {
      TempA: "#f44336",
      TempB: "#ff5722",
      TempC: "#ff9800",
      DO: "#4caf50",
      Salinity: "#03a9f4",
      pH: "#8bc34a",
      Ammonia: "#9c27b0",
      Turbidity: "#0A5EB0",
      NO2: "#673ab7",
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
      Ammonia: <ScienceIcon />,
      Turbidity: <OpacityIcon />,
      NO2: <ScienceIcon />,
    };
    return iconMap[type] || <ThermostatIcon />;
  };

  const hasAverages =
    averages &&
    typeof averages === "object" &&
    Object.keys(averages).length > 0;

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        height: "auto",
        maxHeight: 450, // Slightly increased to accommodate toggle
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent
        sx={{ p: 0, display: "flex", flexDirection: "column", height: "100%" }}
      >
        {/* Header */}
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: theme.palette.text.primary }}
          >
            Active Sensors
          </Typography>
        </Box>

        {/* Toggle Switch for Show All Gauges */}
        <Box sx={{ px: 2, pb: 1.5 }}>
          <FormControlLabel
            control={
              <Switch
                checked={showAllGauges}
                onChange={onToggleShowAllGauges}
                color="primary"
                size="small"
              />
            }
            label={
              <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                {showAllGauges ? "Show Less" : "Show All Gauges"}
              </Typography>
            }
            sx={{
              margin: 0,
              "& .MuiFormControlLabel-label": {
                fontSize: "0.875rem",
                color: theme.palette.text.secondary,
              },
            }}
          />
        </Box>

        <Divider />

        {/* Scrollable content */}
        <Box
          sx={{
            overflowY: "auto",
            flex: 1,
            // Firefox scrollbar
            scrollbarWidth: "thin",
            scrollbarColor: `${theme.palette.grey[400]} ${theme.palette.grey[100]}`,
            // WebKit scrollbar
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: theme.palette.grey[100],
            },
            "&::-webkit-scrollbar-thumb": {
              background: theme.palette.grey[400],
              borderRadius: "6px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: theme.palette.grey[500],
            },
          }}
        >
          {hasAverages ? (
            Object.entries(averages).map(([type, data]) => {
              const average =
                typeof data === "object" && data !== null ? data.average : null;
              const unit =
                typeof data === "object" && data !== null ? data.unit : "";
              const displayValue =
                average !== null && average !== undefined
                  ? Number(average).toFixed(1)
                  : "N/A";
              const sensorColor = getSensorTypeColor(type);

              return (
                <Box
                  key={type}
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: `1px solid ${theme.palette.grey[100]}`,
                    transition: "background-color 0.2s",
                    "&:hover": {
                      backgroundColor: theme.palette.grey[50],
                    },
                  }}
                >
                  {/* Left - Icon and sensor info */}
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor: sensorColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        mr: 2,
                        "& svg": {
                          fontSize: 20,
                        },
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
                          lineHeight: 1.2,
                        }}
                      >
                        {type}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color:
                            displayValue === "N/A"
                              ? theme.palette.text.disabled
                              : theme.palette.text.secondary,
                          fontWeight: 500,
                        }}
                      >
                        {displayValue} {unit}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Right - Switch for chart visibility */}
                  <Switch
                    checked={visibleSensors.includes(type)}
                    onChange={() => onToggleSensor(type)}
                    size="small"
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: sensorColor,
                        "&:hover": {
                          backgroundColor: `${sensorColor}1A`,
                        },
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                        {
                          backgroundColor: sensorColor,
                          opacity: 0.5,
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
