import React from 'react';
import { CreateInputTextProps } from '../../create/types.ts';
import { Checkbox, FormControlLabel } from '@mui/material';

export default function CreateSwitchInput({
	input,
	onChange,
}: CreateInputTextProps) {
	return (
		<FormControlLabel
			sx={{textAlign: 'left'}}
			control={
				<Checkbox
					value={input.value}
					onChange={(e) => {
						onChange(input, e.target.checked);
					}}
					name={input.field_name}
					color="primary"
					required={input.props?.required}
					
				/>
			}
			label={input.name}
		/>
	);
}
