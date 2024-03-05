import React from "react";
import { Backdrop, Box, CircularProgress, Fade } from "@mui/material";
import { checkIfErrors, registerForms, serializeFormsToEntries } from "../datastructures/input-objects.ts";
import { FormDataProvider, useFormDataContext } from "../providers/FormData.tsx";
import { FormSubmitHandler } from "../components/create/FormGenerator.tsx";
import MuiCard from "../components/mui-ready/MuiCard.js";
import { CreateFormHandler } from "../components/create/CreateFormHandler.tsx";
import { SuccessButton } from "../components/buttons/Buttons.js";
import { fetchAny } from "../clients/dataRequest.js";
import dayjs from "dayjs";
import { useDefaultMessageContext } from "../providers/AlertMessage.js";
import { useNavigate, useParams } from "react-router-dom";
import { DefaultValueFormSetter } from "../components/create/DefaultValueSetter.tsx";
import CustomButton from "../components/buttons/CustomButton.js";
import DeleteIcon from "@mui/icons-material/Delete";
import { client } from "../clients/clients.js";

export default function Manage({
    to = '/thank-you',
    action = undefined,
    forms = registerForms,
    default_keys = ['first_name', 'last_name', 'email', 'address','phone_number', 'date']
}) {
    
    const navigate = useNavigate();
    const {setNewAlert} = useDefaultMessageContext();
    const [reload, setReload] = React.useState(false);
    const {id} = useParams();
    const [loading, setLoading] = React.useState(false);

    async function onSubmit(inputs) {
        if (checkIfErrors(inputs)){
            setNewAlert('Są błędy w formularzu', 'error');
            return;
        }

        let data = serializeFormsToEntries(inputs);
        data = Object.fromEntries(data);

        setLoading(true);
        try{
            await client.put(`registry/${id}`, data);
            navigate(to, {state: {message: 'Pomyślnie zmodyfikowano wpis'}});
        }
        catch(err){
            setReload(!reload);
            let details = err.response.data?.detail;
            if (!details){
                details = 'Nie udało się zarejestrować';
            } 
            setNewAlert(details, 'error');
        }
        setLoading(false);
    }

    async function deleteEntry(){
        setLoading(true);
        try{
            await client.delete(`registry/${id}`);
            navigate(to, {state: {message: 
                'Pomyślnie usunięto wpis'}});
        }
        catch(err){
            setReload(!reload);
            let details = err.response.data?.detail;
            if (!details){
                details = 'Nie udało się usunąć';
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
            <CircularProgress color={'primary'} />
        </Backdrop>

        
            <Fade in timeout={500}>
                <Box padding={3} textAlign={'center'}>
                    <FormDataProvider forms={forms}>
                        <FormSubmitHandler onSubmit={onSubmit}>
                            <DateDiscard loader={reload} />
                            <DefaultValueFormSetter 
                                url={`registry/${id}`} 
                                datakeys={default_keys} 
                                ignoreLoading 
                                onCatch={(err) => {
                                    navigate('error')
                                }}
                            />
                            <MuiCard
                                sx={{ marginTop: '20px', padding: '10px' }}
                                title={"Zmodyfikuj dane"}
                                subheader="Możesz zmodyfikować dane w formularzu poniżej lub usunąć wpis."
                                cardStyle={{ backgroundColor: '#F6FBFF' }}
                                headerStyle={{ paddingBottom: '8px' }}
                                cardHeaderProps={{
                                    action: action
                                }}
                            >
                                <CreateFormHandler grids={[4,4,4,4,4,4]} />
                                <Box
                                    sx={{ paddingTop: '10px', px: '20px', display: 'flex' }}
                                >
                                    <CustomButton
                                        buttonBaseProps={{ type: 'button', onClick: deleteEntry }}
                                        btnStyle={{ backgroundColor: '#FFEBEE' }}
                                        boxStyle={{ color: '#B71C1C' }}
                                        icon={<DeleteIcon />}
                                        text="Usuń"
                                    />
                                    <Box sx={{ flexGrow: 1 }}></Box>
                                    <SuccessButton text={"Zmodyfikuj "} />
                                </Box>
                            </MuiCard>
                        </FormSubmitHandler>
                    </FormDataProvider>
                </Box>
            </Fade>
    </>
    );
}

function DateDiscard({loader=true}){
    const {state, dispatch} = useFormDataContext();
    const {id} = useParams();

    React.useEffect(() => {
        if (!state.forms[5].default_value){
            return;
        }
        fetchAny(`registry?exclude=${id}`)
            .then((data) => {
                let dates = [];
                if(data){
                    dates = data.map((date) => new dayjs(date.date));
                }
                let dateProps = state.forms[5].dateProps;
                dispatch({type: 'update-field', id: 5, field: 'dateProps', value: {
                    shouldDisableDate: (date) => {
                        return dates.some((d) => d.isSame(date, 'day'));
                    },
                    ...dateProps
                }});
            }).catch((err) => {
                console.log(err);
            });
    }
    , [loader, state.forms[5].default_value]);

    return (<></>)
}