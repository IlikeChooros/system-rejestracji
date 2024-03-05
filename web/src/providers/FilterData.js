import { createContext, useContext, useState } from 'react';

export const initFilterValue = {
	filters: new Map(),
	setFilters: (map) => {},
};

const defaultFilterContext = createContext(initFilterValue);

export function useDefaultFilterContext() {
	return useContext(defaultFilterContext);
}

export function FilterDataProvider({
	children,
	Context = defaultFilterContext,
}) {
	const [filters, setFilters] = useState(new Map());

	const value = {
		filters,
		setFilters,
	};

	return <Context.Provider value={value}>{children}</Context.Provider>;
}
