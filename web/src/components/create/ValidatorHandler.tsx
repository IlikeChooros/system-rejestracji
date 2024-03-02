import React, { useEffect } from 'react';
import { RealtiveInputValidator } from '../../datastructures/input-objects';
import { useFormDataContext } from '../../providers/FormData';

interface ValidatorHandlerProps {
	validators: RealtiveInputValidator[];
	formIndexes: number[];
}

export function ValidatorHandler({
	validators,
	formIndexes,
}: ValidatorHandlerProps) {
	const { state, dispatch } = useFormDataContext();

	useEffect(() => {
		let copy = { ...state };
		for (let i = 0; i < formIndexes.length; i++) {
			copy.forms[formIndexes[i]].relativeValidator = validators[i];
		}
		dispatch({ type: 'state', state: copy });
	}, [validators, formIndexes]);
}
