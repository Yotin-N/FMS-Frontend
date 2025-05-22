import React from 'react';
import { Box, Grid, Typography, useTheme } from "@mui/material";
import LatestValueSensorGauge from './LastestValueSensorGuage';

const AverageValueCardsGrid = ({ sensorData, visibleSensors, onSensorConfigClick }) => {
  const theme = useTheme();

  // Filter sensors based on visibility and ensure we have data
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
        {sensors.map(([type, data]) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={type}>
            <LatestValueSensorGauge 
              type={type}
              latestValue={data.latestValue}
              unit={data.unit}
              severity={data.severity}
              severityColor={data.severityColor}
              severityLabel={data.severityLabel}
              thresholdRanges={data.thresholdRanges}
              gaugeMin={data.gaugeMin}
              gaugeMax={data.gaugeMax}
              sourceSensorName={data.sourceSensorName}
              latestTimestamp={data.latestTimestamp}
              onConfigClick={onSensorConfigClick}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AverageValueCardsGrid;