// src/components/farm/FarmForm.jsx
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Grid,
  MenuItem,
  Divider,
  FormControlLabel,
  Switch,
  InputAdornment,
  Typography,
  useTheme,
} from "@mui/material";
import {
  SaveOutlined as SaveIcon,
  LocationOnOutlined as LocationIcon,
  CropSquare as CropSquareIcon,
  WaterDropOutlined as WaterDropIcon,
  CloudOutlined as CloudIcon,
} from "@mui/icons-material";

const farmTypes = [
  "Crop Farm",
  "Livestock Farm",
  "Mixed Farm",
  "Orchard",
  "Vineyard",
  "Greenhouse",
  "Hydroponic",
  "Aquaculture",
];

const soilTypes = [
  "Clay",
  "Sandy",
  "Silty",
  "Peaty",
  "Chalky",
  "Loamy",
  "Mixed",
];

const FarmForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
  isEdit = false,
}) => {
  const theme = useTheme();

  const [formData, setFormData] = useState({
    name: "",
    farmType: "Crop Farm",
    location: "",
    area: "",
    soilType: "Loamy",
    irrigationSource: "",
    weatherStationAvailable: false,
    description: "",
    ...initialData,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when field changes
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation (required)
    if (!formData.name.trim()) {
      newErrors.name = "Farm name is required";
    }

    // Area validation (must be a number)
    if (formData.area && isNaN(parseFloat(formData.area))) {
      newErrors.area = "Area must be a number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Clean up the data before submitting
    const cleanedData = {
      ...formData,
      area: formData.area ? parseFloat(formData.area) : null,
    };

    onSubmit(cleanedData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography
            variant="h6"
            sx={{ mb: 2, color: theme.palette.primary.main }}
          >
            Basic Information
          </Typography>
          <Divider sx={{ mb: 3 }} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Farm Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            placeholder="Enter farm name"
            disabled={isLoading}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Farm Type"
            name="farmType"
            value={formData.farmType}
            onChange={handleChange}
            disabled={isLoading}
          >
            {farmTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter address or coordinates"
            disabled={isLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography
            variant="h6"
            sx={{ mt: 2, mb: 2, color: theme.palette.primary.main }}
          >
            Land & Environmental Details
          </Typography>
          <Divider sx={{ mb: 3 }} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Area"
            name="area"
            type="number"
            value={formData.area}
            onChange={handleChange}
            placeholder="Enter farm area"
            error={!!errors.area}
            helperText={errors.area}
            disabled={isLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CropSquareIcon color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">hectares</InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Soil Type"
            name="soilType"
            value={formData.soilType}
            onChange={handleChange}
            disabled={isLoading}
          >
            {soilTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Irrigation Source"
            name="irrigationSource"
            value={formData.irrigationSource}
            onChange={handleChange}
            placeholder="E.g., Well, River, Rain"
            disabled={isLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <WaterDropIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
            <CloudIcon color="primary" sx={{ mr: 1 }} />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.weatherStationAvailable}
                  onChange={handleChange}
                  name="weatherStationAvailable"
                  color="primary"
                  disabled={isLoading}
                />
              }
              label="Weather Station Available"
            />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            placeholder="Additional information about this farm..."
            disabled={isLoading}
          />
        </Grid>

        <Grid
          item
          xs={12}
          sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            type="button"
            variant="outlined"
            onClick={onCancel}
            sx={{ mr: 2 }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : isEdit ? "Update Farm" : "Create Farm"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FarmForm;
