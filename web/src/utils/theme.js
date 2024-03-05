import createTheme from '@mui/material/styles/createTheme';
import { teal } from '@mui/material/colors';

export const defaultTheme = createTheme(
    {
        palette: {
            primary: teal,
            light: {
                main: teal[100],
                light: teal[50],
                ultralight: '#eff9f9',
                dark: teal[200],
                contrastText: teal[900],
            }
        }
    }
);