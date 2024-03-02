import { Box, Link, Typography } from "@mui/material";
import MainFramework from "../components/MainFramework";
import ErrorIcon from '@mui/icons-material/Error';

export function ErrorPage(){
    return (
        <MainFramework>
            <Box padding={6} textAlign={'center'}>
                <Typography variant="h5">404. Nie znaleziono strony</Typography>
                <Typography variant="h6">Wróć do <Link href="/">strony głównej</Link></Typography>
                <ErrorIcon sx={{fontSize: 100, color: 'red', marginTop: 2}} />
            </Box>
        </MainFramework>
    )
}