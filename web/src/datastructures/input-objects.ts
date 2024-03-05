import { BaseTextFieldProps } from '@mui/material/TextField';
import { DatePickerProps } from '@mui/x-date-pickers';
import { serializeDate } from './converters';
import dayjs from 'dayjs';

export type InputValue =
	| string
	| dayjs.Dayjs
	| Number
	| Array<any>
	| null
	| boolean
	| Date
	| undefined;
export type InputType =
	| 'date'
	| 'string'
	| 'number'
	| 'choice'
	| 'autocomplete'
	| 'checkbox-list'
	| 'switch';
export type Datalist = Array<DatalistElement>;
export type InputValidator = (value: InputValue) => boolean;
export type RealtiveInputValidator = (
	value: Array<InputHandlerForm>,
) => boolean;
type InputValueConverter = (value: InputValue) => string | Number | Date | any;
export type RelationType = (
	input: InputTemplateForm,
	forms: Array<InputHandlerForm>,
) => Array<InputHandlerForm>;
/**
 * ## DatalistElement
 * - `value`: string | Number, value of choice element,
 * - `name`: name of choice, visual representation of the choice
 * - `checked`: wheter this option is check (only in checkboxlist)
 */
export interface DatalistElement {
	name: string;
	value: string | number;
	checked?: boolean;
}

export interface DateProps {
	minDate?: null | any | Date;
	maxDate?: null | any | Date;
}

export interface InputTemplateForm {
	name: string;
	field_name: string;
	value: InputValue;
	type: InputType;
	default_value: InputValue;
	datalist?: Datalist;
	props?: BaseTextFieldProps;
	dateProps?: DatePickerProps<dayjs.Dayjs>;
	validator?: InputValidator;
	toString: InputValueConverter;
	relativeValidator?: RealtiveInputValidator;
	relation?: RelationType;

	// for autocomplete
	freeSolo?: boolean;

	// for checkbox list
	minHeight?: number;
	maxHeight?: number;

	// for switch
	noEmpty?: boolean;
}

export interface InputHandlerForm extends InputTemplateForm {
	id: number;
	state: boolean;
}

const defaultNumberValidator: InputValidator = (value: InputValue): boolean => {
	value = value?.toString();
	if (value === undefined || value === null) {
		return false;
	}
	return !Boolean(value?.length) || /^[0-9\b]+$/.test(value);
};

export function createNumberInput(
	name: string,
	field_name: string,
	default_value: InputValue = undefined,
	props?: BaseTextFieldProps,
	validator: InputValidator = defaultNumberValidator,
	relativeValidator?: RealtiveInputValidator,
): InputTemplateForm {
	return {
		name,
		field_name,
		value: default_value,
		type: 'number',
		props: props,
		default_value,
		validator,
		toString: (value) => value?.toString(),
		relativeValidator,
	};
}

export function createStringInput(
	name: string,
	field_name: string,
	default_value: string = '',
	props?: BaseTextFieldProps,
	relativeValidator?: RealtiveInputValidator,
	validator?: InputValidator,
): InputTemplateForm {
	return {
		name,
		field_name,
		value: default_value,
		default_value,
		type: 'string',
		props,
		toString: (value) => value,
		relativeValidator,
		validator
	};
}

export function createDateInput(
	name: string,
	field_name: string,
	default_value: InputValue = null,
	props?: BaseTextFieldProps,
	dateProps?: DateProps,
): InputTemplateForm {
	return {
		name,
		field_name,
		value: default_value,
		default_value,
		type: 'date',
		props,
		dateProps,
		toString: (value) => serializeDate(value, true),
	};
}

export function createChoiceInput(
	name: string,
	field_name: string,
	default_value: Number | string = '',
	datalist: Array<DatalistElement> = [],
	props?: BaseTextFieldProps,
	noEmpty: boolean = false,
): InputTemplateForm {
	return {
		name,
		field_name,
		value: default_value,
		default_value,
		datalist,
		type: 'choice',
		props: props,
		noEmpty,
		toString: (value) => value?.toString(),
	};
}

