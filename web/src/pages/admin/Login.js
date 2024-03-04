import { Box, Button, Container, Fade, Typography } from "@mui/material";
import { FormDataProvider } from "../../providers/FormData.tsx";
import { createStringInput, createSwitchInput, serializeFormsToEntries } from "../../datastructures/input-objects.ts";
import { FormSubmitHandler } from "../../components/create/FormGenerator.tsx";
import { CreateFormHandler } from "../../components/create/CreateFormHandler.tsx";
import { useAuth } from "../../auth.tsx";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


export default function Login(){

    const {login, errors, isAuthenticated} = useAuth();
    const navigate = useNavigate();

    const forms = [
        createStringInput('Nazwa użytkownika', 'username', '', {required: true, variant: 'outlined'}),
        createStringInput('Hasło', 'password', '', {required: true, type: 'password', variant: 'outlined'}),
        createSwitchInput('Zapamiętaj mnie', 'remember', false),
    ]

    useEffect(() => {
        if (isAuthenticated){
            navigate('/admin');
        }
    }, [isAuthenticated])

    return(
        <Container
            maxWidth='sm'
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '90vh',
            }}
        >
            <Fade in timeout={600}>
                <Box
                    sx={{  
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    borderRadius: "16px",
                    boxShadow: 1,
                    p: 4,
                    }}
                >
                    <FormDataProvider forms={forms}>
                        <Typography component="h1" variant="h5" marginBottom={3}>
                            Zaloguj się
                        </Typography>
                        <FormSubmitHandler
                            onSubmit={(inputs) => {
                                let {username, password, remember} = Object.fromEntries(serializeFormsToEntries(inputs));
                                login(username, password, remember);
                            }}
                        >
                            <CreateFormHandler grids={[12,12,12]} />

                            <Button
                                type='submit'
                                fullWidth
                                variant='contained'
                                sx={{mt: 3, mb: 2}}
                            >
                                Zaloguj
                            </Button>

                            <Typography variant='body2' color='error'>
                                {errors}
                            </Typography>
                        </FormSubmitHandler>
                    </FormDataProvider>
                </Box>
            </Fade>

        </Container>
    )
}