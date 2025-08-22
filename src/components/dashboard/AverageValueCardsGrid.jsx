import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Popover,
  useTheme,
  Grid,
  Paper,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  WarningAmber as WarningAmberIcon,
  ErrorOutline as ErrorOutlineIcon,
  ReportProblemOutlined as ReportProblemOutlinedIcon,
} from "@mui/icons-material";

const AverageValueCardsGrid = ({
  sensorData,
  visibleSensors,
  showAllGauges = false,
  compact = false, // New prop for compact layout
  onSensorConfigClick,
}) => {
  const theme = useTheme();
  const [popoverAnchor, setPopoverAnchor] = React.useState(null);
  const [popoverContent, setPopoverContent] = React.useState("");

  // Handle popover for suggestion messages
  const handlePopoverOpen = (event, suggestion) => {
    setPopoverAnchor(event.currentTarget);
    setPopoverContent(suggestion || "No suggestion available");
  };

  const handlePopoverClose = () => {
    setPopoverAnchor(null);
    setPopoverContent("");
  };

  // Enhanced Gauge Circle Component with improved suggestion display
  const GaugeCircle = ({
    type,
    value,
    unit,
    severity,
    severityColor,
    suggestion,
    thresholdRanges,
    minValue,
    maxValue,
  }) => {
    // Dynamic sizing based on layout mode
    const circleSize = compact ? 100 : 140;
    const strokeWidth = compact ? 8 : 12;
    const radius = (circleSize - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const startAngle = -225;

    // Get sensor-specific suggestion messages
    const getSensorSuggestion = (sensorType, severity) => {
      if (severity === "normal" || severity === "green") return null;

      const suggestions = {
        TempA: "แก้ไขได้ยากเพราะอุณหภูมิน้ำเปลี่ยนแปลงตามสิ่งแวดล้อม",
        TempB: "แก้ไขได้ยากเพราะอุณหภูมิน้ำเปลี่ยนแปลงตามสิ่งแวดล้อม",
        TempC: "แก้ไขได้ยากเพราะอุณหภูมิน้ำเปลี่ยนแปลงตามสิ่งแวดล้อม",
        DO: "เพิ่มการตีน้ำเพื่อเพิ่มปริมาณออกซิเจนที่ละลายในน้ำ",
        pH: "ให้ถ่ายน้ำลางส่วนและตีน้ำเพื่อให้แอมโมเนียระเหยสู่อากาศหรืออาจใช้สารเคมีที่มีฤทธิ์เป็นกรดในปริมาณที่เหมาะสมเพื่อช่วยลดระดับความเป็นด่างเพื่อให้แอมโมเนียอยู่ในรูปที่เป็นอันตรายต่อสัตว์น้ำ",
        Ammonia:
          "ให้ถ่ายน้ำลางส่วนและตีน้ำเพื่อให้แอมโมเนียระเหยสู่อากาศหรืออาจใช้สารเคมีที่มีฤทธิ์เป็นกรดในปริมาณที่เหมาะสมเพื่อช่วยลดระดับความเป็นด่างเพื่อให้แอมโมเนียอยู่ในรูปที่เป็นอันตรายต่อสัตว์น้ำ",
        Turbidity:
          "ค่าที่ต่ำเกินไปแสดงว่ามีแพลงก์ตอนหนาแน่นเกินไปให้ถ่ายน้ำบางส่วนเพื่อลดความหนาแน่นของแพลงก์ตอนลง ค่าที่มากเกินไปแสดงว่าน้ำในบ่อเลี้ยงใสเกินไปต้องปรับน้ำให้มีแพลงก์ตอนหนาแน่นมากขึ้นด้วยการเติมปุ๋ย",
        NO2: "เปลี่ยนถ่ายน้ำหรือเพิ่มความเค็มของน้ำเพื่อให้ความเป็นพิษของไนไตร์ลดลง",
      };

      return (
        suggestions[sensorType] ||
        suggestion ||
        "กรุณาตรวจสอบค่าเซ็นเซอร์และปรับปรุงตามความเหมาะสม"
      );
    };

    const displaySuggestion = getSensorSuggestion(type, severity);

    // Use thresholdRanges to determine actual min/max for gauge scaling
    const getGaugeRange = () => {
      if (thresholdRanges && thresholdRanges.length > 0) {
        const allValues = [];

        thresholdRanges.forEach((range) => {
          if (range.min !== null && range.min !== undefined)
            allValues.push(range.min);
          if (range.max !== null && range.max !== undefined)
            allValues.push(range.max);
        });

        if (allValues.length > 0) {
          return {
            min: Math.min(...allValues),
            max: Math.max(...allValues),
          };
        }
      }

      return { min: minValue || 0, max: maxValue || 100 };
    };

    const { min: gaugeMin, max: gaugeMax } = getGaugeRange();

    // Calculate gauge fill percentage
    const valueRange = gaugeMax - gaugeMin;
    const normalizedValue = Math.max(gaugeMin, Math.min(gaugeMax, value || 0));
    const valuePosition =
      valueRange > 0 ? (normalizedValue - gaugeMin) / valueRange : 0;

    // Gauge settings (270 degrees arc)
    const gaugeDegrees = 270;
    const gaugeCircumference = (circumference * gaugeDegrees) / 360;
    const dashOffset = gaugeCircumference * (1 - valuePosition);

    const gaugeColor = severityColor || theme.palette.primary.main;
    const displayValue =
      value !== null && value !== undefined ? Number(value).toFixed(1) : "N/A";

    // Determine if alert icon should be visible
    const isAlertVisible =
      severity && severity !== "normal" && severity !== "green";

    // Get appropriate alert icon based on severity with improved circular styling
    const getAlertIcon = () => {
      if (!isAlertVisible) return null;

      switch (severity) {
        case "critical":
        case "error":
          return <ErrorOutlineIcon fontSize="small" />;
        case "warning":
          return <WarningAmberIcon fontSize="small" />;
        default:
          return <ReportProblemOutlinedIcon fontSize="small" />;
      }
    };

    // Create detailed tooltip content
    const createTooltipContent = () => {
      const currentValue = value !== null && value !== undefined ? Number(value).toFixed(2) : "N/A";
      
      return (
        <Box sx={{ p: 1, maxWidth: 250 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: gaugeColor }}>
            {type} Sensor Details
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2">
              <strong>Current:</strong>
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: gaugeColor }}>
              {currentValue} {unit || ''}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2">
              <strong>Status:</strong>
            </Typography>
            <Box component="span" sx={{ 
              px: 1, 
              py: 0.2, 
              borderRadius: 1, 
              bgcolor: severityColor || theme.palette.grey[300],
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 500,
              textTransform: 'capitalize'
            }}>
              {severity === 'normal' || severity === 'green' ? 'Normal' : 
               severity === 'warning' ? 'Warning' : 
               severity === 'critical' || severity === 'error' ? 'Critical' : 
               'Unknown'}
            </Box>
          </Box>
          
          {gaugeMin !== undefined && gaugeMax !== undefined && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2">
                <strong>Range:</strong>
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                {gaugeMin.toFixed(1)} - {gaugeMax.toFixed(1)} {unit || ''}
              </Typography>
            </Box>
          )}
          
          {displaySuggestion && severity !== 'normal' && severity !== 'green' && (
            <Box sx={{ mt: 1.5, pt: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5, color: theme.palette.warning.main }}>
                ⚠️ Recommendation
              </Typography>
              <Typography variant="caption" sx={{ fontStyle: 'italic', color: theme.palette.text.secondary, lineHeight: 1.4 }}>
                {displaySuggestion}
              </Typography>
            </Box>
          )}
        </Box>
      );
    };

    return (
      <Box
        sx={{
          position: "relative",
          textAlign: "center",
          mb: 2,
        }}
      >
        {/* Enhanced Alert Icon with Popover */}
        {isAlertVisible && displaySuggestion && (
          <IconButton
            size="small"
            onClick={(event) => handlePopoverOpen(event, displaySuggestion)}
            sx={{
              position: "absolute",
              top: -8,
              right: -10,
              zIndex: 3,
              width: 32,
              height: 32,
              backgroundColor: "rgba(255,255,255,0.95)",
              border: `2px solid ${severityColor || theme.palette.warning.main
                }`,
              borderRadius: "50%",
              color: severityColor || theme.palette.warning.main,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,1)",
                transform: "scale(1.1)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              },
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {getAlertIcon()}
          </IconButton>
        )}

        {/* Wrap the entire gauge in a tooltip */}
        <Tooltip
          title={createTooltipContent()}
          arrow
          placement="top"
          enterDelay={500}
          leaveDelay={200}
          slotProps={{
            tooltip: {
              sx: {
                bgcolor: 'rgba(255, 255, 255, 0.95)',
                color: theme.palette.text.primary,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                p: 0, // Remove default padding since we're adding it in the content
                maxWidth: 300,
              },
            },
            arrow: {
              sx: {
                color: 'rgba(255, 255, 255, 0.95)',
                '&:before': {
                  border: `1px solid ${theme.palette.divider}`,
                },
              },
            },
          }}
        >
          <Box
            className="gauge-container"
            sx={{
              position: "relative",
              width: circleSize,
              height: circleSize,
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "help", // Show help cursor on hover
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                transform: compact ? "scale(1.02)" : "scale(1.05)",
                filter: "brightness(1.05)",
              },
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: -2,
                right: -2,
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: theme.palette.primary.main,
                opacity: 0.8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '8px',
                color: 'white',
                transition: 'opacity 0.2s ease-in-out',
              },
              "&:hover::after": {
                opacity: 1,
              },
            }}
          >
          {/* Background arc */}
          <svg
            width={circleSize}
            height={circleSize}
            style={{ position: "absolute" }}
          >
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
              transform={`rotate(${startAngle} ${circleSize / 2} ${circleSize / 2
                })`}
            />
          </svg>

          {/* Progress arc */}
          <svg
            width={circleSize}
            height={circleSize}
            style={{ position: "absolute" }}
          >
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
              transform={`rotate(${startAngle} ${circleSize / 2} ${circleSize / 2
                })`}
              style={{
                transition:
                  "stroke-dashoffset 1s ease-in-out, stroke 0.3s ease",
              }}
            />
          </svg>

          {/* Center text */}
          <Box
            sx={{
              textAlign: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            <Typography
              variant={compact ? "subtitle2" : "h6"}
              component="div"
              sx={{
                fontWeight: 600,
                fontSize: compact ? "0.9rem" : "1.1rem",
                color: theme.palette.text.primary,
                mb: compact ? 0.2 : 0.5,
              }}
            >
              {type}
            </Typography>
            <Typography
              variant={compact ? "h6" : "h5"}
              component="div"
              sx={{
                fontWeight: 700,
                color:
                  displayValue === "N/A"
                    ? theme.palette.text.disabled
                    : gaugeColor,
                lineHeight: 1,
                fontSize: compact ? "1.2rem" : "1.8rem",
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
                  fontSize: compact ? "0.7rem" : "0.8rem",
                }}
              >
                {unit}
              </Typography>
            )}
          </Box>
        </Box>
        </Tooltip>
      </Box>
    );
  };

  const sensors = sensorData
    ? Object.entries(sensorData).filter(([type]) =>
      visibleSensors.includes(type)
    )
    : [];


  const getDisplayedSensors = () => {
    if (showAllGauges) {
      return sensors;
    }

    return sensors.slice(0, 7);
  };

  const displayedSensors = getDisplayedSensors();

  if (sensors.length === 0) {
    return (
      <Box sx={{ 
        width: "100%", 
        mb: compact ? 0 : 4,
        p: compact ? 2 : 0,
        bgcolor: compact ? "background.paper" : "transparent",
        borderRadius: compact ? 2 : 0,
        boxShadow: compact ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
      }}>
        {compact && (
          <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main, mb: 2 }}>
            Sensor Overview
          </Typography>
        )}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box
              sx={{
                p: compact ? 3 : 4,
                textAlign: "center",
                bgcolor: theme.palette.grey[100],
                borderRadius: 2,
              }}
            >
              <Typography variant="body1" color="text.secondary">
                {sensorData && Object.keys(sensorData).length > 0
                  ? "Toggle sensors in the Active Sensors panel to display their readings"
                  : "No sensor data available"}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }

  // Get grid configuration based on layout mode
  const getGridConfig = () => {
    if (compact) {
      return {
        xs: 6,   // 2 per row on mobile
        sm: 4,   // 3 per row on small tablets
        md: 3,   // 4 per row on tablets
        lg: 2.4, // 5 per row on laptops
        xl: 2,   // 6 per row on desktop
      };
    }
    return {
      xs: 6,   // 2 per row on mobile
      sm: 4,   // 3 per row on small tablets
      md: 3,   // 4 per row on tablets
      lg: 2.4, // 5 per row on laptops
      xl: 1.7, // 7 per row on large desktop
    };
  };

  const gridConfig = getGridConfig();

  return (
    <Box 
      sx={{ 
        width: "100%", 
        mb: compact ? 0 : 4,
        p: compact ? 2 : 0,
        bgcolor: compact ? "background.paper" : "transparent",
        borderRadius: compact ? 2 : 0,
        boxShadow: compact ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
      }}
    >
      {/* Header for compact mode */}
      {compact && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
            Sensor Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Current readings from {displayedSensors.length} active sensors
          </Typography>
        </Box>
      )}

      {/* Display count indicator for non-compact mode */}
      {!compact && sensors.length > 4 && (
        <Box
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Showing {displayedSensors.length} of {sensors.length} sensors
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {showAllGauges
              ? "All gauges displayed"
              : "Limited view - toggle 'Show All' for complete view"}
          </Typography>
        </Box>
      )}

      <Grid container spacing={compact ? 2 : 3}>
        {displayedSensors.map(([type, data]) => {
          const currentValue =
            data.latestValue !== null && data.latestValue !== undefined
              ? data.latestValue
              : data.average;

          return (
            <Grid
              item
              xs={gridConfig.xs}
              sm={gridConfig.sm}
              md={gridConfig.md}
              lg={gridConfig.lg}
              xl={gridConfig.xl}
              key={type}
            >
              <Box
                sx={{
                  position: "relative",
                  cursor: compact && onSensorConfigClick ? "pointer" : "default",
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": compact && onSensorConfigClick ? {
                    transform: "translateY(-2px)",
                  } : {},
                }}
                onClick={compact && onSensorConfigClick ? () => onSensorConfigClick(type) : undefined}
              >
                <GaugeCircle
                  type={type}
                  value={currentValue}
                  unit={data.unit}
                  severity={data.severity}
                  severityColor={data.severityColor}
                  severityLabel={data.severityLabel}
                  suggestion={data.suggestion}
                  thresholdRanges={data.thresholdRanges}
                  minValue={data.gaugeMin}
                  maxValue={data.gaugeMax}
                />
              </Box>
            </Grid>
          );
        })}
      </Grid>

      {/* Enhanced Popover for suggestion messages */}
      <Popover
        open={Boolean(popoverAnchor)}
        anchorEl={compact ? null : popoverAnchor}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: compact ? "top" : "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: compact ? "top" : "top",
          horizontal: "center",
        }}
        sx={{
          "& .MuiPopover-paper": compact ? {
            position: "fixed",
            top: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            maxWidth: 320,
            p: 2,
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            border: `1px solid ${theme.palette.divider}`,
            zIndex: 1300,
          } : {
            maxWidth: 320,
            "& .MuiPaper-root": {
              p: 2,
              borderRadius: 2,
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
              border: `1px solid ${theme.palette.divider}`,
            },
          },
        }}
      >
        <Box>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: theme.palette.primary.main,
              mb: 1,
            }}
          >
            คำแนะนำการแก้ไข
          </Typography>
          <Divider sx={{ mb: 1.5 }} />
          <Typography
            variant="body2"
            sx={{
              lineHeight: 1.6,
              color: theme.palette.text.primary,
            }}
          >
            {popoverContent}
          </Typography>
        </Box>
      </Popover>
    </Box>
  );
};

export default AverageValueCardsGrid;
