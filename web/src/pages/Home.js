import React from "react";
import MainFramework from "../components/MainFramework";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { registerForms, serializeFormsToEntries } from "../datastructures/input-objects.ts";
import { FormDataProvider } from "../providers/FormData.tsx";
import { FormSubmitHandler } from "../components/create/FormGenerator.tsx";
import MuiCard from "../components/mui-ready/MuiCard.js";
import { CreateFormHandler } from "../components/create/CreateFormHandler.tsx";
import { ErrorButton, SuccessButton } from "../components/buttons/Buttons.js";
import { fetchAny, postAny } from "../clients/dataRequest.js";


export default function Home() {
    
    async function onSubmit(inputs) {
        let data = serializeFormsToEntries(inputs);
        data = Object.fromEntries(data);

        try{
            postAny('registry', data);
        }
        catch(err){
            console.log(err);
        }
    }

    React.useEffect(() => {
        fetchAny('registry').then((res) => {
            console.log(res);
        });
    }
    , []);

    return (
        <MainFramework>
            <Box padding={3} textAlign={'center'}>
                <FormDataProvider forms={registerForms}>
                    <FormSubmitHandler onSubmit={onSubmit}>
                        <MuiCard
                            sx={{ marginTop: '20px', padding: '10px' }}
                            title={"Zarejestruj się"}
                            subheader="Wypełnij poniższe pola, aby zarejestrować się na udział w peregrynacji ikony po parafii Miłosierdzia Bożego."
                            cardStyle={{ backgroundColor: '#F6F8FC' }}
                            headerStyle={{ paddingBottom: '8px' }}

                        >
                            <CreateFormHandler grids={[4,4,4,4,4,4]} />
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