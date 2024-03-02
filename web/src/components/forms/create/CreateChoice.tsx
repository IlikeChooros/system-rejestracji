import React from 'react';
import { MenuItem, TextField } from '@mui/material';
import { CreateInputTextProps } from '../../create/types.ts';

export default function ChoiceCreateInput({
	input,
	onChange,
}: CreateInputTextProps) {
	return (
		<TextField
			select
			label={input.name}
			value={input.value === null ? '' : input.value}
			onChange={(e) => {
				onChange(input, e.target.value);
			}}
			fullWidth
			size="small"
			color="secondary"
			variant="standard"
			{...input.props}
		>
			{!input.noEmpty && <MenuItem value="">-</MenuItem>}
			{input?.datalist?.map((opt) => {
				return (
					<MenuItem
						key={`${input.field_name}=${opt.name}=${opt.value}`}
						value={opt.value}
					>
						{opt.name}
					</MenuItem>
				);
			})}
		</TextField>
	);
}
