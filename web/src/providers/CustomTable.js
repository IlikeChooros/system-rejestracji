import { createContext, useContext, useState } from 'react';
import { useAuth } from '../auth.tsx';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { client } from '../clients/clients';

export const InitialContext = {
	size: 0,
	setSize: (size = 0) => {},
	data: [],
	setData: () => {},
	page: 1,
	setPage: (size = 0) => {},
	errMsg: '',
	state: true,
	setState: (state = false) => {},
	search: '',
	setSearch: (string = '') => {},
	loader: true,
	setLoader: () => {},
	order_by: '',
	setOrderBy: () => {},
	orderFocus: 0,
	setOrderFocus: (size = 0) => {},
	defaultQuery: { name: '', value: '' },
	setDefaultQuery: (arg = { name: '', value: '' }) => {},
	isLoading: false,
};

export const DefaultTableContext = createContext(InitialContext);

export function useDefaultTableContext() {
	return useContext(DefaultTableContext);
}

/**
 * Creates Provider, using, by default, DefaultTableContext, which can be accessed with
 * `useDefaultTableContext()` hook.
 */
export function GeneralTableProvider({
	children,
	apiUrl,
	Context = DefaultTableContext,
	loader = true,
	default_query = undefined,
}) {
	const { token } = useAuth();

	async function loadDataTable(apiUrl, page, search, id) {
		client.defaults.headers.common['Authorization'] = `JWT ${token}`;
		return client.get(`${apiUrl}?page=${page}&${search}`).then(
			(response) => response.data);
	}
	return (
		<CustomTableProvider
			apiUrl={apiUrl}
			Context={Context}
			loadData={loadDataTable}
			defaultLoader={loader}
			default_query={default_query}
		>
			{children}
		</CustomTableProvider>
	);
}


/**
 * 
 * 
 * 
Provides table data (with setters):
   - `data` (array of data, for example in WorkerTable data = workers)
   - `size` (size of TOTAL number of items for given query, used for pagination - max page calculation)
   - `page` (current page)
   - `state` (used as a loader, has an Effect set, whenever this value changes, CustomTableProvider will request data from backend)
   - `search` (filter params)
   - `errMsg` (if an error occurs when requesting data, error message will be written here)
   - `order_by` (sort parameter added to search query)
   - `orderFocus` (set sort focus - only one active at the time)
*/
export function CustomTableProvider({
	children,
	apiUrl,
	Context,
	loadData,
	defaultLoader = true,
	id,
	default_query = { value: '', name: '' },
}) {
	const [data, setData] = useState([]); // table data
	const [size, setSize] = useState(0); // total size of query, without data stripping
	const { logout } = useAuth(); // authorization hook
	const navigate = useNavigate(); // redirect
	const [page, setPage] = useState(1); // table paging
	const [errMsg, setErrMsg] = useState(''); // error message
	const [state, setState] = useState(false); // hook to reload table -> fetch data from backend
	const [search, setSearch] = useState(''); // filter params
	const [order_by, setOrderBy] = useState('');
	const [orderFocus, setOrderFocus] = useState(0);
	const [loader, setLoader] = useState(defaultLoader);
	const [isLoading, setIsLoading] = useState(true);
	const [firstLoad, setFirstLoad] = useState(true);
	const [defaultQuery, setDefaultQuery] = useState(default_query);

	function fetchData() {
		if (!apiUrl) {
			return;
		}
		setErrMsg('');
		setIsLoading(true);
		loadData(apiUrl, page, search, id)
			.then((data) => {
				if (typeof data !== 'object') {
					setData([]);
					setSize(0);
					throw new Error('Nie otrzymano danych od serwera');
				}
				setData(data.results);
				setSize(data.count);
				if (data.count === 0) {
					setErrMsg('Brak danych.');
				}
				setIsLoading(false);
			})
			.catch((error) => {
				if (error.response && (
					error.response.status === 401 || error.response.status === 403
				)) {
					logout();
					navigate('/login');
				}
				setErrMsg(error.message);
				setIsLoading(false);
			});
	}

	useEffect(() => {
		if (loader && !firstLoad) {
			fetchData();
		}
	}, [state, loader]);

	useEffect(() => {
		if (firstLoad) {
			setFirstLoad(false);
		}
		if (!loader) {
			return;
		}
		setSearch((prev) => {
			let params = new URLSearchParams(prev);
			params.set('ordering', order_by);
			return params.toString();
		});
		setState((prev) => !prev);
	}, [order_by]);

	const value = {
		size,
		setSize,
		data,
		setData,
		page,
		setPage,
		errMsg,
		state,
		setState,
		search,
		setSearch,
		isLoading,
		order_by,
		setOrderBy,
		orderFocus,
		setOrderFocus,
		loader,
		setLoader,
		defaultQuery,
		setDefaultQuery,
	};

	return <Context.Provider value={value}>{children}</Context.Provider>;
}
