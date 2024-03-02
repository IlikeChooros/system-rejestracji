import React from "react";
import MainFramework from "../components/MainFramework";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { registerForms } from "../datastructures/input-objects.ts";
import { FormDataProvider } from "../providers/FormData.tsx";
import { FormSubmitHandler } from "../components/create/FormGenerator.tsx";
import MuiCard from "../components/mui-ready/MuiCard.js";
import { CreateFormHandler } from "../components/create/CreateFormHandler.tsx";
import { ErrorButton, SuccessButton } from "../components/buttons/Buttons.js";


export default function Home() {
    
    function onSubmit(inputs) {
        console.log(inputs);
    }

    return (
        <MainFramework>
            <Box padding={3} textAlign={'center'}>
                <FormDataProvider forms={registerForms}>
                    <FormSubmitHandler onSubmit={onSubmit}>
                        <MuiCard
                            sx={{ marginTop: '20px', padding: '10px' }}
                            title={"Zarejestruj się"}
                            cardStyle={{ backgroundColor: '#ffffff' }}
                            headerStyle={{ paddingBottom: '8px' }}
                        >
                            <CreateFormHandler grids={[4,4,4,6,6]} />
                            <Box
                                sx={{ paddingTop: '10px', px: '20px', display: 'flex' }}
                            >
                                <ErrorButton
                                    text="Anuluj"
                                    props={{ onClick: () => {} }}
                                />
                                <Box sx={{ flexGrow: 1 }}></Box>
                                <SuccessButton text={"Zarejestruj się"} />
                            </Box>
                        </MuiCard>
                    </FormSubmitHandler>
                </FormDataProvider>
            </Box>
        </MainFramework>
    );
}