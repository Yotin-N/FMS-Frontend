// File: src/pages/DashboardPage.jsx 

import { useState } from 'react'

import { Routes, Route } from 'react-router-dom'

import {

    Box,

    CssBaseline,

    Drawer,

    AppBar,

    Toolbar,

    List,

    Typography,

    Divider,

    IconButton,

    Container,

    Grid,

    Paper,

    ListItem,

    ListItemButton,

    ListItemIcon,

    ListItemText,

    Avatar,

    Menu,

    MenuItem,

    useTheme

} from '@mui/material'

import MenuIcon from '@mui/icons-material/Menu'

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'

import DashboardIcon from '@mui/icons-material/Dashboard'

import PeopleIcon from '@mui/icons-material/People'

import BarChartIcon from '@mui/icons-material/BarChart'

import AgricultureIcon from '@mui/icons-material/Agriculture'

import DevicesIcon from '@mui/icons-material/Devices'

import SettingsIcon from '@mui/icons-material/Settings'

import AccountCircleIcon from '@mui/icons-material/AccountCircle'

import LogoutIcon from '@mui/icons-material/Logout'

import { useNavigate } from 'react-router-dom'



// Placeholder components 


import UserListPlaceholder from "../components/user/UserListPlaceholder";

import CreateUserPlaceholder from '../components/user/CreateUserPlaceholder'

import EditUserPlaceholder from '../components/user/EditUserPlaceholder'

import CreateFarmPlaceholder from '../components/farmDevice/CreateFarmPlaceholder'

import AddDevicePlaceholder from '../components/farmDevice/AddDevicePlaceholder'



const drawerWidth = 240



