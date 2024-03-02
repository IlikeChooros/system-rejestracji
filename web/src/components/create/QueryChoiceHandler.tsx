import React, { useEffect } from 'react';
import {
	FormDataContext,
	useFormDataContext,
} from '../../providers/FormData.tsx';
import { fetchAny } from '../../clients/dataRequest.js';
import { useNavigate } from 'react-router-dom';
import { Datalist } from '../../datastructures/input-objects.ts';

interface QueryChoiceHandlerProps {
	url: string;
	datakeys: Array<string>;
	formIndexes: Array<number>;
	useContext?: () => FormDataContext;
	refresh?: boolean;
}

export function QueryChoiceHandler({
	url,
	datakeys,
	formIndexes,
	useContext = useFormDataContext,
	refresh = false,
}: QueryChoiceHandlerProps) {
	const { state, dispatch } = useContext();

	useEffect(() => {
		fetchAny(url).then((data) => {
			if (!data) {
				return;
			}
			let copy = { ...state };
			let omap = new Map<string, Datalist>(Object.entries(data));
			for (let i = 0; i < datakeys.length; i++) {
				let list = omap.get(datakeys[i]);
				if (typeof list !== 'undefined') {
					if (copy.forms[formIndexes[i]].type === 'checkbox-list') {
						list = list.map((value) => {
							return { ...value, checked: false };
						});
					}
					copy.forms[formIndexes[i]].datalist = list;
					copy.forms[formIndexes[i]].state =
						!copy.forms[formIndexes[i]].state;
				}
			}
			dispatch({ type: 'state', state: copy });
			dispatch({ type: 'loaded' });
		});
	}, [refresh]);

	return <></>;
}
