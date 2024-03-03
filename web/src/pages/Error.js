import { Box, Link, Typography } from "@mui/material";
import MainFramework from "../components/MainFramework";
import ErrorIcon from '@mui/icons-material/Error';

export function ErrorPage(){
    return (
        <MainFramework>
            <Box textAlign={'center'} marginTop={'10%'}>
                <Typography variant="h5">Błąd 404</Typography>
                <Typography variant="h4">Nie znaleziono strony</Typography>
                <Typography variant='h6'>Wróć do <Link href="/">strony głównej</Link></Typography>
                <ErrorIcon sx={{fontSize: 100, color: 'crimson', marginTop: 2}} />
            </Box>
        </MainFramework>
    )
}