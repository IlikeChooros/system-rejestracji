import React, { useEffect } from 'react';
import { Grid } from '@mui/material';
import { FormGenerator } from './FormGenerator.tsx';
import { FormArray, HandleCheckboxType, OnChangeFormHandler } from './types.ts';
import {
	FormDataContext,
	useFormDataContext,
} from '../../providers/FormData.tsx';

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