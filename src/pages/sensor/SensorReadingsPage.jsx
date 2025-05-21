// src/pages/sensor/SensorReadingsPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  InputAdornment,
  LinearProgress,
  Snackbar,
  Alert,
  Stack,
  Chip,
  Tooltip,
  Grid,
  Card,
  CardContent,
  Divider,
  useTheme,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import {
  getSensor,
  getSensorReadings,
  addSensorReading,
  deleteSensorReading,
} from "../../services/sensorApi";
import { format, parseISO } from "date-fns";
import useAuth from "../../hooks/useAuth";

const SensorReadingsPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams(); // Get sensor ID from URL params

  // State
  const [sensor, setSensor] = useState(null);
  const [readings, setReadings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [newReading, setNewReading] = useState("");
  const [stats, setStats] = useState({
    min: 0,
    max: 0,
    avg: 0,
    count: 0,
    latest: null,
  });

  const {user, isAuthenticated} = useAuth();

  // Load sensor and its readings on component mount
  useEffect(() => {
    if (id) {
      loadSensor();
      loadReadings();
    }
  }, [id]);

  // Calculate statistics when readings change
  useEffect(() => {
    if (readings.length > 0) {
      calculateStats();
    }
  }, [readings]);

  // Load sensor details
  const loadSensor = async () => {
    setIsLoading(true);
    try {
      const data = await getSensor(id);
      setSensor(data);
    } catch (err) {
      console.error("Error loading sensor:", err);
      setError("Failed to load sensor details");
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = () => {
    loadReadings(); 
  };

  // Load sensor readings
  const loadReadings = async () => {
    setIsLoading(true);
    try {
      const response = await getSensorReadings(id);
      setReadings(response.data || []);
    } catch (err) {
      console.error("Error loading readings:", err);
      setError("Failed to load sensor readings");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate statistics from readings
  const calculateStats = () => {
    if (readings.length === 0) return;

    const values = readings.map((r) => r.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;

    // Find latest reading
    const sortedReadings = [...readings].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
    const latest = sortedReadings[0];

    setStats({
      min,
      max,
      avg,
      count: readings.length,
      latest,
    });
  };

  // Add a new reading
  const handleAddReading = async () => {
    if (!newReading || isNaN(parseFloat(newReading))) {
      setError("Please enter a valid number");
      return;
    }

    setIsLoading(true);
    try {
      const readingValue = parseFloat(newReading);
      await addSensorReading(id, { value: readingValue });
      setNewReading("");
      await loadReadings(); // Reload readings after adding a new one
      setSuccess("Reading added successfully");
    } catch (err) {
      console.error("Error adding reading:", err);
      setError("Failed to add reading");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a reading
  const handleDeleteReading = async (readingId) => {
    setIsLoading(true);
    try {
      await deleteSensorReading(id, readingId);
      await loadReadings(); // Reload readings after deletion
      setSuccess("Reading deleted successfully");
    } catch (err) {
      console.error("Error deleting reading:", err);
      setError("Failed to delete reading");
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return format(parseISO(dateString), "MMM d, yyyy h:mm a");
    } catch (error) {
      console.error(error);
      return dateString;
    }
  };

  // Handle closing snackbar alerts
  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setError(null);
    setSuccess(null);
  };

  // Go back to sensors list
  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton 
          color="primary" 
          onClick={handleBack} 
          sx={{ 
            mr: 1,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          {isLoading
            ? "Loading..."
            : sensor
            ? `${sensor.name} Readings`
            : "Sensor Readings"}
        </Typography>
      </Box>
  
      {/* Loading Indicator and Alerts here */}
      {/* Error Display */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleAlertClose}
      >
        <Alert
          onClose={handleAlertClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
  
      {/* Success Display */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={handleAlertClose}
      >
        <Alert
          onClose={handleAlertClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {success}
        </Alert>
      </Snackbar>
  
      {sensor && (
        <>
          {/* Sensor Details Card */}
          <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                  Sensor Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography sx={{ fontWeight: 500, mb: 1 }}>
                  <strong>Serial Number:</strong> {sensor.serialNumber}
                </Typography>
                <Typography sx={{ fontWeight: 500, mb: 1 }}>
                  <strong>Type:</strong> {sensor.type}
                </Typography>
                <Typography sx={{ display: "flex", alignItems: "center", fontWeight: 500 }}>
                  <strong>Status:</strong>
                  <Chip
                    size="small"
                    label={sensor.isActive ? "Active" : "Inactive"}
                    color={sensor.isActive ? "success" : "error"}
                    sx={{ ml: 1, fontWeight: 500 }}
                  />
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography sx={{ fontWeight: 500, mb: 1 }}>
                  <strong>Unit:</strong> {sensor.unit || "-"}
                </Typography>
                <Typography sx={{ fontWeight: 500, mb: 1 }}>
                  <strong>Min Value:</strong>{" "}
                  {sensor.minValue !== null
                    ? `${sensor.minValue} ${sensor.unit || ""}`
                    : "Not set"}
                </Typography>
                <Typography sx={{ fontWeight: 500 }}>
                  <strong>Max Value:</strong>{" "}
                  {sensor.maxValue !== null
                    ? `${sensor.maxValue} ${sensor.unit || ""}`
                    : "Not set"}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
  
          {/* Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: "100%", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", borderRadius: 2 }}>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom sx={{ fontSize: "0.875rem" }}>
                    Latest Reading
                  </Typography>
                  <Typography variant="h5" component="div" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                    {stats.latest
                      ? `${stats.latest.value} ${sensor.unit || ""}`
                      : "-"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stats.latest
                      ? formatDate(stats.latest.timestamp)
                      : "No readings yet"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
  
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: "100%", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", borderRadius: 2 }}>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom sx={{ fontSize: "0.875rem" }}>
                    Minimum
                  </Typography>
                  <Typography variant="h5" component="div" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                    {readings.length > 0
                      ? `${stats.min} ${sensor.unit || ""}`
                      : "-"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    All-time minimum value
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
  
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: "100%", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", borderRadius: 2 }}>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom sx={{ fontSize: "0.875rem" }}>
                    Maximum
                  </Typography>
                  <Typography variant="h5" component="div" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                    {readings.length > 0
                      ? `${stats.max} ${sensor.unit || ""}`
                      : "-"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    All-time maximum value
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
  
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: "100%", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", borderRadius: 2 }}>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom sx={{ fontSize: "0.875rem" }}>
                    Average
                  </Typography>
                  <Typography variant="h5" component="div" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                    {readings.length > 0
                      ? `${stats.avg.toFixed(2)} ${sensor.unit || ""}`
                      : "-"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Based on {stats.count} readings
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
  
          {/* Add Reading Form */}
          <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
              Add New Reading
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <TextField
                label={`Value (${sensor.unit || ""})`}
                variant="outlined"
                value={newReading}
                onChange={(e) => setNewReading(e.target.value)}
                type="number"
                size="small"
                sx={{ mr: 2, width: 200 }}
                InputProps={{
                  endAdornment: sensor.unit ? (
                    <InputAdornment position="end">
                      {sensor.unit}
                    </InputAdornment>
                  ) : null,
                }}
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddReading}
                disabled={isLoading}
                sx={{ 
                  borderRadius: 1,
                  textTransform: "none",
                  fontWeight: 500,
                  boxShadow: "none"
                }}
              >
                Add Reading
              </Button>
            </Box>
          </Paper>
  
          {/* Readings Table */}
          <Paper sx={{ width: "100%", borderRadius: 2, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: theme.palette.secondary.light }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Timestamp</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Value</TableCell>
                    {isAuthenticated && user?.role === "ADMIN" && (
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {readings.length === 0 ? (
                    <TableRow>
                      <TableCell 
                        colSpan={isAuthenticated && user?.role === "ADMIN" ? 3 : 2} 
                        align="center" 
                        sx={{ py: 4 }}
                      >
                        <Typography variant="body1" color="text.secondary">
                          No readings available
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    readings.map((reading) => (
                      <TableRow key={reading.id} hover>
                        <TableCell>{formatDate(reading.timestamp)}</TableCell>
                        <TableCell>
                          <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.primary.main }}>
                            {reading.value} {sensor.unit || ""}
                          </Typography>
                        </TableCell>
                        {isAuthenticated && user?.role === "ADMIN" && (
                          <TableCell>
                            <Tooltip title="Delete Reading">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteReading(reading.id)}
                                disabled={isLoading}
                                sx={{ 
                                  border: `1px solid ${theme.palette.divider}`,
                                  borderRadius: 1
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default SensorReadingsPage;
