import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';


export default function Navbar(){
    return(
        <AppBar
            position='sticky'
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
        >
            <Toolbar>
                <Box sx={{flexGrow: 1}} />
                <Box sx={{display: {xs: 'none', sm: 'block'}}}>
                    <IconButton
                        edge='start'
                        color='inherit'
                        aria-label='menu'
                    >
                        <LoginIcon />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    )
}