export function createAutoCompleteInput(
	name: string,
	field_name: string,
	default_value: Number | string | null | undefined = null,
	datalist: Array<DatalistElement> = [],
	props?: BaseTextFieldProps,
	freeSolo: boolean = false,
): InputTemplateForm {
	return {
		name,
		field_name,
		datalist,
		value: default_value,
		default_value,
		type: 'autocomplete',
		props: props,
		toString: (value) => value?.toString(),
		freeSolo,
	};
}

export function createCheckboxList(
	name: string,
	field_name: string,
	default_value: Number | string = '',
	datalist: Array<DatalistElement> = [],
	props?: BaseTextFieldProps,
	minHeight?: number,
	maxHeight?: number,
): InputTemplateForm {
	return {
		name,
		field_name,
		datalist,
		value: default_value,
		default_value,
		type: 'checkbox-list',
		props: props,
		toString: (value) => '',
		minHeight,
		maxHeight,
	};
}

export function createSwitchInput(
	name: string,
	field_name: string,
	default_value: boolean = false,
	props?: BaseTextFieldProps,
): InputTemplateForm {
	return {
		name,
		field_name,
		value: default_value,
		default_value,
		type: 'switch',
		toString: (value) => (value ? 'true' : 'false'),
		props,
	};
}

export function checkIfErrors(inputs: Array<InputHandlerForm>): boolean {
	let hasErrors = false;
	for (let i = 0; i < inputs.length; i++) {
		if (inputs[i].props?.error) {
			hasErrors = true;
			break;
		}
	}
	return hasErrors;
}

type InclusionType = 'and' | 'or';

/**
 * Checks if the inputs are empty, with given inclusion type
 *
 * @param inputs submitted forms
 * @param inclusion either: 'or', 'and', 'or' -> if any of the inputs is empty, return true, 'and' -> if all inputs are empty, return true
 * @returns boolean
 */
export function checkIfEmpty(
	inputs: Array<InputHandlerForm>,
	inclusion: InclusionType = 'and',
): boolean {
	let entries = serializeFormsToEntries(inputs);

	if (inclusion === 'and') {
		for (let i = 0; i < entries.length; i++) {
			if (!entries[i][1]?.length || !entries[i][1]) {
				return true;
			}
		}
		return false;
	}
	let isEmpty = true;

	for (let i = 0; i < entries.length; i++) {
		if (entries[i][1]?.length || entries[i][1]) {
			isEmpty = false;
			break;
		}
	}
	return isEmpty;
}

export function isExistingOption(autocomplete: InputHandlerForm): boolean {
	return (
		autocomplete.datalist?.findIndex(
			(option) => autocomplete.value === option.name,
		) !== -1 && Boolean(autocomplete.value)
	);
}

export function forceNullIfEmptyString(inputs: Array<InputHandlerForm>) {
	let copy = new Array<InputHandlerForm>(inputs.length);
	for (let i = 0; i < inputs.length; i++) {
		copy[i] = {
			...inputs[i],
			value:
				typeof inputs[i].value === 'string' && !inputs[i].value
					? null
					: inputs[i].value,
		};
	}
	return copy;
}

export function serializeFormsToEntries(
	inputs: Array<InputHandlerForm>,
	integer_null = false,
) {
	let entries = new Array<any[]>(inputs.length);
	for (let i = 0; i < inputs.length; i++) {
		if (inputs[i].type === 'checkbox-list') {
			let datalist = inputs[i].datalist;
			if (datalist) {
				entries[i] = [
					inputs[i].field_name,
					datalist
						.filter((option) => option.checked)
						.map((option) => option.value),
				];
			}
			continue;
		}
		if (inputs[i].type === 'autocomplete' && !inputs[i].freeSolo) {
			let filtered = inputs[i].datalist?.filter(
				(value) => value.name === inputs[i].value,
			)[0];
			// Find value
			entries[i] = [
				inputs[i].field_name,
				filtered !== undefined ? filtered.value : null,
			];
			continue;
		}

		let value = inputs[i].value;
		if (
			integer_null &&
			inputs[i].type === 'number' &&
			inputs[i].value === ''
		) {
			value = null;
		} else {
			value =
				inputs[i].value !== null || inputs[i].value !== undefined
					? inputs[i].toString(inputs[i].value)
					: null;
		}
		entries[i] = [inputs[i].field_name, value !== undefined ? value : null];
	}
	return entries;
}

