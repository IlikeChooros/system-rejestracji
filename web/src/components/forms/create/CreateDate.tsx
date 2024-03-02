import React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/pl';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { CreateInputTextProps } from '../../create/types.ts';

export default function CreateInputDate({
	input,
	onChange,
}: CreateInputTextProps) {
	return (
		<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pl">
			<DatePicker
				slotProps={{
					textField: {
						fullWidth: true,
						size: 'small',
						color: 'primary',
						variant: 'standard',
						label: input.name,
						name: input.field_name,
						...input.props,
					},
				}}
				value={input.value}
				onChange={(date) => onChange(input, date)}
				{...input.dateProps}
			/>
		</LocalizationProvider>
	);
}
