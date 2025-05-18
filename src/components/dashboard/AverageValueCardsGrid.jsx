import { Box, Grid, Typography, useTheme } from "@mui/material";

const AverageValueCardsGrid = ({ averages, visibleSensors }) => {
  const theme = useTheme();

  // Helper to get color for each sensor type
  const getSensorTypeColor = (type) => {
    const colorMap = {
      pH: {
        gradient: "linear-gradient(90deg, #4caf50 0%, #8bc34a 50%, #cddc39 100%)",
        color: "#4caf50"
      },
      DO: {
        gradient: "linear-gradient(90deg, #ff9800 0%, #ffc107 50%, #ffeb3b 100%)",
        color: "#ff9800"
      },
      Temperature: {
        gradient: "linear-gradient(90deg, #f44336 0%, #ff5722 50%, #ff9800 100%)",
        color: "#f44336"
      },
      TempA: {
        gradient: "linear-gradient(90deg, #f44336 0%, #ff5722 50%, #ff9800 100%)",
        color: "#f44336"
      },
      TempB: {
        gradient: "linear-gradient(90deg, #ef5350 0%, #ff7043 50%, #ffab91 100%)",
        color: "#ef5350"
      },
      TempC: {
        gradient: "linear-gradient(90deg, #f44336 0%, #ff5722 50%, #ff9800 100%)",
        color: "#f44336"
      },
      SALT: {
        gradient: "linear-gradient(90deg, #2196f3 0%, #03a9f4 50%, #00bcd4 100%)",
        color: "#2196f3"
      },
      Saltlinity: {
        gradient: "linear-gradient(90deg, #2196f3 0%, #03a9f4 50%, #00bcd4 100%)",
        color: "#2196f3"
      },
      NHx: {
        gradient: "linear-gradient(90deg, #9c27b0 0%, #ba68c8 50%, #e1bee7 100%)",
        color: "#9c27b0"
      },
      NH3: {
        gradient: "linear-gradient(90deg, #9c27b0 0%, #ba68c8 50%, #e1bee7 100%)",
        color: "#9c27b0"
      },
      EC: {
        gradient: "linear-gradient(90deg, #00bcd4 0%, #4dd0e1 50%, #b2ebf2 100%)",
        color: "#00bcd4"
      },
      TDS: {
        gradient: "linear-gradient(90deg, #8bc34a 0%, #aed581 50%, #dcedc8 100%)",
        color: "#8bc34a"
      },
      ORP: {
        gradient: "linear-gradient(90deg, #3f51b5 0%, #7986cb 50%, #c5cae9 100%)",
        color: "#3f51b5"
      },
      NO2: {
        gradient: "linear-gradient(90deg, #673ab7 0%, #9575cd 50%, #d1c4e9 100%)",
        color: "#673ab7"
      },
      NO: {
        gradient: "linear-gradient(90deg, #673ab7 0%, #9575cd 50%, #d1c4e9 100%)",
        color: "#673ab7"
      },
    };
    
    return colorMap[type] || {
      gradient: "linear-gradient(90deg, #9e9e9e 0%, #bdbdbd 50%, #e0e0e0 100%)",
      color: "#9e9e9e"
    };
  };

  // Helper to calculate percentage for gauge display (just for visual effect)
  const calculatePercentage = (type, value) => {
    // This would ideally be based on min/max values for each sensor type
    // For now, just use a simple scale between 0-100 based on the value
    if (value === null || value === undefined || isNaN(value)) {
      return 25; // Default to 25% for N/A values
    }
    
    // Different scales for different sensor types
    switch(type) {
      case 'pH':
        // pH typically ranges from 0-14, with 7 being neutral
        return (value / 14) * 100;
      case 'Temperature':
      case 'TempA':
      case 'TempB':
      case 'TempC':
        // For temperature, scale from 0-100°C
        return (value / 100) * 100;
      case 'DO':
        // Dissolved oxygen typically 0-20 mg/L
        return (value / 20) * 100;
      case 'NHx':
      case 'NH3':
        // Ammonia, often low numbers 0-5 mg/L
        return (value / 5) * 100;
      case 'TDS':
        // TDS can be quite high, scale differently
        return Math.min((value / 15000) * 100, 100);
      default:
        // For unknown types, just use a generic 0-100 scale
        // Cap at 100% for values > 100
        return Math.min(value, 100);
    }
  };

  // Create a gauge circle that shows value in the center
  const GaugeCircle = ({ type, value, unit }) => {
    const { gradient, color } = getSensorTypeColor(type);
    const percentage = calculatePercentage(type, value);
    // Calculate the dash array and offset for the circle stroke
    const circleSize = 120;
    const strokeWidth = 10;
    const radius = (circleSize - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const displayValue = value !== null && value !== undefined ? 
      Number(value).toFixed(1) : 'N/A';
    
    // Calculate what portion of the circle to fill (from 0% to 75% of the circle, leaving the bottom quarter empty)
    const fillPercentage = (percentage * 0.75) / 100;
    const dashOffset = circumference * (1 - fillPercentage);
    
    return (
      <Box sx={{ 
        position: 'relative', 
        width: circleSize, 
        height: circleSize, 
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Background circle */}
        <svg 
          width={circleSize} 
          height={circleSize} 
          style={{ position: 'absolute', transform: 'rotate(-90deg)' }}
        >
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            fill="transparent"
            stroke="#f5f5f5"
            strokeWidth={strokeWidth}
          />
        </svg>
        
        {/* Progress circle with gradient */}
        <svg 
          width={circleSize} 
          height={circleSize} 
          style={{ position: 'absolute', transform: 'rotate(-90deg)' }}
        >
          <defs>
            <linearGradient id={`gradient-${type}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} stopOpacity={0.7} />
              <stop offset="100%" stopColor={color} stopOpacity={1} />
            </linearGradient>
          </defs>
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            fill="transparent"
            stroke={`url(#gradient-${type})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Center text */}
        <Box sx={{ 
          textAlign: 'center', 
          position: 'relative',
          zIndex: 1
        }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 600, 
              fontSize: '1.1rem',
              color: theme.palette.text.primary,
              mb: 0.5
            }}
          >
            {type}
          </Typography>
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ 
              fontWeight: 700, 
              color: displayValue === 'N/A' ? theme.palette.text.disabled : color,
              lineHeight: 1
            }}
          >
            {displayValue}
          </Typography>
          {unit && (
            <Typography 
              variant="caption" 
              component="div" 
              sx={{ 
                color: theme.palette.text.secondary,
                fontWeight: 500,
                fontSize: '0.8rem'
              }}
            >
              {unit}
            </Typography>
          )}
        </Box>
      </Box>
    );
  };

  // Ensure we render all available sensors regardless of visibleSensors state
  // This is a key fix - we're no longer filtering based on visibleSensors
  const sensors = averages ? Object.entries(averages) : [];

  return (
    <Box sx={{ width: "100%", mb: 4 }}>
      <Grid container spacing={3}>
        {sensors.length > 0 ? (
          sensors.map(([type, data]) => {
            // Ensure data is an object and has the expected properties
            const average = typeof data === 'object' && data !== null ? data.average : null;
            const unit = typeof data === 'object' && data !== null ? data.unit : '';
            
            return (
              <Grid item xs={6} sm={4} md={3} lg={2} key={type}>
                <GaugeCircle 
                  type={type} 
                  value={average} 
                  unit={unit} 
                />
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
    </Box>
  );
};

export default AverageValueCardsGrid;