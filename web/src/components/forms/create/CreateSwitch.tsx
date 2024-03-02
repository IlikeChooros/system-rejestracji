import React from 'react';
import { CreateInputTextProps } from '../../create/types.ts';
import { Checkbox, FormControlLabel } from '@mui/material';

export default function CreateSwitchInput({
	input,
	onChange,
}: CreateInputTextProps) {
	return (
		<FormControlLabel
			control={
				<Checkbox
					value={input.value}
					onChange={(e) => {
						onChange(input, e.target.checked);
					}}
					name={input.field_name}
					color="secondary"
				/>
			}
			label={input.name}
		/>
	);
}
