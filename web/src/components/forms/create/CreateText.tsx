import React from 'react';
import TextField from '@mui/material/TextField';
import { CreateInputTextProps } from '../../create/types.ts';

export default function CreateInputText({
	input,
	onChange,
}: CreateInputTextProps) {
	return (
		<TextField
			label={input.name}
			value={input.value}
			onChange={(e) => {
				onChange(input, e.target.value);
			}}
			fullWidth
			size="small"
			color="primary"
			variant="standard"
			{...input.props}
		/>
	);
}
