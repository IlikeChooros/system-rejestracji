import React, { useEffect } from 'react';
import { Grid } from '@mui/material';
import { FormGenerator } from './FormGenerator.tsx';
import { FormArray, HandleCheckboxType, OnChangeFormHandler } from './types.ts';
import {
	FormDataContext,
	useFormDataContext,
} from '../../providers/FormData.tsx';
import { formsEntriesMapToSearch, formsToEntriesSearch } from '../../datastructures/converters.js';
import { useDefaultTableContext } from '../../providers/CustomTable.js';
import { useDefaultFilterContext } from '../../providers/FilterData.js';

export interface FormHandlerProps {
	grids: Array<number>;
	useContext?: () => FormDataContext;
	sliceStart?: number;
	sliceEnd?: number;
}

interface FormRendererProps {
	forms: FormArray;
	grids: number[];
	onChange: OnChangeFormHandler;
	handleCheckbox: HandleCheckboxType;
}

function FormRenderer({
	forms,
	grids,
	onChange,
	handleCheckbox,
}: FormRendererProps) {
	return (
		<Grid container spacing={3}>
			{forms.map((input, index) => {
				return (
					<Grid
						key={`formHandler=${index}=${input.field_name}`}
						item
						md={grids[index] ? grids[index] : 3}
						xs={12}
					>
						<FormGenerator
							input={input}
							onChange={onChange}
							handleCheckbox={handleCheckbox}
						/>
					</Grid>
				);
			})}
		</Grid>
	);
}

/**
 *
 * ### Handles and Renders forms provided by `FormDataProvider`
 *
 */
export function CreateFormHandler({
	grids = [3, 3, 3],
	useContext = useFormDataContext,
	sliceStart = 0,
	sliceEnd = undefined,
}: FormHandlerProps) {
	const { state, dispatch } = useContext();

	const onChange: OnChangeFormHandler = (input, value) => {
		dispatch({ type: 'set-value', id: input.id, value });
	};

	const handleCheckbox: HandleCheckboxType = (input, option) => {
		dispatch({ type: 'checkbox', id: input.id, option });
	};

	return (
		<FormRenderer
			forms={state.forms.slice(sliceStart, sliceEnd)}
			grids={grids}
			onChange={onChange}
			handleCheckbox={handleCheckbox}
		/>
	);
}

export function FilterFormHandler({
	grids = new Array<number>(),
	useContext = useFormDataContext,
	useFilterContext = useDefaultFilterContext,
	useContextForUpdate = useDefaultTableContext,
}) {
	const { setFilters } = useFilterContext();
	const {
		setSearch,
		setState,
		setPage,
		order_by,
		state: searchState,
		default_query,
	} = useContextForUpdate();

	const { state, dispatch } = useContext();
	let stateHelper = React.useRef(false);

	useEffect(() => {
		stateHelper.current = !searchState;
	}, [searchState]);

	function queryHanlder(newFilters: Map<string, any>) {
		setFilters(newFilters);
		let search = new URLSearchParams(formsEntriesMapToSearch(newFilters));
		search.set('order_by', order_by);
		if (default_query) {
			search.set(default_query.name, default_query.value);
		}
		setSearch(search.toString());
		setPage(1);
		setState(stateHelper.current);
	}

	const onChange: OnChangeFormHandler = (input, value) => {
		switch (input.type) {
			case 'date':
			case 'choice':
			case 'switch':
				let copy = [...state.forms];
				copy[input.id].value = value;
				let newFilters = formsToEntriesSearch(copy);
				queryHanlder(newFilters);
			default:
				break;
		}
		dispatch({ type: 'set-value', id: input.id, value });
	};

	const handleCheckbox: HandleCheckboxType = (input, option) => {
		let newFilters = formsToEntriesSearch(state.forms);
		let newVal: any;
		if (option.checked) {
			newVal = newFilters
				.get(input.field_name)
				?.filter((value) => value.id !== option.value);
		} else {
			newVal = newFilters.get(input.field_name);
			if (!newVal) {
				newVal = [];
			}
			newVal.push({ id: option.value, name: option.name });
		}
		newFilters = newFilters.set(input.field_name, newVal);

		queryHanlder(newFilters);
		dispatch({ type: 'checkbox', id: input.id, option });
	};

	return (
		<FormRenderer
			forms={state.forms}
			grids={grids}
			onChange={onChange}
			handleCheckbox={handleCheckbox}
		/>
	);
}
