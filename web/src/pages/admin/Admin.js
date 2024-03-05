import { InputAdornment, Typography } from "@mui/material";
import FullFramework from "../../components/FullFramework";
import { CustomTableBody, RowBase } from "../../components/tables/CustomTable";
import { UnstyledResponsiveTable } from "../../components/tables/ResponsiveTable";
import TableHeaderWithOrdering from "../../components/tables/TableHeaderWithOrdering";
import { GeneralTableProvider, useDefaultTableContext } from "../../providers/CustomTable";
import { FilterDataProvider } from "../../providers/FilterData";
import { NewFilterSet } from "../../components/filters/NewFilterSet.tsx";
import { createStringInput, setProps, statusInput } from "../../datastructures/input-objects.ts";
import SearchIcon from '@mui/icons-material/Search';
import MuiCard from "../../components/mui-ready/MuiCard.js";
import React from "react";

export default function Admin() {

    const forms = React.useMemo(() => [
        createStringInput('Wyszukaj', 'search', '', 
            {
                variant: 'outlined',
                InputProps: {
                    endAdornment: (
                    <InputAdornment position="end">
                        <SearchIcon />
                    </InputAdornment>
                )}
            }
        ),
        setProps(statusInput, {variant: 'outlined'}),
    ], [])

    return(
    <FullFramework>
        <GeneralTableProvider
            apiUrl={'list/registry'}
        >
            <MuiCard
                headerStyle={{ paddingBottom: '8px' }}
                title={"Lista rezerwacji"}
                cardProps={{sx: {my: 4, mx: 2}}}
                titleTypographyProps={{
                    textAlign: 'center',
                    component: 'h1',
                    variant: 'h5',
                }}
            >
                <UnstyledResponsiveTable
                    head={
                        <FilterDataProvider>
                            <NewFilterSet
                                convert={false}
                                grids={[4,4]}
                                forms={forms}    
                            />
                        </FilterDataProvider>
                    }
                    thead={
                        <TableHeaderWithOrdering 
                            first={
                                <Typography variant="body2" textAlign={'center'}>
                                    Zarządzaj
                                </Typography>
                            }
                            useContext={useDefaultTableContext} 
                            fields_with_order={[
                                ["first_name", "Imię"], 
                                ["last_name", "Nazwisko"],
                                ["date", "Data rezerwacji"], 
                            ]}
                        />
                    }
                    context={useDefaultTableContext}
                >
                    <CustomTableBody 
                        key_prefix="reservation_table"
                        ignore_keys={["registry_uuid"]}
                        Row={RowBase}
                        urls={[undefined, 'admin/manage/']}
                        rowProps={{
                            useDelete: false,
                            useDetails: false,
                            modifyProps: {
                                text: 'Zarządzaj',
                                props: {
                                    color: 'primary',
                                }
                            }
                        }}
                    />
                </UnstyledResponsiveTable>
            </MuiCard>
        </GeneralTableProvider>
    </FullFramework>
    )
}