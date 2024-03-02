import React from 'react';
import { Autocomplete, Box, TextField } from '@mui/material';
import { CreateInputTextProps } from '../../create/types.ts';

export default function CreateAutocompleteInput({
	input,
	onChange,
}: CreateInputTextProps) {
	return (
		<Autocomplete
			options={input.datalist ? input.datalist : []}
			autoHighlight
			freeSolo={input.freeSolo}
			isOptionEqualToValue={(option, value) => {
				return option.name === value;
			}}
			getOptionLabel={(option) =>
				typeof option === 'string' ? option : option.name
			}
			value={input.value}
			onChange={(e, value) => {
				onChange(input, value?.name ? value.name : null);
			}}
			onInputChange={
				input.freeSolo
					? (e, value) => {
							onChange(input, value);
					  }
					: undefined
			}
			renderOption={(props, option) => {
				return (
					<Box component="li" {...props}>
						{option.name}
					</Box>
				);
			}}
			renderInput={(params) => (
				<TextField
					{...params}
					{...input.props}
					label={input.name}
					fullWidth
					size="small"
					color="secondary"
					variant="standard"
				/>
			)}
		/>
	);
}
