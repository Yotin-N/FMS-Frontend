// File: src/components/farmDevice/CreateFarmPlaceholder.jsx 

import { useState } from 'react'

import {

    Box,

    Button,

    TextField,

    Typography,

    Paper,

    Grid,

    MenuItem,

    Divider,

    FormControlLabel,

    Switch,

    InputAdornment,

    useTheme

} from '@mui/material'

import SaveIcon from '@mui/icons-material/Save'

import LocationOnIcon from '@mui/icons-material/LocationOn'

import CropSquareIcon from '@mui/icons-material/CropSquare'

import WaterDropIcon from '@mui/icons-material/WaterDrop'

import CloudIcon from '@mui/icons-material/Cloud'

import { createFarm } from '../../services/api'



const farmTypes = [

    'Crop Farm',

    'Livestock Farm',

    'Mixed Farm',

    'Orchard',

    'Vineyard',

    'Greenhouse',

    'Hydroponic',

    'Aquaculture'

]



const soilTypes = [

    'Clay',

    'Sandy',

    'Silty',

    'Peaty',

    'Chalky',

    'Loamy',

    'Mixed'

]



const CreateFarmPlaceholder = () => {

    const theme = useTheme()



    const [formData, setFormData] = useState({

        farmName: '',

        farmType: 'Crop Farm',

        location: '',

        area: '',

        soilType: 'Loamy',

        irrigationSource: '',

        weatherStationAvailable: false,

        notes: ''

    })



    const handleChange = (e) => {

        const { name, value, checked, type } = e.target

        setFormData(prevData => ({

            ...prevData,

            [name]: type === 'checkbox' ? checked : value

        }))

    }



    const handleSubmit = async (e) => {

        e.preventDefault()

        try {

            // Call the API service function 

            const response = await createFarm(formData)

            console.log('Farm created successfully:', response)



            // Clear the form or handle success 

            setFormData({

                farmName: '',

                farmType: 'Crop Farm',

                location: '',

                area: '',

                soilType: 'Loamy',

                irrigationSource: '',

                weatherStationAvailable: false,

                notes: ''

            })



            // Display success message (not implemented here) 

        } catch (error) {

            console.error('Error creating farm:', error)

            // Handle error 

        }

    }



    return (

        <Box>

            <Typography variant="h4" gutterBottom component="h2" sx={{ mb: 3 }}>

                Add New Farm

            </Typography>



            <Paper sx={{ p: 3, borderRadius: 2 }}>

                <Box component="form" onSubmit={handleSubmit} noValidate>

                    <Grid container spacing={3}>

                        <Grid item xs={12}>

                            <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main }}>

                                Basic Information

                            </Typography>

                            <Divider sx={{ mb: 3 }} />

                        </Grid>



                        <Grid item xs={12} sm={6}>

                            <TextField

                                required

                                fullWidth

                                label="Farm Name"

                                name="farmName"

                                value={formData.farmName}

                                onChange={handleChange}

                                placeholder="Enter farm name"

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

                                InputProps={{

                                    startAdornment: (

                                        <InputAdornment position="start">

                                            <LocationOnIcon color="primary" />

                                        </InputAdornment>

                                    ),

                                }}

                            />

                        </Grid>



                        <Grid item xs={12}>

                            <Typography variant="h6" sx={{ mt: 2, mb: 2, color: theme.palette.primary.main }}>

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

                                InputProps={{

                                    startAdornment: (

                                        <InputAdornment position="start">

                                            <CropSquareIcon color="primary" />

                                        </InputAdornment>

                                    ),

                                    endAdornment: <InputAdornment position="end">hectares</InputAdornment>,

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

                            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>

                                <CloudIcon color="primary" sx={{ mr: 1 }} />

                                <FormControlLabel

                                    control={

                                        <Switch

                                            checked={formData.weatherStationAvailable}

                                            onChange={handleChange}

                                            name="weatherStationAvailable"

                                            color="primary"

                                        />

                                    }

                                    label="Weather Station Available"

                                />

                            </Box>

                        </Grid>



                        <Grid item xs={12}>

                            <TextField

                                fullWidth

                                label="Notes"

                                name="notes"

                                value={formData.notes}

                                onChange={handleChange}

                                multiline

                                rows={4}

                                placeholder="Additional information about this farm..."

                            />

                        </Grid>



                        <Grid item xs={12} sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>

                            <Button

                                type="button"

                                variant="outlined"

                                sx={{ mr: 2 }}

                            >

                                Cancel

                            </Button>

                            <Button

                                type="submit"

                                variant="contained"

                                color="primary"

                                startIcon={<SaveIcon />}

                            >

                                Create Farm

                            </Button>

                        </Grid>

                    </Grid>

                </Box>

            </Paper>

        </Box>

    )

}



export default CreateFarmPlaceholder 