export function peselValidator(pesel: string) {
	if (pesel.length !== 11) {
		return true;
	}

	const peselSum =
		Number(pesel[0]) * 9 +
		Number(pesel[1]) * 7 +
		Number(pesel[2]) * 3 +
		Number(pesel[3]) * 1 +
		Number(pesel[4]) * 9 +
		Number(pesel[5]) * 7 +
		Number(pesel[6]) * 3 +
		Number(pesel[7]) * 1 +
		Number(pesel[8]) * 9 +
		Number(pesel[9]) * 7;

	const peselCheck = 10;
	const peselDiv = peselSum % peselCheck;
	const peselLast = Number(pesel[10]);

	if (peselDiv === peselLast) {
		return false;
	}
	return true;
}

export function makeRequired(form: InputTemplateForm): InputTemplateForm {
	form.props = {
		...form.props,
		required: true,
	};
	return form;
}

export function makeFreeSolo(form: InputTemplateForm): InputTemplateForm {
	form.freeSolo = true;
	return form;
}

export function setRealtiveValidator(
	form: InputTemplateForm,
	validator: RealtiveInputValidator,
): InputTemplateForm {
	return { ...form, relativeValidator: validator };
}

export function setValidator(
	form: InputTemplateForm,
	validator: InputValidator,
): InputTemplateForm {
	return { ...form, validator };
}

export function setRelation(
	input: InputTemplateForm,
	relation: RelationType,
): InputTemplateForm {
	return { ...input, relation };
}

export function setHeights(
	input: InputTemplateForm,
	minHeight: number,
	maxHeight: number,
): InputTemplateForm {
	return { ...input, minHeight, maxHeight };
}

export function setProps(
	input: InputTemplateForm,
	props: BaseTextFieldProps,
): InputTemplateForm {
	return { ...input, props };
}

export function translateInputProps(
	forms: Array<InputTemplateForm>,
	translateFunc: (arg: InputTemplateForm) => InputTemplateForm,
): Array<InputTemplateForm> {
	let translated = [...forms];
	for (let i = 0; i < translated.length; i++) {
		translated[i] = translateFunc(translated[i]);
	}
	return translated;
}

export const statusInput: InputTemplateForm = createChoiceInput(
	'Status', 'deleted', 'false', 
	[{
		value: 'false',
		name: 'Aktywny'
	}, {
		value: 'true',
		name: 'Usunięty'
	}],
	{
		variant: 'standard'
	}, true
)

export const registerForms: Array<InputTemplateForm> = [
	createStringInput('Imię', 'first_name', '', { required: true }),
	createStringInput('Nazwisko', 'last_name', '', {required: true}),
	createStringInput('Email', 'email', '', {type: 'email', required: false}),
	createStringInput('Adres', 'address', '', { required: true }),
	createStringInput('Telefon', 'phone_number', '', { required: true, helperText: 'Telefon musi być poprawny' }, undefined, (input: InputValue) => {
		const phone = input?.toString();
		if (phone === undefined || !phone.length) {
			return false;
		}
		// phone number validation
		return !(defaultNumberValidator(phone) && phone.length === 9);
	}),
	createDateInput('Data przyjęcia ikony', 'date', null, { required: true }, {disablePast: true}),
	
];

export const registerFormsWithDelete: Array<InputTemplateForm> = [
	...registerForms,
	statusInput
];

export const registerFormWithConsent: Array<InputTemplateForm> = [
	...registerForms,
	createSwitchInput('Wyrażam zgodę na przetwarzanie moich danych osobowych przez Parafię pw. Miłosierdzia Bożego w Oławie w celu organizacji peregrynacji ikony.', 'consent', false,
		{required: true, helperText: 'Zgoda jest wymagana'}),
];
