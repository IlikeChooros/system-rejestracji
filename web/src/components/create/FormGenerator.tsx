import React from 'react';
import { useMemo } from 'react';
import {
	DatalistElement,
	InputHandlerForm,
} from '../../datastructures/input-objects.ts';
import CreateInputDate from '../forms/create/CreateDate.tsx';
import ChoiceCreateInput from '../forms/create/CreateChoice.tsx';
import CreateInputNumber from '../forms/create/CreateNumber.tsx';
import CreateInputText from '../forms/create/CreateText.tsx';
import { FormArray, HandleCheckboxType, OnChangeFormHandler } from './types.ts';
import {
	FormDataContext,
	useFormDataContext,
} from '../../providers/FormData.tsx';
import CreateAutocompleteInput from '../forms/create/CreateAutocomplete.tsx';
import CreateCheckboxListInput from '../forms/create/CreateCheckboxList.tsx';
import CreateSwitchInput from '../forms/create/CreateSwitch.tsx';
import { Box } from '@mui/material';

interface FormGeneratorProps {
	input: InputHandlerForm;
	onChange: OnChangeFormHandler;
	handleCheckbox?: HandleCheckboxType;
}

function GenerateForm(
	input: InputHandlerForm,
	onChange: OnChangeFormHandler,
	handleCheckbox?: HandleCheckboxType,
) {
	switch (input.type) {
		case 'string':
			return <CreateInputText input={input} onChange={onChange} />;
		case 'date':
			return <CreateInputDate input={input} onChange={onChange} />;
		case 'number':
			return <CreateInputNumber input={input} onChange={onChange} />;
		case 'autocomplete':
			return (
				<CreateAutocompleteInput input={input} onChange={onChange} />
			);
		case 'checkbox-list':
			return (
				<CreateCheckboxListInput
					input={input}
					onChange={onChange}
					handleCheckbox={handleCheckbox}
				/>
			);

		case 'switch':
			return <CreateSwitchInput input={input} onChange={onChange} />;
		default:
			return <ChoiceCreateInput input={input} onChange={onChange} />;
	}
}

export function FormGenerator({
	input,
	onChange,
	handleCheckbox,
}: FormGeneratorProps) {
	const memoInput = useMemo(
		() => GenerateForm(input, onChange, handleCheckbox),
		[input, input.state, input.datalist],
	);

	return <>{memoInput}</>;
}

interface FormSubmitHandlerProps {
	children?: any;
	onSubmit: (inputs: FormArray) => void;
	useContext?: () => FormDataContext;
}

export function FormSubmitHandler({
	children,
	onSubmit,
	useContext = useFormDataContext,
}: FormSubmitHandlerProps) {
	const { state } = useContext();
	return (
		<Box
			component={'form'}
			onSubmit={(e) => {
				e.preventDefault();
				onSubmit(state.forms);
			}}
		>
			{children}
		</Box>
	);
}
