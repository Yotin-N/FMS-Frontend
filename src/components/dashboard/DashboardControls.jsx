
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const DashboardControls = ({ 
  farms, 
  selectedFarmId, 
  timeRange, 
  onFarmChange, 
  onTimeRangeChange 
}) => {
  const navigate = useNavigate();

  // Time range buttons configuration
  const timeRangeButtons = [
    { label: "24h", value: "24" },
    { label: "7d", value: "168" },
    { label: "30d", value: "720" },
  ];

  return (
    <Box
      sx={{
        mb: 3,
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      {/* Farm Selection */}
      <Box sx={{ minWidth: 200 }}>
        <Typography variant="subtitle2" gutterBottom>
          Farm
        </Typography>
        <select
          value={selectedFarmId}
          onChange={onFarmChange}
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: "4px",
            border: "1px solid #ddd",
            backgroundColor: "white",
          }}
        >
          {farms.map((farm) => (
            <option key={farm.id} value={farm.id}>
              {farm.name}
            </option>
          ))}
        </select>
      </Box>

      {/* Time Range Selection */}
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Time Range
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          {timeRangeButtons.map((button) => (
            <Button
              key={button.value}
              variant={timeRange === button.value ? "contained" : "outlined"}
              size="small"
              onClick={() => onTimeRangeChange(button.value)}
              sx={{ minWidth: "60px" }}
            >
              {button.label}
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardControls;