import React, { useEffect } from 'react';
import {
	FormDataContext,
	useFormDataContext,
} from '../../providers/FormData.tsx';
import { fetchAny } from '../../clients/dataRequest.js';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

export interface QueryChoiceHandlerProps {
	url?: string;
	datakeys?: Array<string>;
	useContext?: () => FormDataContext;
	ignoreLoading?: boolean;
	setData?: (data: any | ((data: any) => any)) => void;
}

export function DefaultValueFormSetter({
	url,
	datakeys,
	useContext = useFormDataContext,
	ignoreLoading = false,
	setData = (data) => {},
}: QueryChoiceHandlerProps) {
	const { state, dispatch } = useContext();

	useEffect(() => {
		if (!url) {
			return;
		}
		if (!ignoreLoading && state.isLoading) {
			return;
		}
		fetchAny(url).then((data) => {
			if (!data || !datakeys) {
				return;
			}
			let copy = { ...state };
			setData(data);
			let omap = new Map<string, any>(Object.entries(data));
			for (let i = 0; i < datakeys.length; i++) {
				let value = omap.get(datakeys[i]);

				if (value !== undefined && value !== null) {
					if (copy.forms[i] === undefined) {
						console.error(
							'DefaultValueFormSetter: form not found: ',
							datakeys[i],
						);
						continue;
					}

					switch (copy.forms[i].type) {
						case 'number':
							value = String(value);
							break;
						case 'date':
							value = dayjs(value);
							break;
						case 'checkbox-list':
							// we expect list of ids from backend
							let datalist = copy.forms[i].datalist;
							if (datalist) {
								for (let j = 0; j < datalist.length; j++) {
									for (let k = 0; k < value.length; k++) {
										if (datalist[j].value === value[k]) {
											datalist[j].checked = true;
										}
									}
								}
							}
							copy.forms[i].datalist = datalist;
						default:
							break;
					}
				} else {
					value = copy.forms[i].default_value;
				}

				copy.forms[i].value = value;
				copy.forms[i].default_value = copy.forms[i].value;
				copy.forms[i].state = !copy.forms[i].state;
			}
			dispatch({ type: 'state', state: copy });
		});
	}, [state.isLoading, url]);

	return <></>;
}
