import React from "react";
import { Box, Typography } from "@mui/material";
import MainFramework from "../components/MainFramework";
import {Fade} from "@mui/material";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useLocation } from "react-router-dom";


export default function ThankYouPage() {
    const [message, setMessage] = React.useState('Dziękujemy za rejestrację, sprawdź swoją skrzynkę emailową.');
    const {state} = useLocation();

    React.useEffect(() => {
        if (state?.message){
            setMessage(state.message);
        }
    }
    , [state]);

    return (
        <MainFramework>
            <Fade in={true} timeout={2000}>
                <Box textAlign={'center'} padding={6}>
                    <Typography variant="h5">{message}</Typography>
                    <DoneAllIcon sx={{fontSize: 100, color: 'green', marginTop: 2}} />
                </Box>
            </Fade>
        </MainFramework>
    );
}