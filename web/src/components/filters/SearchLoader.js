import { useEffect, useState } from 'react';
import { useDefaultTableContext } from '../../providers/CustomTable';
import { useFormDataContext } from '../../providers/FormData.tsx';
import { useSearchParams } from 'react-router-dom';

/**
 * ### Search Loader
 * Requires providers:
 *  - FormDataProvider
 *  - TableProvider (has implemented methods: setSearch, - attributes: search, state)
 *
 */
export default function SearchLoader({
	useFormContext = useFormDataContext,
	useTableContext = useDefaultTableContext,
}) {
	const { dispatch } = useFormContext();
	const { search, setSearch, state, setOrderBy, defaultQuery } =
		useTableContext();
	const [params, setParams] = useSearchParams();
	const [firstLoad, setFirstLoad] = useState(true);

	useEffect(() => {
		if (firstLoad) {
			// On mount, load from search values to input forms
			dispatch({ type: 'set-filters', params });
			if (params.has('order_by')) {
				setOrderBy(params.get('order_by'));
			}
			setSearch(params.toString());
			setFirstLoad(false);
		} else {
			let newParams = new URLSearchParams(search);
			if (defaultQuery !== undefined) {
				newParams.set(defaultQuery.name, defaultQuery.value);
			}
			// Update search params when form changes
			setParams(new URLSearchParams(newParams.toString()), {
				replace: true,
			});
		}
	}, [state]);

	return <></>;
}
