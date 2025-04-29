// File: src/components/common/Placeholder.jsx 

import { Box, Typography, useTheme } from '@mui/material'



const Placeholder = ({ text }) => {

    const theme = useTheme()



    return (

        <Box

            sx={{

                display: 'flex',

                alignItems: 'center',

                justifyContent: 'center',

                backgroundColor: theme.palette.secondary.light,

                color: theme.palette.primary.main,

                borderRadius: 2,

                p: 4,

                minHeight: 200,

                border: `1px dashed ${theme.palette.primary.light}`

            }}

        >

            <Typography variant="h6">{text || 'Placeholder Component'}</Typography>

        </Box>

    )

}



export default Placeholder 