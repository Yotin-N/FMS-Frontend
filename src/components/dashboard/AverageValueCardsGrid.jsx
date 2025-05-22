import React from 'react';
import { Box, Typography, IconButton, Tooltip, useTheme, Grid } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';

const AverageValueCardsGrid = ({ sensorData, visibleSensors, onSensorConfigClick }) => {
  const theme = useTheme();

  // Enhanced Gauge Circle Component
  const GaugeCircle = ({ type, value, unit, severityColor, severityLabel, thresholdRanges, minValue, maxValue }) => {
    const circleSize = 140;
    const strokeWidth = 12;
    const radius = (circleSize - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const startAngle = -225; // Start from lower left (225 degrees)

    // Use thresholdRanges to determine actual min/max for gauge scaling
    const getGaugeRange = () => {
      if (thresholdRanges && thresholdRanges.length > 0) {
        const allValues = [];
        
        thresholdRanges.forEach(range => {
          if (range.min !== null && range.min !== undefined) allValues.push(range.min);
          if (range.max !== null && range.max !== undefined) allValues.push(range.max);
        });
        
        if (allValues.length > 0) {
          return { 
            min: Math.min(...allValues), 
            max: Math.max(...allValues) 
          };
        }
      }
      
      return { min: minValue || 0, max: maxValue || 100 };
    };

    const { min: gaugeMin, max: gaugeMax } = getGaugeRange();
    
    // Calculate gauge fill percentage
    const valueRange = gaugeMax - gaugeMin;
    const normalizedValue = Math.max(gaugeMin, Math.min(gaugeMax, value || 0));
    const valuePosition = valueRange > 0 ? ((normalizedValue - gaugeMin) / valueRange) : 0;
    
    // Gauge settings (270 degrees arc)
    const gaugeDegrees = 270;
    const gaugeCircumference = (circumference * gaugeDegrees) / 360;
    const dashOffset = gaugeCircumference * (1 - valuePosition);
    
    const gaugeColor = severityColor || theme.palette.primary.main;
    const displayValue = value !== null && value !== undefined ? 
      Number(value).toFixed(1) : 'N/A';

    return (
      <Box sx={{ 
        position: 'relative',
        textAlign: 'center',
        mb: 2
      }}>
        {onSensorConfigClick && (
          <IconButton
            size="small"
            onClick={() => onSensorConfigClick(type)}
            sx={{ 
              position: 'absolute', 
              top: -8, 
              right: -8, 
              zIndex: 3,
              backgroundColor: 'rgba(255,255,255,0.9)',
              border: `1px solid ${theme.palette.divider}`,
              '&:hover': { 
                backgroundColor: 'rgba(255,255,255,1)',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s'
            }}
          >
            <SettingsIcon fontSize="small" />
          </IconButton>
        )}

        <Box sx={{ 
          position: 'relative', 
          width: circleSize, 
          height: circleSize, 
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Background arc */}
          <svg width={circleSize} height={circleSize} style={{ position: 'absolute' }}>
            <circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              fill="transparent"
              stroke="#f5f5f5"
              strokeWidth={strokeWidth}
              strokeDasharray={`${gaugeCircumference} ${circumference}`}
              strokeDashoffset={0}
              strokeLinecap="round"
              transform={`rotate(${startAngle} ${circleSize / 2} ${circleSize / 2})`}
            />
          </svg>
          
          {/* Progress arc */}
          <svg width={circleSize} height={circleSize} style={{ position: 'absolute' }}>
            <circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              fill="transparent"
              stroke={gaugeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={`${gaugeCircumference} ${circumference}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform={`rotate(${startAngle} ${circleSize / 2} ${circleSize / 2})`}
              style={{
                transition: 'stroke-dashoffset 1s ease-in-out, stroke 0.3s ease',
              }}
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
                color: displayValue === 'N/A' ? theme.palette.text.disabled : gaugeColor,
                lineHeight: 1,
                fontSize: '1.8rem'
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

        {/* Min/Max indicators
        <Box sx={{ 
          position: 'relative',
          width: circleSize,
          margin: '0 auto',
          height: 20
        }}>
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              fontSize: '0.75rem',
              color: theme.palette.text.secondary,
              fontWeight: 500
            }}
          >
            {gaugeMin}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              fontSize: '0.75rem',
              color: theme.palette.text.secondary,
              fontWeight: 500
            }}
          >
            {gaugeMax}
          </Typography>
        </Box> */}

        
      </Box>
    );
  };

  const sensors = sensorData ? 
    Object.entries(sensorData).filter(([type]) => visibleSensors.includes(type)) :
    [];

  if (sensors.length === 0) {
    return (
      <Box sx={{ width: "100%", mb: 4 }}>
        <Grid container spacing={3}>
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
                {sensorData && Object.keys(sensorData).length > 0 
                  ? "Toggle sensors in the Active Sensors panel to display their readings"
                  : "No sensor data available"
                }
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", mb: 4 }}>
      <Grid container spacing={3}>
        {sensors.map(([type, data]) => {
          const currentValue = data.latestValue !== null && data.latestValue !== undefined 
            ? data.latestValue 
            : data.average;
          
          return (
            <Grid item xs={6} sm={4} md={3} lg={2} key={type}>
              <GaugeCircle 
                type={type} 
                value={currentValue}
                unit={data.unit}
                severityColor={data.severityColor}
                severityLabel={data.severityLabel}
                thresholdRanges={data.thresholdRanges}
                minValue={data.gaugeMin}
                maxValue={data.gaugeMax}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default AverageValueCardsGrid;