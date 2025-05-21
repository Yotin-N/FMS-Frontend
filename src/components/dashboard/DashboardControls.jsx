import { 
  Box, 
  Typography, 
  Button, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Chip,
  useTheme 
} from "@mui/material";

const DashboardControls = ({ 
  farms, 
  selectedFarmId, 
  timeRange, 
  onFarmChange, 
  onTimeRangeChange 
}) => {
  const theme = useTheme();

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
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "center" },
        gap: 2,
      }}
    >
      {/* Farm Selection - Modernized */}
      <FormControl 
        sx={{ 
          minWidth: 200, 
          maxWidth: { xs: "100%", sm: 300 },
        }}
      >
        <InputLabel id="farm-select-label">Select Farm</InputLabel>
        <Select
          labelId="farm-select-label"
          value={selectedFarmId}
          onChange={onFarmChange}
          label="Select Farm"
          displayEmpty
          renderValue={(selected) => {
            if (!selected) return null;
            const farm = farms.find(f => f.id === selected);
            return farm ? farm.name : "";
          }}
          sx={{ borderRadius: 1 , height: "40px"}}
        >
          {farms.map((farm) => (
            <MenuItem key={farm.id} value={farm.id}>
              {farm.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Time Range Selection - Modernized */}
      <Stack direction="row" spacing={1} alignItems="center">
    
        {timeRangeButtons.map((button) => (
          <Button
            key={button.value}
            variant={timeRange === button.value ? "contained" : "outlined"}
            size="small"
            onClick={() => onTimeRangeChange(button.value)}
            sx={{
              minWidth: "60px",
              borderRadius: 1,
              textTransform: "none",
              boxShadow: "none",
            }}
          >
            {button.label}
          </Button>
        ))}
      </Stack>
    </Box>
  );
};

export default DashboardControls;