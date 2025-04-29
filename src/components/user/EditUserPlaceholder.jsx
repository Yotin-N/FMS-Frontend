// File: src/components/user/EditUserPlaceholder.jsx 

import { useState, useEffect } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

import {

    Box,

    Button,

    TextField,

    Typography,

    Paper,

    Grid,

    MenuItem,

    FormControl,

    FormLabel,

    RadioGroup,

    FormControlLabel,

    Radio,

    Divider,

    Alert,

    useTheme

} from '@mui/material'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import SaveIcon from '@mui/icons-material/Save'



const EditUserPlaceholder = () => {

    const theme = useTheme()

    const navigate = useNavigate()

    const { id } = useParams()



    const [formData, setFormData] = useState({

        firstName: '',

        lastName: '',

        email: '',

        role: '',

        status: ''

    })



    const [loading, setLoading] = useState(true)



    // Simulating data fetching 

    useEffect(() => {

        // In a real app, would fetch from API 

        setTimeout(() => {

            setFormData({

                firstName: 'John',

                lastName: 'Doe',

                email: 'john@example.com',

                role: 'Admin',

                status: 'Active'

            })

            setLoading(false)

        }, 500)

    }, [id])



    const handleChange = (e) => {

        const { name, value } = e.target

        setFormData(prevData => ({

            ...prevData,

            [name]: value

        }))

    }



    const handleSubmit = (e) => {

        e.preventDefault()

        console.log('Updating user:', formData)

        // In a real app, would send data to API 

        // Then redirect on success 

        navigate('/dashboard/users')

    }



    if (loading) {

        return (

            <Box sx={{ p: 3 }}>

                <Typography>Loading user information...</Typography>

            </Box>

        )

    }



    return (

        <Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>

                <Button

                    startIcon={<ArrowBackIcon />}

                    onClick={() => navigate('/dashboard/users')}

                    sx={{ mr: 2 }}

                >

                    Back

                </Button>

                <Typography variant="h4" component="h2">

                    Edit User

                </Typography>

            </Box>



            <Alert severity="info" sx={{ mb: 3 }}>

                You are editing user ID: {id}

            </Alert>



            <Paper sx={{ p: 3, borderRadius: 2 }}>

                <Box component="form" onSubmit={handleSubmit} noValidate>

                    <Grid container spacing={3}>

                        <Grid item xs={12}>

                            <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main }}>

                                User Details

                            </Typography>

                            <Divider sx={{ mb: 3 }} />

                        </Grid>



                        <Grid item xs={12} sm={6}>

                            <TextField

                                required

                                fullWidth

                                label="First Name"

                                name="firstName"

                                value={formData.firstName}

                                onChange={handleChange}

                            />

                        </Grid>



                        <Grid item xs={12} sm={6}>

                            <TextField

                                required

                                fullWidth

                                label="Last Name"

                                name="lastName"

                                value={formData.lastName}

                                onChange={handleChange}

                            />

                        </Grid>



                        <Grid item xs={12}>

                            <TextField

                                required

                                fullWidth

                                label="Email Address"

                                name="email"

                                type="email"

                                value={formData.email}

                                onChange={handleChange}

                            />

                        </Grid>



                        <Grid item xs={12} sm={6}>

                            <TextField

                                select

                                fullWidth

                                label="Role"

                                name="role"

                                value={formData.role}

                                onChange={handleChange}

                            >

                                <MenuItem value="Admin">Admin</MenuItem>

                                <MenuItem value="Manager">Manager</MenuItem>

                                <MenuItem value="User">User</MenuItem>

                            </TextField>

                        </Grid>



                        <Grid item xs={12} sm={6}>

                            <FormControl component="fieldset">

                                <FormLabel component="legend">Status</FormLabel>

                                <RadioGroup

                                    row

                                    name="status"

                                    value={formData.status}

                                    onChange={handleChange}

                                >

                                    <FormControlLabel

                                        value="Active"

                                        control={<Radio color="primary" />}

                                        label="Active"

                                    />

                                    <FormControlLabel

                                        value="Inactive"

                                        control={<Radio color="primary" />}

                                        label="Inactive"

                                    />

                                </RadioGroup>

                            </FormControl>

                        </Grid>



                        <Grid item xs={12}>

                            <Typography variant="h6" sx={{ mt: 2, mb: 2, color: theme.palette.primary.main }}>

                                Security

                            </Typography>

                            <Divider sx={{ mb: 3 }} />

                        </Grid>



                        <Grid item xs={12}>

                            <Button

                                variant="outlined"

                                color="warning"

                            >

                                Reset Password

                            </Button>

                        </Grid>



                        <Grid item xs={12} sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>

                            <Button

                                type="button"

                                variant="outlined"

                                onClick={() => navigate('/dashboard/users')}

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

                                Save Changes

                            </Button>

                        </Grid>

                    </Grid>

                </Box>

            </Paper>

        </Box>

    )

}



export default EditUserPlaceholder 