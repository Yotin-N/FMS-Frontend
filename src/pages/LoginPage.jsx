import { useState } from 'react'

import { Link as RouterLink, useNavigate } from 'react-router-dom'

import {

    Avatar,

    Box,

    Button,

    Container,

    TextField,

    Typography,

    Link,

    Paper,

    Grid,

    IconButton,

    InputAdornment,

    useTheme

} from '@mui/material'

import LockOutlinedIcon from '@mui/icons-material/LockOutlined'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import Visibility from '@mui/icons-material/Visibility'

import VisibilityOff from '@mui/icons-material/VisibilityOff'

import { loginUser } from '../services/api'



const LoginPage = ({ onLogin }) => {

    const navigate = useNavigate()

    const theme = useTheme()



    const [formData, setFormData] = useState({

        email: '',

        password: ''

    })



    const [errors, setErrors] = useState({})

    const [showPassword, setShowPassword] = useState(false)

    const [isSubmitting, setIsSubmitting] = useState(false)



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



    const validateForm = () => {

        const newErrors = {}



        // Email validation 

        if (!formData.email) {

            newErrors.email = 'Email is required'

        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {

            newErrors.email = 'Email address is invalid'

        }



        // Password validation 

        if (!formData.password) {

            newErrors.password = 'Password is required'

        }



        setErrors(newErrors)

        return Object.keys(newErrors).length === 0

    }



    const handleSubmit = async (e) => {

        e.preventDefault()



        if (!validateForm()) return



        setIsSubmitting(true)



        try {

            // Call the API service 

            const response = await loginUser(formData)

            console.log('Login successful:', response)



            // Call the login handler from props 

            onLogin()



            // Redirect to dashboard 

            navigate('/dashboard')

        } catch (error) {

            console.error('Login failed:', error)

            setErrors({

                form: 'Invalid email or password. Please try again.'

            })

        } finally {

            setIsSubmitting(false)

        }

    }



    const handleTogglePassword = () => {

        setShowPassword(!showPassword)

    }



    return (

        <Container component="main" maxWidth="xs">

            <Paper

                elevation={3}

                sx={{

                    mt: 8,

                    p: 4,

                    display: 'flex',

                    flexDirection: 'column',

                    alignItems: 'center',

                    borderRadius: 2,

                    border: `1px solid ${theme.palette.secondary.light}`

                }}

            >

                <Box sx={{ mb: 2, width: '100%' }}>

                    <IconButton

                        component={RouterLink}

                        to="/"

                        sx={{ p: 0, color: theme.palette.primary.main }}

                    >

                        <ArrowBackIcon />

                        <Typography variant="body2" sx={{ ml: 1 }}>

                            Back to Home

                        </Typography>

                    </IconButton>

                </Box>



                <Avatar sx={{ m: 1, bgcolor: theme.palette.primary.main }}>

                    <LockOutlinedIcon />

                </Avatar>

                <Typography component="h1" variant="h5" sx={{ mb: 3 }}>

                    Sign in

                </Typography>



                {errors.form && (

                    <Typography color="error" variant="body2" sx={{ mb: 2 }}>

                        {errors.form}

                    </Typography>

                )}



                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>

                    <TextField

                        margin="normal"

                        required

                        fullWidth

                        id="email"

                        label="Email Address"

                        name="email"

                        autoComplete="email"

                        autoFocus

                        value={formData.email}

                        onChange={handleChange}

                        error={!!errors.email}

                        helperText={errors.email}

                    />

                    <TextField

                        margin="normal"

                        required

                        fullWidth

                        name="password"

                        label="Password"

                        type={showPassword ? 'text' : 'password'}

                        id="password"

                        autoComplete="current-password"

                        value={formData.password}

                        onChange={handleChange}

                        error={!!errors.password}

                        helperText={errors.password}

                        InputProps={{

                            endAdornment: (

                                <InputAdornment position="end">

                                    <IconButton

                                        aria-label="toggle password visibility"

                                        onClick={handleTogglePassword}

                                        edge="end"

                                    >

                                        {showPassword ? <VisibilityOff /> : <Visibility />}

                                    </IconButton>

                                </InputAdornment>

                            )

                        }}

                    />



                    <Button

                        type="submit"

                        fullWidth

                        variant="contained"

                        color="primary"

                        disabled={isSubmitting}

                        sx={{ mt: 3, mb: 2, py: 1.5 }}

                    >

                        {isSubmitting ? 'Signing in...' : 'Sign In'}

                    </Button>



                    <Grid container spacing={2}>

                        <Grid item xs={12} sm={6}>

                            <Link component={RouterLink} to="/register" variant="body2" sx={{ color: theme.palette.primary.main }}>

                                {"Don't have an account? Sign Up"}

                            </Link>

                        </Grid>

                        <Grid item xs={12} sm={6} sx={{ textAlign: { sm: 'right' } }}>

                            <Link href="#" variant="body2" sx={{ color: theme.palette.primary.main }}>

                                Forgot password?

                            </Link>

                        </Grid>

                    </Grid>

                </Box>

            </Paper>

        </Container>

    )

}



export default LoginPage 