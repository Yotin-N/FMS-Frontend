import React from 'react';
import { Box, Typography, IconButton, Tooltip, useTheme } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';

const LatestValueSensorGauge = ({ 
  type, 
  value, 
  unit, 
  severity, 
  severityColor, 
  severityLabel,
  thresholdRanges = [],
  minValue = 0,
  maxValue = 100,
  onConfigClick 
}) => {
  const theme = useTheme();
  
  // Debug logging
  console.log(`LatestValueSensorGauge - ${type}:`, {
    value,
    minValue,
    maxValue,
    severityColor,
    thresholdRanges
  });

  // Validate required props
  if (value === null || value === undefined) {
    console.warn(`No value provided for sensor ${type}`);
    return (
      <Box sx={{ position: 'relative', textAlign: 'center', p: 2 }}>
        <Typography variant="h6">{type}</Typography>
        <Typography color="text.secondary">No Data</Typography>
      </Box>
    );
  }

  const circleSize = 140;
  const strokeWidth = 12;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate value position as percentage
  const valueRange = maxValue - minValue;
  const valuePosition = valueRange > 0 ? ((value - minValue) / valueRange) * 100 : 0;
  
  // Limit to 0-100%
  const fillPercentage = Math.max(0, Math.min(100, valuePosition));
  
  // Calculate dash offset for the main gauge
  const dashOffset = circumference * (1 - fillPercentage / 100);

  // Create threshold segments for background visualization
  const createThresholdSegments = () => {
    if (thresholdRanges.length === 0) return null;

    return thresholdRanges.map((range, index) => {
      let segmentMin = range.min !== null ? range.min : minValue;
      let segmentMax = range.max !== null ? range.max : maxValue;
      
      // Ensure segments are within bounds
      segmentMin = Math.max(segmentMin, minValue);
      segmentMax = Math.min(segmentMax, maxValue);
      
      if (segmentMin >= segmentMax) return null;

      const startPercentage = ((segmentMin - minValue) / valueRange) * 100;
      const endPercentage = ((segmentMax - minValue) / valueRange) * 100;
      const segmentLength = (endPercentage - startPercentage) / 100;
      
      const segmentCircumference = circumference * segmentLength;
      const segmentOffset = circumference * (1 - endPercentage / 100);

      return (
        <circle
          key={`threshold-${index}`}
          cx={circleSize / 2}
          cy={circleSize / 2}
          r={radius}
          fill="transparent"
          stroke={range.color}
          strokeWidth={strokeWidth - 2}
          strokeDasharray={segmentCircumference + ' ' + circumference}
          strokeDashoffset={segmentOffset}
          strokeLinecap="round"
          opacity={0.3}
        />
      );
    }).filter(Boolean);
  };

  const displayValue = value !== null && value !== undefined ? 
    Number(value).toFixed(1) : 'N/A';

  return (
    <Box sx={{ position: 'relative', textAlign: 'center' }}>
      {/* Settings Button */}
      {onConfigClick && (
        <IconButton
          size="small"
          onClick={() => onConfigClick(type)}
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

      {/* Gauge Circle Container */}
      <Box sx={{ 
        position: 'relative', 
        width: circleSize, 
        height: circleSize, 
        margin: '0 auto' 
      }}>
        {/* Background circle */}
        <svg width={circleSize} height={circleSize} style={{ position: 'absolute' }}>
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            fill="transparent"
            stroke="#f5f5f5"
            strokeWidth={strokeWidth}
          />
        </svg>
        
        {/* Threshold segments background */}
        <svg width={circleSize} height={circleSize} style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
          {createThresholdSegments()}
        </svg>
        
        {/* Main progress circle with severity color */}
        <svg width={circleSize} height={circleSize} style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            fill="transparent"
            stroke={severityColor || '#4caf50'}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1s ease-in-out, stroke 0.3s ease',
            }}
          />
        </svg>
        
        {/* Center content */}
        <Box sx={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          zIndex: 2
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              mb: 0.5,
              fontSize: '0.9rem',
              color: theme.palette.text.primary
            }}
          >
            {type}
          </Typography>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: severityColor || theme.palette.primary.main,
              lineHeight: 1,
              fontSize: '1.8rem'
            }}
          >
            {displayValue}
          </Typography>
          {unit && (
            <Typography 
              variant="caption" 
              sx={{ 
                color: theme.palette.text.secondary,
                fontWeight: 500,
                fontSize: '0.75rem'
              }}
            >
              {unit}
            </Typography>
          )}
        </Box>

        {/* Value range indicators */}
        {minValue !== maxValue && (
          <>
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                bottom: -5,
                left: 0,
                fontSize: '0.7rem',
                color: theme.palette.text.secondary
              }}
            >
              {minValue}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                bottom: -5,
                right: 0,
                fontSize: '0.7rem',
                color: theme.palette.text.secondary
              }}
            >
              {maxValue}
            </Typography>
          </>
        )}
      </Box>

      {/* Severity Status Badge */}
      <Tooltip title={`Status: ${severity || 'Unknown'} | Thresholds: ${thresholdRanges.length} ranges`}>
        <Box sx={{ 
          mt: 1, 
          p: 0.5, 
          borderRadius: 1, 
          backgroundColor: (severityColor || '#4caf50') + '15',
          border: `1px solid ${severityColor || '#4caf50'}`,
          transition: 'all 0.3s ease'
        }}>
          <Typography 
            variant="caption" 
            sx={{ 
              color: severityColor || '#4caf50', 
              fontWeight: 600,
              fontSize: '0.75rem'
            }}
          >
            {severityLabel || 'Normal'}
          </Typography>
        </Box>
      </Tooltip>

      {/* Threshold ranges legend (optional, for debugging) */}
      {thresholdRanges.length > 0 && process.env.NODE_ENV === 'development' && (
        <Box sx={{ mt: 1, fontSize: '0.6rem', color: 'text.secondary' }}>
          {thresholdRanges.map((range, i) => (
            <div key={i} style={{ color: range.color }}>
              {range.label}: {range.min || 'min'}-{range.max || 'max'}
            </div>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default LatestValueSensorGauge;