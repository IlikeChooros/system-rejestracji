import { AppBar, Box, IconButton, Toolbar, Tooltip } from "@mui/material";
import ExitIcon from '@mui/icons-material/ExitToApp';
import { useAuth } from "../../auth.tsx";
import { useNavigate } from "react-router-dom";


export default function Navbar(){
    const {logout} = useAuth();
    const navigate = useNavigate();
    return(
        <AppBar
            position='sticky'
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 3,
            }}
        >
            <Toolbar>
                <Box sx={{flexGrow: 1}} />
                <Box sx={{display: {xs: 'none', sm: 'block'}}}>
                    <IconButton
                        edge='start'
                        color='inherit'
                        aria-label='menu'
                        size="large"
                        onClick={() => {
                            logout();
                            navigate('/');
                        }}
                    >
                        <Tooltip title="Wyloguj">
                            <ExitIcon fontSize="large" />
                        </Tooltip>
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    )
}