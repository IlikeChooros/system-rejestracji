import React from 'react';
import { createContext, useContext, useReducer } from 'react';
import { Actions, FormState } from '../components/create/types';
import {
	InputHandlerForm,
	InputTemplateForm,
} from '../datastructures/input-objects.ts';

export interface FormDataContext {
	state: FormState;
	dispatch: React.Dispatch<Actions>;
}

export const DefaultFormDataContextValue: FormDataContext = {
	state: {
		forms: [],
		isLoading: true,
	},
	dispatch: () => {},
};

const DefaultFormDataContext = createContext(DefaultFormDataContextValue);

export function useFormDataContext() {
	return useContext(DefaultFormDataContext);
}

function reducer(state: FormState, action: Actions): FormState {
	let copy = [...state.forms];
	switch (action.type) {
		case 'set-value':
			copy[action.id].value = action.value;
			copy[action.id].state = !copy[action.id].state;
		case 'validate':
			let singleInputValidator = copy[action.id].validator;
			if (singleInputValidator) {
				copy[action.id].props = {
					...copy[action.id].props,
					error: singleInputValidator(copy[action.id].value),
				};
			} else{
				let validator = copy[action.id].relativeValidator;
				if (validator) {
					copy[action.id].props = {
						...copy[action.id].props,
						error: validator(copy),
					};
				}
			}
			
			return { ...state, forms: copy };
		case 'checkbox':
			let datalist = copy[action.id].datalist;
			if (datalist !== undefined) {
				let index = datalist.findIndex(
					(option) => option.value === action.option.value,
				);
				datalist[index].checked = !datalist[index].checked;
			}
			copy[action.id].datalist = datalist;
			copy[action.id].state = !copy[action.id].state;
			return { ...state, forms: [...copy] };
		case 'state':
			return { ...state, ...action.state };
		case 'clear':
			for (let i = 0; i < copy.length; i++) {
				switch (copy[i].type) {
					case 'checkbox-list':
						let datalist = copy[i].datalist;
						if (!datalist) {
							break;
						}
						for (let j = 0; j < datalist.length; j++) {
							datalist[j].checked = false;
						}
						copy[i].datalist = datalist;
						copy[i].state = !copy[i].state;
						break;
					default:
						if (copy[i].value !== copy[i].default_value) {
							copy[i].value = copy[i].default_value;
							copy[i].state = !copy[i].state;
						}
				}
			}
			return { ...state, forms: copy };
		case 'set-filters':
			let entries = action.params.entries();
			for (let [key, value] of entries) {
				let index = copy.findIndex((input) => input.field_name === key);
				if (index < 0) {
					continue;
				}
				copy[index].value = value;
				copy[index].state = !copy[index].state;
			}
			return { ...state, forms: copy };
		case 'loaded':
			return { ...state, isLoading: false };
		default:
			return { ...state };
	}
}

export function initialStateFromData(
	forms: Array<InputTemplateForm>,
): FormState {
	let convertedForms = new Array<InputHandlerForm>(forms.length);
	for (let i = 0; i < forms.length; i++) {
		convertedForms[i] = { ...forms[i], id: i, state: false };
	}
	return { forms: convertedForms, isLoading: true };
}

interface FormDataProps {
	forms: Array<InputTemplateForm>;
	children: any;
}

export function FormDataProvider({ forms, children }: FormDataProps) {
	const [state, dispatch] = useReducer(reducer, initialStateFromData(forms));

	return (
		<DefaultFormDataContext.Provider value={{ state, dispatch }}>
			{children}
		</DefaultFormDataContext.Provider>
	);
}
