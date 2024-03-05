import * as React from 'react';
import { useDefaultTableContext } from '../../providers/CustomTable';
import { useDefaultFilterContext } from '../../providers/FilterData.js';
import {
	InputTemplateForm,
	createCheckboxList,
	createChoiceInput,
	createDateInput,
	createStringInput,
} from '../../datastructures/input-objects.ts';
import { FilterFormHandler } from '../create/CreateFormHandler.tsx';
import { QueryChoiceHandler } from '../create/QueryChoiceHandler.tsx';
import { FormSubmitHandler } from '../create/FormGenerator.tsx';
import {
	FormDataProvider,
	useFormDataContext,
} from '../../providers/FormData.tsx';
import {
	formsEntriesMapToSearch,
	formsToEntriesSearch,
} from '../../datastructures/converters.js';
import { FormArray } from '../create/types.ts';
import SearchLoader from './SearchLoader.js';

interface FilterObject {
	type: 'choice' | 'text' | 'date' | 'checkbox' | 'switch';
	default_value: string | null | number | boolean;
	name: string;
	lookup: string;
	datalist: Array<any>;
	props: {};
	query: boolean;
}

export function NewFilterSet({
	useContextForUpdate = useDefaultTableContext,
	useFilterContext = useDefaultFilterContext,
	filter_url = '',
	datakeys = [''],
	mapIndexes = [0],
	grids = [4, 4, 4, 10, 2, 2],
	forms,
	convert = true,
}) {
	const { setFilters } = useFilterContext();
	const {
		setSearch,
		setState,
		setPage,
		order_by,
		state: searchState,
	} = useContextForUpdate();

	const convertedForms = React.useMemo((): Array<InputTemplateForm> => {
		if (!convert) {
			return forms;
		}

		let converted = new Array<InputTemplateForm>(forms.length);
		for (let i = 0; i < forms.length; i++) {
			switch (forms[i].type) {
				case 'choice':
					converted[i] = createChoiceInput(
						forms[i].name,
						forms[i].lookup,
					);
					break;
				case 'text':
					converted[i] = createStringInput(
						forms[i].name,
						forms[i].lookup,
					);
					break;
				case 'date':
					converted[i] = createDateInput(
						forms[i].name,
						forms[i].lookup,
					);
					break;
				case 'checkbox':
					converted[i] = createCheckboxList(
						forms[i].name,
						forms[i].lookup,
					);
					break;
				case 'switch':
					let datalist = [
						{ name: 'Aktywni', value: 'false' },
						{ name: 'Usunięci', value: 'true' },
					];
					if (forms[i].datalist.length) {
						try {
							datalist[0].name = String(forms[i].datalist[1]); // first assing to 'true'
							datalist[1].name = String(forms[i].datalist[0]);
						} catch (e) {}
					}
					converted[i] = createChoiceInput(
						forms[i].name,
						forms[i].lookup,
						forms[i].default_value !== null
							? String(forms[i].default_value)
							: 'false',
						datalist,
						{}, // props
						true, // noEmpty
					);
					break;
				default:
					console.warn(
						'Invalid type of filter',
						forms[i].type,
						forms[i],
					);
			}
		}
		return converted;
	}, [forms]);

	function handleQuery(forms: FormArray) {
		let newFilters = formsToEntriesSearch(forms);
		setFilters(newFilters);
		let params = new URLSearchParams(formsEntriesMapToSearch(newFilters));
		params.set('order_by', order_by ? order_by : 'default');
		setSearch(params.toString());
		setPage(1);
		setState(!searchState);
	}

	return (
		<FormDataProvider forms={convertedForms}>
			<FormSubmitHandler
				onSubmit={(inputs) => handleQuery(inputs)}
			>
				<SearchLoader
					useTableContext={useContextForUpdate}
					useFormContext={useFormDataContext}
				/>
				<QueryChoiceHandler
					url={filter_url ? `filters/${filter_url}` : undefined}
					datakeys={datakeys}
					formIndexes={mapIndexes}
				/>
				<FilterFormHandler
					useFilterContext={useFilterContext}
					useContextForUpdate={useContextForUpdate}
					grids={grids}
				/>
			</FormSubmitHandler>
		</FormDataProvider>
	);
}

