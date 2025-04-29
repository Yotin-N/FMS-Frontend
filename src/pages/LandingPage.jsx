import { useNavigate } from 'react-router-dom'

import {

    Box,

    Button,

    Container,

    Typography,

    Grid,

    Card,

    CardContent,

    CardMedia,

    AppBar,

    Toolbar,

    useTheme,

    useMediaQuery

} from '@mui/material'

import AgricultureIcon from '@mui/icons-material/Agriculture'

import DataUsageIcon from '@mui/icons-material/DataUsage'

import DevicesIcon from '@mui/icons-material/Devices'

import MonitorHeartIcon from '@mui/icons-material/MonitorHeart'



const LandingPage = () => {

    const navigate = useNavigate()

    const theme = useTheme()

    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))



    const features = [

        {

            title: 'Farm Management',

            description: 'Easily manage your farm operations, track resources, and optimize field activities.',

            icon: <AgricultureIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />

        },

        {

            title: 'Data Analytics',

            description: 'Get insights from your farm data with powerful analytics and visualization tools.',

            icon: <DataUsageIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />

        },

        {

            title: 'Device Integration',

            description: 'Connect and manage all your smart farming devices from a single dashboard.',

            icon: <DevicesIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />

        },

        {

            title: 'Health Monitoring',

            description: 'Monitor the health of your crops and livestock with real-time alerts and reports.',

            icon: <MonitorHeartIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />

        }

    ]



    return (

        <Box sx={{ flexGrow: 1 }}>

            {/* Header */}

            <AppBar position="static" color="transparent" elevation={0}>

                <Container maxWidth="lg">

                    <Toolbar disableGutters>

                        <AgricultureIcon sx={{ mr: 2, color: theme.palette.primary.main }} />

                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600, color: theme.palette.primary.main }}>

                            Farm Management System

                        </Typography>

                        <Button

                            color="primary"

                            onClick={() => navigate('/login')}

                            sx={{ mr: 2 }}

                        >

                            Login

                        </Button>

                        <Button

                            variant="contained"

                            color="primary"

                            onClick={() => navigate('/register')}

                        >

                            Sign Up

                        </Button>

                    </Toolbar>

                </Container>

            </AppBar>



            {/* Hero Section */}

            <Box

                sx={{

                    backgroundColor: theme.palette.secondary.light,

                    py: 8,

                    mb: 6

                }}

            >

                <Container maxWidth="lg">

                    <Grid container spacing={4} alignItems="center">

                        <Grid item xs={12} md={6}>

                            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700, color: theme.palette.primary.dark }}>

                                Smart Farming Made Simple

                            </Typography>

                            <Typography variant="h5" component="p" gutterBottom sx={{ mb: 4, color: theme.palette.text.secondary }}>

                                Streamline your agricultural operations with our comprehensive farm management platform

                            </Typography>

                            <Button

                                variant="contained"

                                color="primary"

                                size="large"

                                onClick={() => navigate('/register')}

                                sx={{ mr: 2, px: 4, py: 1.5 }}

                            >

                                Get Started

                            </Button>

                            <Button

                                variant="outlined"

                                color="primary"

                                size="large"

                                sx={{ px: 4, py: 1.5 }}

                            >

                                Learn More

                            </Button>

                        </Grid>

                        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>

                            <Box
                                component="img"
                                src="../assets/react.svg"
                                alt="Farm Management"
                                sx={{
                                    width: '100%',
                                    maxWidth: 500,
                                    height: 300,
                                    backgroundColor: '#e0e0e0',
                                    borderRadius: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Typography variant="body1">
                                    Farm Image Placeholder
                                </Typography>
                            </Box>
                        </Grid>

                    </Grid>

                </Container>

            </Box>



            {/* Features Section */}

            <Container maxWidth="lg" sx={{ mb: 8 }}>

                <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ mb: 6, color: theme.palette.primary.main }}>

                    Key Features

                </Typography>

                <Grid container spacing={4}>

                    {features.map((feature, index) => (

                        <Grid item xs={12} sm={6} md={3} key={index}>

                            <Card sx={{

                                height: '100%',

                                display: 'flex',

                                flexDirection: 'column',

                                borderRadius: theme.shape.borderRadius,

                                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',

                                '&:hover': {

                                    transform: 'translateY(-8px)',

                                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'

                                }

                            }}>

                                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

                                    <Box sx={{ mb: 2 }}>

                                        {feature.icon}

                                    </Box>

                                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>

                                        {feature.title}

                                    </Typography>

                                    <Typography variant="body1" color="text.secondary">

                                        {feature.description}

                                    </Typography>

                                </CardContent>

                            </Card>

                        </Grid>

                    ))}

                </Grid>

            </Container>



            {/* CTA Section */}

            <Box sx={{

                backgroundColor: theme.palette.primary.main,

                color: 'white',

                py: 8,

                mb: 6

            }}>

                <Container maxWidth="md">

                    <Typography variant="h3" component="h2" align="center" gutterBottom>

                        Ready to optimize your farm?

                    </Typography>

                    <Typography variant="h6" component="p" align="center" gutterBottom sx={{ mb: 4 }}>

                        Join thousands of farmers who are already using our platform to increase productivity and profitability.

                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>

                        <Button

                            variant="contained"

                            size="large"

                            onClick={() => navigate('/register')}

                            sx={{

                                mr: 2,

                                px: 4,

                                py: 1.5,

                                backgroundColor: 'white',

                                color: theme.palette.primary.main,

                                '&:hover': {

                                    backgroundColor: theme.palette.secondary.light,

                                }

                            }}

                        >

                            Sign Up Now

                        </Button>

                    </Box>

                </Container>

            </Box>



            {/* Footer */}

            <Box component="footer" sx={{ bgcolor: '#f5f5f5', py: 6 }}>

                <Container maxWidth="lg">

                    <Typography variant="body2" color="text.secondary" align="center">

                        © {new Date().getFullYear()} Farm Management System. All rights reserved.

                    </Typography>

                </Container>

            </Box>

        </Box>

    )

}



export default LandingPage 