// File: src/components/farmDevice/AddDevicePlaceholder.jsx 

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

    FormControl,

    InputLabel,

    Select,

    IconButton,

    FormHelperText,

    Tab,

    Tabs,

    useTheme

} from '@mui/material'

import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'

import AddIcon from '@mui/icons-material/Add'

import DevicesIcon from '@mui/icons-material/Devices'

import CameraAltIcon from '@mui/icons-material/CameraAlt'

import { addDevice } from '../../services/api'



// Mock data for farms 

const farms = [

    { id: 1, name: 'Green Valley Farm' },

    { id: 2, name: 'Sunrise Orchard' },

    { id: 3, name: 'Meadow View' }

]



// Mock data for device types 

const deviceTypes = [

    { id: 1, name: 'Soil Moisture Sensor' },

    { id: 2, name: 'Weather Station' },

    { id: 3, name: 'Irrigation Controller' },

    { id: 4, name: 'Crop Monitor' },

    { id: 5, name: 'Temperature Sensor' }

]



const AddDevicePlaceholder = () => {

    const theme = useTheme()

    const [tabValue, setTabValue] = useState(0)



    const [formData, setFormData] = useState({

        serialNumber: '',

        deviceType: '',

        farmId: '',

        location: '',

        name: '',

        notes: ''

    })



    const [qrInput, setQrInput] = useState('')



    const [errors, setErrors] = useState({})



    const handleTabChange = (event, newValue) => {

        setTabValue(newValue)

    }



    const handleChange = (e) => {

        const { name, value } = e.target

        setFormData(prevData => ({

            ...prevData,

            [name]: value

        }))

        // Clear error when user starts typing 

        if (errors[name]) {

            setErrors(prevErrors => ({

                ...prevErrors,

                [name]: ''

            }))

        }

    }



    const handleQrInputChange = (e) => {

        setQrInput(e.target.value)

    }



    const handleQrSubmit = () => {

        console.log('QR Code submitted:', qrInput)

        // Simulate device lookup from QR 

        if (qrInput.trim() !== '') {

            setFormData({

                ...formData,

                serialNumber: qrInput,

                deviceType: '1', // Set default values based on QR 

                name: `Device ${qrInput}`

            })

            setTabValue(1) // Switch to manual tab to complete form 

            setQrInput('')

        }

    }



    const handleScanClick = () => {

        console.log('Opening camera for QR scanning')

        // In a real app, this would trigger camera access for QR scanning 

        alert('Camera access would be requested here in a real application.')

    }



    const validateForm = () => {

        const newErrors = {}



        if (!formData.serialNumber) {

            newErrors.serialNumber = 'Serial number is required'

        }



        if (!formData.deviceType) {

            newErrors.deviceType = 'Device type is required'

        }



        if (!formData.farmId) {

            newErrors.farmId = 'Farm is required'

        }



        if (!formData.name) {

            newErrors.name = 'Device name is required'

        }



        setErrors(newErrors)

        return Object.keys(newErrors).length === 0

    }



    const handleSubmit = async (e) => {

        e.preventDefault()



        if (!validateForm()) return



        try {

            // Call the API service function 

            const response = await addDevice(formData)

            console.log('Device added successfully:', response)



            // Clear the form or handle success 

            setFormData({

                serialNumber: '',

                deviceType: '',

                farmId: '',

                location: '',

                name: '',

                notes: ''

            })



            // Display success message (not implemented here) 

        } catch (error) {

            console.error('Error adding device:', error)

            // Handle error 

        }

    }



    // QR Code Input Tab 

    const renderQrTab = () => (

        <Box sx={{ p: 2 }}>

            <Typography variant="h6" sx={{ mb: 3 }}>

                Scan QR Code or Enter Device ID

            </Typography>



            <Grid container spacing={2} alignItems="center">

                <Grid item xs={12} md={8}>

                    <TextField

                        fullWidth

                        label="Enter Device QR Code or Serial Number"

                        value={qrInput}

                        onChange={handleQrInputChange}

                        placeholder="e.g. DEVICE-1234-ABCD"

                    />

                </Grid>

                <Grid item xs={6} md={2}>

                    <Button

                        fullWidth

                        variant="contained"

                        color="primary"

                        onClick={handleQrSubmit}

                    >

                        Submit

                    </Button>

                </Grid>

                <Grid item xs={6} md={2}>

                    <Button

                        fullWidth

                        variant="outlined"

                        color="primary"

                        startIcon={<CameraAltIcon />}

                        onClick={handleScanClick}

                    >

                        Scan

                    </Button>

                </Grid>

            </Grid>



            <Box sx={{

                mt: 4,

                p: 4,

                border: `2px dashed ${theme.palette.primary.light}`,

                borderRadius: 2,

                textAlign: 'center',

                backgroundColor: theme.palette.secondary.light

            }}>

                <QrCodeScannerIcon sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />

                <Typography variant="h6" gutterBottom>

                    Scan Device QR Code

                </Typography>

                <Typography variant="body2" color="textSecondary">

                    Point your camera at the device QR code or click the "Scan" button above to activate the scanner.

                </Typography>

            </Box>

        </Box>

    )



    // Manual Input Tab 

    const renderManualTab = () => (

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ p: 2 }}>

            <Grid container spacing={3}>

                <Grid item xs={12}>

                    <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main }}>

                        Device Information

                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                </Grid>



                <Grid item xs={12} sm={6}>

                    <TextField

                        required

                        fullWidth

                        label="Serial Number"

                        name="serialNumber"

                        value={formData.serialNumber}

                        onChange={handleChange}

                        error={!!errors.serialNumber}

                        helperText={errors.serialNumber}

                    />

                </Grid>



                <Grid item xs={12} sm={6}>

                    <FormControl fullWidth required error={!!errors.deviceType}>

                        <InputLabel id="device-type-label">Device Type</InputLabel>

                        <Select

                            labelId="device-type-label"

                            name="deviceType"

                            value={formData.deviceType}

                            onChange={handleChange}

                            label="Device Type"

                        >

                            {deviceTypes.map((type) => (

                                <MenuItem key={type.id} value={type.id}>

                                    {type.name}

                                </MenuItem>

                            ))}

                        </Select>

                        {errors.deviceType && <FormHelperText>{errors.deviceType}</FormHelperText>}

                    </FormControl>

                </Grid>



                <Grid item xs={12}>

                    <TextField

                        required

                        fullWidth

                        label="Device Name"

                        name="name"

                        value={formData.name}

                        onChange={handleChange}

                        error={!!errors.name}

                        helperText={errors.name}

                    />

                </Grid>



                <Grid item xs={12}>

                    <FormControl fullWidth required error={!!errors.farmId}>

                        <InputLabel id="farm-label">Assign to Farm</InputLabel>

                        <Select

                            labelId="farm-label"

                            name="farmId"

                            value={formData.farmId}

                            onChange={handleChange}

                            label="Assign to Farm"

                        >

                            {farms.map((farm) => (

                                <MenuItem key={farm.id} value={farm.id}>

                                    {farm.name}

                                </MenuItem>

                            ))}

                        </Select>

                        {errors.farmId && <FormHelperText>{errors.farmId}</FormHelperText>}

                    </FormControl>

                </Grid>



                <Grid item xs={12}>

                    <TextField

                        fullWidth

                        label="Location on Farm"

                        name="location"

                        value={formData.location}

                        onChange={handleChange}

                        placeholder="E.g., North Field, Greenhouse 2, etc."

                    />

                </Grid>



                <Grid item xs={12}>

                    <TextField

                        fullWidth

                        label="Notes"

                        name="notes"

                        value={formData.notes}

                        onChange={handleChange}

                        multiline

                        rows={3}

                        placeholder="Additional information about this device..."

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

                        startIcon={<AddIcon />}

                    >

                        Add Device

                    </Button>

                </Grid>

            </Grid>

        </Box>

    )



    return (

        <Box>

            <Typography variant="h4" gutterBottom component="h2" sx={{ mb: 3 }}>

                Add New Device

            </Typography>



            <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>

                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>

                    <Tabs

                        value={tabValue}

                        onChange={handleTabChange}

                        aria-label="device registration tabs"

                        variant="fullWidth"

                    >

                        <Tab

                            icon={<QrCodeScannerIcon />}

                            label="QR CODE"

                            sx={{

                                py: 2,

                                '&.Mui-selected': { color: theme.palette.primary.main },

                            }}

                        />

                        <Tab

                            icon={<DevicesIcon />}

                            label="MANUAL ENTRY"

                            sx={{

                                py: 2,

                                '&.Mui-selected': { color: theme.palette.primary.main },

                            }}

                        />

                    </Tabs>

                </Box>



                <Box>

                    {tabValue === 0 ? renderQrTab() : renderManualTab()}

                </Box>

            </Paper>

        </Box>

    )

}



export default AddDevicePlaceholder 