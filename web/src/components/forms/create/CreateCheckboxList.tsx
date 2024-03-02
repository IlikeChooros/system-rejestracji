import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';

import { CreateInputTextProps } from '../../create/types.ts';
import { Box, ListSubheader } from '@mui/material';

export default function CreateCheckboxListInput({
	input,
	handleCheckbox,
}: CreateInputTextProps) {
	return (
		<Box
			style={{
				borderRadius: '16px',
				color: 'secondary.contrastText',
			}}
			sx={{
				bgcolor: 'indigo50.main',
			}}
		>
			<Box
				sx={{
					borderRadius: '16px 16px 0 0',
					textAlign: 'center',
				}}
			>
				{input.name}
			</Box>

			<List
				sx={{
					bgcolor: 'indigo50.light',
					color: 'secondary.contrastText',
				}}
				style={{
					width: '100%',
					maxHeight: input.maxHeight ? input.maxHeight : 250,
					minHeight: input.minHeight ? input.minHeight : 100,
					overflow: 'auto',
					borderRadius: '0 0 16px 16px',
				}}
			>
				{input?.datalist?.map((opt) => {
					let labelId = `checkbox-list-label-${opt.value}`;
					return (
						<ListItem
							key={`${input.field_name}=${opt.name}=${opt.value}`}
							disablePadding
						>
							<ListItemButton
								onClick={() => {
									if (handleCheckbox) {
										handleCheckbox(input, opt);
									}
								}}
								role={undefined}
								dense
							>
								<ListItemIcon>
									<Checkbox
										edge="start"
										checked={opt.checked}
										tabIndex={-1}
										disableRipple
										inputProps={{
											'aria-labelledby': labelId,
										}}
										color="secondary"
										sx={{
											p: 0,
											py: '3px',
											paddingLeft: '5px',
										}}
									/>
								</ListItemIcon>
								<ListItemText id={labelId} primary={opt.name} />
							</ListItemButton>
						</ListItem>
					);
				})}
			</List>
		</Box>
	);
}
