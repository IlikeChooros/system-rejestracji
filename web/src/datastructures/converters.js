/**
 * Converts date to string: YYYY-MM-DD
 *
 * @param {*} date Date object
 * @returns
 */
export function serializeDate(date, setNull = false) {
	if (!date) {
		return setNull ? null : '';
	}
	return `${date.$y}-${date.$M < 9 ? '0' + (date.$M + 1) : date.$M + 1}-${
		date.$D < 10 ? '0' + date.$D : date.$D
	}`;
}

/**
 *
 * @param {{}} object to display
 * @param {(map: Map) => any[]} converter accepts map of object filtered entries, returns converted entries, in the same order
 * @param  {...any} ignore_keys keys to exclude when rendering
 * @returns
 */
export function objectForTable(object, converter = (map) => [...map], ...ignore_keys) {
	var map = new Map(Object.entries(object));
	var id = map.get('id');
	if (!id) {
		id = map.get('registry_uuid');
	}
	var participated = map.get('participated');

	for (let i = 0; i < ignore_keys.length; i++) {
		map.delete(ignore_keys[i]);
	}

	var entries = converter(map);

	return { id, participated, values: [...entries] };
}


export function setErrorMessage(error, default_message = 'Err') {
	return error?.response?.data?.details
		? String(error.response.data.details)
		: default_message;
}

export function formsToEntriesSearch(forms = []) {
	let search = new Map();
	for (let i = 0; i < forms.length; i++) {
		switch (forms[i].type) {
			case 'checkbox-list':
				search.set(
					forms[i].field_name,
					forms[i].datalist
						.filter((option) => option.checked)
						.map((option) => {
							return {
								id: option.value,
								name: option.name,
							};
						}),
				);
				break;
			default:
				search.set(
					forms[i].field_name,
					forms[i].toString(forms[i].value),
				);
		}
	}
	return search;
}

export function formsEntriesMapToSearch(mapForms = new Map()) {
	let forms = [...mapForms],
		search = '';

	for (let i = 0; i < forms.length; i++) {
		switch (typeof forms[i][1]) {
			case 'object':
				search += `${forms[i][0]}=${
					forms[i][1]?.length
						? forms[i][1].map((value) => value.id).join()
						: ''
				}`;
				break;
			default:
				search += `${forms[i][0]}=${forms[i][1]}`;
		}
		if (i !== forms.length - 1) {
			search += '&';
		}
	}
	return search;
}