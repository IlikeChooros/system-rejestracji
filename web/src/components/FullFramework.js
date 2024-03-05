import { Box } from "@mui/material";
import MainFramework from "./MainFramework";
import Navbar from "./navbar/Navbar";

export default function FullFramework({ children }) {
    return(
        <MainFramework>
            <Box
                sx={{
                    backgroundColor: 'light.light',
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'auto',
                    minHeight: '100vh',
                }}
            >
            <Navbar />
            
                {children}
            </Box>
        </MainFramework>
    )
}