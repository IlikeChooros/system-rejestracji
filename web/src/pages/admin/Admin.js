import { Fade, Typography } from "@mui/material";
import FullFramework from "../../components/FullFramework";
import { CustomTableBody, RowBase } from "../../components/tables/CustomTable";
import { ResponsisveTable } from "../../components/tables/ResponsiveTable";
import TableHeaderWithOrdering from "../../components/tables/TableHeaderWithOrdering";
import { GeneralTableProvider, useDefaultTableContext } from "../../providers/CustomTable";


export default function Admin() {


    return(
        <FullFramework>
            <GeneralTableProvider
                apiUrl={'list/registry'}
            >
                <ResponsisveTable
                    title="Lista rezerwacji"
                    context={useDefaultTableContext}
                    thead={
                        <TableHeaderWithOrdering 
                            first={
                                <Typography variant="body2" textAlign={'center'}>
                                    Akcje
                                </Typography>
                            }
                            useContext={useDefaultTableContext} 
                            fields_with_order={[
                                ["first_name", "Imię"], 
                                ["last_name", "Nazwisko"],
                                ["date", "Data rezerwacji"], 
                            ]}
                        />}
                >
                    <CustomTableBody 
                        key_prefix="reservation_table"
                        ignore_keys={["registry_uuid"]}
                        Row={RowBase}
                    />
                </ResponsisveTable>
            </GeneralTableProvider>
        </FullFramework>
    )
}