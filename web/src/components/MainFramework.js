import { CssBaseline, ThemeProvider } from '@mui/material';
import { defaultTheme } from '../utils/theme';

export default function MainFramework({ children }) {
	return (
		<ThemeProvider theme={defaultTheme}>
			<CssBaseline />
            {children}
		</ThemeProvider>
	);
}
