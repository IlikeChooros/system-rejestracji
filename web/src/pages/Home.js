import React from "react";
import MainFramework from "../components/MainFramework";
import { Backdrop, Box, CircularProgress } from "@mui/material";
import { registerFormWithConsent, serializeFormsToEntries } from "../datastructures/input-objects.ts";
import { FormDataProvider, useFormDataContext } from "../providers/FormData.tsx";
import { FormSubmitHandler } from "../components/create/FormGenerator.tsx";
import MuiCard from "../components/mui-ready/MuiCard.js";
import { CreateFormHandler } from "../components/create/CreateFormHandler.tsx";
import { ErrorButton, SuccessButton } from "../components/buttons/Buttons.js";
import { fetchAny, postAny } from "../clients/dataRequest.js";
import dayjs from "dayjs";
import { useDefaultMessageContext } from "../providers/AlertMessage.js";
import { useNavigate } from "react-router-dom";


export default function Home() {
    
    const navigate = useNavigate();
    const {setNewAlert} = useDefaultMessageContext();
    const [reload, setReload] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    async function onSubmit(inputs) {
        let data = serializeFormsToEntries(inputs);
        data = Object.fromEntries(data);
        let waitForEmail = data.email !== '';

        setLoading(waitForEmail);
        try{
            await postAny('registry', data);
            let message = 'Dziękujemy za rejestrację';
            if (waitForEmail){
                message += ', sprawdź swoją skrzynkę emailową.';
            }
            navigate('/thank-you', {state: {message}});
        }
        catch(err){
            setReload(!reload);
            let details = err.response.data?.details;
            if (!details){
                details = 'Nie udało się zarejestrować';
            } 
            setNewAlert(details, 'error');
        }
        setLoading(false);
    }

    return (
        <>
        <Backdrop
            sx={{
                color: '#fff',
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={loading}
        >
                <MuiCard
                    title="Wysyłanie emaila potwierdzającego..."
                    cardStyle={{
                        textAlign: 'center',
                        padding: '20px',
                        backgroundColor: '#ECF2FD'
                    }}
                    headerStyle={{paddingBottom: '8px'}}
                >
                    <CircularProgress color={'primary'} />
                </MuiCard>
        </Backdrop>
        
        <MainFramework>
            <Box padding={3} textAlign={'center'}>
                <FormDataProvider forms={registerFormWithConsent}>
                    <FormSubmitHandler onSubmit={onSubmit}>
                        <DateDiscard fetch={reload}/>
                        <MuiCard
                            sx={{ marginTop: '20px', padding: '10px' }}
                            title={"Zarejestruj się"}
                            subheader="Wypełnij poniższe pola, aby zarejestrować się na udział w peregrynacji ikony po parafii Miłosierdzia Bożego."
                            cardStyle={{ backgroundColor: '#F6FBFF' }}
                            headerStyle={{ paddingBottom: '8px' }}
                        >
                            <CreateFormHandler grids={[4,4,4,4,4,4,12]} />
                            <Box
                                sx={{ paddingTop: '10px', px: '20px', display: 'flex' }}
                            >
                                <Box sx={{ flexGrow: 1 }}></Box>
                                <SuccessButton text={"Zarejestruj się"} />
                            </Box>
                        </MuiCard>
                    </FormSubmitHandler>
                </FormDataProvider>
            </Box>
        </MainFramework>
        </>
        
    );
}

function DateDiscard({fetch = true}){
    const {dispatch} = useFormDataContext();

    React.useEffect(() => {
        fetchAny('registry')
            .then((data) => {
                let dates = [];
                if(data){
                    dates = data.map((date) => new dayjs(date.date));
                    console.log(dates);
                }
                dispatch({type: 'update-field', id: 5, field: 'dateProps', value: {
                    disablePast: true,
                    shouldDisableDate: (date) => {
                        return dates.some((d) => d.isSame(date, 'day'));
                    }
                }});
            }).catch((err) => {
                console.log(err);
            });
    }
    , [fetch]);

    return (<></>)
}