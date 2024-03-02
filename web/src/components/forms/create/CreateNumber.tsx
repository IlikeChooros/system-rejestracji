import React from 'react';
import TextField from '@mui/material/TextField';
import { CreateInputTextProps } from '../../create/types.ts';

export default function CreateInputNumber({
	input,
	onChange,
}: CreateInputTextProps) {
	return (
		<TextField
			label={input.name}
			value={input.value}
			onChange={(e) => {
				if (input.validator && input.validator(e.target.value)) {
					onChange(input, e.target.value);
				}
			}}
			fullWidth
			size="small"
			color="secondary"
			variant="standard"
			{...input.props}
		/>
	);
}