const DashboardPage = ({ onLogout }) => {

    const theme = useTheme()

    const navigate = useNavigate()

    const [open, setOpen] = useState(true)

    const [anchorEl, setAnchorEl] = useState(null)

    const [selectedIndex, setSelectedIndex] = useState(0)



    const toggleDrawer = () => {

        setOpen(!open)

    }



    const handleProfileMenuOpen = (event) => {

        setAnchorEl(event.currentTarget)

    }



    const handleProfileMenuClose = () => {

        setAnchorEl(null)

    }



    const handleLogout = () => {

        handleProfileMenuClose()

        onLogout()

        navigate('/login')

    }



    const handleListItemClick = (index, path) => {

        setSelectedIndex(index)

        navigate(`/dashboard${path}`)

    }



    const menuItems = [

        { text: 'Dashboard', icon: <DashboardIcon />, path: '' },

        { text: 'Farm Management', icon: <AgricultureIcon />, path: '/farms' },

        { text: 'Device Management', icon: <DevicesIcon />, path: '/devices' },

        { text: 'User Management', icon: <PeopleIcon />, path: '/users' },

        { text: 'Analytics', icon: <BarChartIcon />, path: '/analytics' },

        { text: 'Settings', icon: <SettingsIcon />, path: '/settings' }

    ]



    // Dashboard overview content 

    const renderDashboardOverview = () => (

        <>

            <Typography variant="h4" gutterBottom component="h2" sx={{ mb: 3 }}>

                Dashboard Overview

            </Typography>

            <Grid container spacing={3}>

                {/* Farm Stats Card */}

                <Grid item xs={12} md={6} lg={3}>

                    <Paper

                        sx={{

                            p: 2,

                            display: 'flex',

                            flexDirection: 'column',

                            height: 140,

                            borderRadius: 2,

                            backgroundColor: theme.palette.secondary.light,

                            color: theme.palette.primary.main

                        }}

                    >

                        <Typography component="h3" variant="h6" gutterBottom>

                            Total Farms

                        </Typography>

                        <Typography component="p" variant="h3">

                            3

                        </Typography>

                    </Paper>

                </Grid>



                {/* Devices Card */}

                <Grid item xs={12} md={6} lg={3}>

                    <Paper

                        sx={{

                            p: 2,

                            display: 'flex',

                            flexDirection: 'column',

                            height: 140,

                            borderRadius: 2

                        }}

                    >

                        <Typography component="h3" variant="h6" color="text.secondary" gutterBottom>

                            Active Devices

                        </Typography>

                        <Typography component="p" variant="h3">

                            12

                        </Typography>

                    </Paper>

                </Grid>



                {/* Issues Card */}

                <Grid item xs={12} md={6} lg={3}>

                    <Paper

                        sx={{

                            p: 2,

                            display: 'flex',

                            flexDirection: 'column',

                            height: 140,

                            borderRadius: 2

                        }}

                    >

                        <Typography component="h3" variant="h6" color="text.secondary" gutterBottom>

                            Issues Reported

                        </Typography>

                        <Typography component="p" variant="h3">

                            0

                        </Typography>

                    </Paper>

                </Grid>



                {/* Status Card */}

                <Grid item xs={12} md={6} lg={3}>

                    <Paper

                        sx={{

                            p: 2,

                            display: 'flex',

                            flexDirection: 'column',

                            height: 140,

                            borderRadius: 2,

                            backgroundColor: theme.palette.primary.light,

                            color: 'white'

                        }}

                    >

                        <Typography component="h3" variant="h6" gutterBottom>

                            System Status

                        </Typography>

                        <Typography component="p" variant="h5">

                            Healthy

                        </Typography>

                    </Paper>

                </Grid>



                {/* Recent Activity */}

                <Grid item xs={12}>

                    <Paper

                        sx={{

                            p: 3,

                            display: 'flex',

                            flexDirection: 'column',

                            borderRadius: 2

                        }}

                    >

                        <Typography component="h3" variant="h6" color="text.secondary" gutterBottom>

                            Recent Activity

                        </Typography>

                        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>

                            No recent activity to display.

                        </Typography>

                    </Paper>

                </Grid>

            </Grid>

        </>

    )



    return (

        <Box sx={{ display: 'flex' }}>

            <CssBaseline />



            {/* App Bar */}

            <AppBar

                position="absolute"

                color="default"

                elevation={0}

                sx={{

                    backgroundColor: 'white',

                    borderBottom: `1px solid ${theme.palette.divider}`,

                    zIndex: theme.zIndex.drawer + 1,

                    transition: theme.transitions.create(['width', 'margin'], {

                        easing: theme.transitions.easing.sharp,

                        duration: theme.transitions.duration.leavingScreen,

                    }),

                    ...(open && {

                        marginLeft: drawerWidth,

                        width: `calc(100% - ${drawerWidth}px)`,

                        transition: theme.transitions.create(['width', 'margin'], {

                            easing: theme.transitions.easing.sharp,

                            duration: theme.transitions.duration.enteringScreen,

                        }),

                    }),

                }}

            >

                <Toolbar sx={{ pr: '24px' }}>

                    <IconButton

                        edge="start"

                        color="inherit"

                        aria-label="open drawer"

                        onClick={toggleDrawer}

                        sx={{

                            marginRight: '36px',

                            ...(open && { display: 'none' }),

                        }}

                    >

                        <MenuIcon />

                    </IconButton>

                    <Typography

                        component="h1"

                        variant="h6"

                        color="inherit"

                        noWrap

                        sx={{ flexGrow: 1 }}

                    >

                        Farm Management System

                    </Typography>



                    <IconButton color="inherit" onClick={handleProfileMenuOpen}>

                        <Avatar

                            sx={{

                                width: 32,

                                height: 32,

                                bgcolor: theme.palette.primary.main

                            }}

                        >

                            <AccountCircleIcon fontSize="small" />

                        </Avatar>

                    </IconButton>



                    <Menu

                        anchorEl={anchorEl}

                        open={Boolean(anchorEl)}

                        onClose={handleProfileMenuClose}

                        PaperProps={{

                            sx: { width: 200 }

                        }}

                    >

                        <MenuItem onClick={handleProfileMenuClose}>

                            <ListItemIcon>

                                <AccountCircleIcon fontSize="small" />

                            </ListItemIcon>

                            <ListItemText>Profile</ListItemText>

                        </MenuItem>

                        <MenuItem onClick={handleLogout}>

                            <ListItemIcon>

                                <LogoutIcon fontSize="small" />

                            </ListItemIcon>

                            <ListItemText>Logout</ListItemText>

                        </MenuItem>

                    </Menu>

                </Toolbar>

            </AppBar>



            {/* Drawer */}

            <Drawer

                variant="permanent"

                open={open}

                sx={{

                    '& .MuiDrawer-paper': {

                        position: 'relative',

                        whiteSpace: 'nowrap',

                        width: drawerWidth,

                        transition: theme.transitions.create('width', {

                            easing: theme.transitions.easing.sharp,

                            duration: theme.transitions.duration.enteringScreen,

                        }),

                        boxSizing: 'border-box',

                        ...(!open && {

                            overflowX: 'hidden',

                            transition: theme.transitions.create('width', {

                                easing: theme.transitions.easing.sharp,

                                duration: theme.transitions.duration.leavingScreen,

                            }),

                            width: theme.spacing(7),

                            [theme.breakpoints.up('sm')]: {

                                width: theme.spacing(9),

                            },

                        }),

                    },

                }}

            >

                <Toolbar

                    sx={{

                        display: 'flex',

                        alignItems: 'center',

                        justifyContent: 'flex-end',

                        px: [1],

                    }}

                >

                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>

                        <AgricultureIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />

                        {open && (

                            <Typography variant="subtitle1" color="primary" fontWeight={600}>

                                Farm Management

                            </Typography>

                        )}

                    </Box>

                    <IconButton onClick={toggleDrawer}>

                        <ChevronLeftIcon />

                    </IconButton>

                </Toolbar>

                <Divider />

                <List component="nav">

                    {menuItems.map((item, index) => (

                        <ListItem

                            key={item.text}

                            disablePadding

                            sx={{

                                display: 'block',

                                backgroundColor: selectedIndex === index ? theme.palette.secondary.light : 'transparent',

                                color: selectedIndex === index ? theme.palette.primary.main : 'inherit',

                                '&:hover': {

                                    backgroundColor: theme.palette.secondary.light,

                                }

                            }}

                        >

                            <ListItemButton

                                selected={selectedIndex === index}

                                onClick={() => handleListItemClick(index, item.path)}

                                sx={{

                                    minHeight: 48,

                                    justifyContent: open ? 'initial' : 'center',

                                    px: 2.5,

                                }}

                            >

                                <ListItemIcon

                                    sx={{

                                        minWidth: 0,

                                        mr: open ? 3 : 'auto',

                                        justifyContent: 'center',

                                        color: selectedIndex === index ? theme.palette.primary.main : 'inherit',

                                    }}

                                >

                                    {item.icon}

                                </ListItemIcon>

                                <ListItemText

                                    primary={item.text}

                                    sx={{ opacity: open ? 1 : 0 }}

                                />

                            </ListItemButton>

                        </ListItem>

                    ))}

                </List>

            </Drawer>



            {/* Main Content */}

            <Box

                component="main"

                sx={{

                    backgroundColor: (theme) =>

                        theme.palette.mode === 'light'

                            ? theme.palette.grey[100]

                            : theme.palette.grey[900],

                    flexGrow: 1,

                    height: '100vh',

                    overflow: 'auto',

                }}

            >

                <Toolbar />

                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>

                    <Routes>

                        <Route path="/" element={renderDashboardOverview()} />

                        <Route path="/farms" element={<CreateFarmPlaceholder />} />

                        <Route path="/devices" element={<AddDevicePlaceholder />} />

                        <Route path="/users" element={<UserListPlaceholder />} />

                        <Route path="/users/create" element={<CreateUserPlaceholder />} />

                        <Route path="/users/edit/:id" element={<EditUserPlaceholder />} />

                        <Route path="/analytics" element={<Typography variant="h4">Analytics Placeholder</Typography>} />

                        <Route path="/settings" element={<Typography variant="h4">Settings Placeholder</Typography>} />

                    </Routes>

                </Container>

            </Box>

        </Box>

    )

}



export default DashboardPage;