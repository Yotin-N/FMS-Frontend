import { createTheme } from '@mui/material/styles'



// Green and white theme for Farm Management System 

const theme = createTheme({

    palette: {

        primary: {

            main: '#2e7d32', // Dark green 

            light: '#4caf50', // Standard green 

            dark: '#1b5e20', // Darker green 

            contrastText: '#ffffff',

        },

        secondary: {

            main: '#e8f5e9', // Very light green 

            light: '#f1f8e9', // Even lighter green 

            dark: '#c8e6c9', // Light green 

            contrastText: '#1b5e20',

        },

        background: {

            default: '#ffffff',

            paper: '#f5f5f5',

        },

        text: {

            primary: '#212121',

            secondary: '#757575',

        },

        error: {

            main: '#d32f2f',

        },

        warning: {

            main: '#ff9800',

        },

        info: {

            main: '#03a9f4',

        },

        success: {

            main: '#4caf50',

        },

    },

    typography: {

        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',

        h1: {

            fontWeight: 500,

        },

        h2: {

            fontWeight: 500,

        },

        h3: {

            fontWeight: 500,

        },

        h4: {

            fontWeight: 500,

        },

        h5: {

            fontWeight: 500,

        },

        h6: {

            fontWeight: 500,

        },

        button: {

            textTransform: 'none', // Prevent all-caps buttons 

            fontWeight: 500,

        },

    },

    shape: {

        borderRadius: 8,

    },

    components: {

        MuiButton: {

            styleOverrides: {

                root: {

                    borderRadius: 8,

                    padding: '8px 16px',

                },

                contained: {

                    boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',

                },

            },

        },

        MuiCard: {

            styleOverrides: {

                root: {

                    borderRadius: 12,

                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',

                },

            },

        },

        MuiTextField: {

            styleOverrides: {

                root: {

                    marginBottom: 16,

                },

            },

        },

    },

})



export default theme 