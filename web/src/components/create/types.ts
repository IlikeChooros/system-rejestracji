import {
	Datalist,
	DatalistElement,
	InputHandlerForm,
	InputValue,
} from '../../datastructures/input-objects.ts';

export type OnChangeFormHandler = (
	input: InputHandlerForm,
	value: InputValue,
) => void;

export type FormArray = Array<InputHandlerForm>;

export interface FormState {
	forms: FormArray;
	isLoading: boolean;
}

export type Actions =
	| { type: 'set-value'; id: number; value: InputValue }
	| { type: 'state'; state: FormState }
	| { type: 'validate'; state: FormState; id: number }
	| { type: 'clear' }
	| { type: 'loaded' }
	| { type: 'set-filters'; params: Map<string, string> }
	| { type: 'checkbox'; id: number; option: DatalistElement }
	| { type: 'update-field'; id: number; field: string; value: any };

export type HandleCheckboxType = (
	input: InputHandlerForm,
	option: DatalistElement,
) => void;

export interface CreateInputTextProps {
	input: InputHandlerForm;
	onChange: OnChangeFormHandler;
	handleCheckbox?: (input: InputHandlerForm, option: DatalistElement) => void;
}
