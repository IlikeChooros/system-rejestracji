import { useMemo } from 'react';
import {
	objectForTable,
} from '../../datastructures/converters';
import {
	Box,
	Button,
	Stack,
	TableCell,
	TableRow,
	Typography,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useDefaultTableContext } from '../../providers/CustomTable';

import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

/**
 * ## CustomTableHeaderNoSort - table header without sorting functionality
 *
 *  * `key_prefix` - string, prefix for the table rows
 *  * `fields` - [string][], array of field names
 *  * `first` - first cell
 * @returns
 */
export function CustomTableHeaderNoSort({ key_prefix, fields, first }) {
	return (
		<TableRow>
			<TableCell>{first}</TableCell>
			{fields.map((value, index) => {
				return (
					<TableCell key={`${key_prefix}_${value}_${index}`}>
						{value}
					</TableCell>
				);
			})}
		</TableRow>
	);
}

export function CustomTableDetailsModify({
	key_prefix = 'custom_table_details',
	ignore_keys = ['id'],
	urls = [],
	converter = (map) => map.entries(),
	useContext = useDefaultTableContext,
	setDialog = (value = {}) => {},
}) {
	return (
		<CustomTableBody
			useContext={useContext}
			ignore_keys={ignore_keys}
			key_prefix={key_prefix}
			urls={urls}
			converter={converter}
			Row={RowBase}
			rowProps={{
				setDialog,
			}}
		/>
	);
}

export function CustomTableSend({
	key_prefix = 'custom_table_send',
	ignore_keys = ['id'],
	urls = [],
	converter = (map) => map.entries(),
	useContext = useDefaultTableContext,
}) {
	return (
		<CustomTableBody
			useContext={useContext}
			ignore_keys={ignore_keys}
			key_prefix={key_prefix}
			urls={urls}
			converter={converter}
			Row={RowBase}
		/>
	);
}

/**
 * ## Creates a CustomTableBody, based on given `useContext` and `ignore_keys`
 *
 *  * `key_prefix` - string, prefix for the table rows
 *  * `useContext` - function, TableContext
 *  * `ignore_keys` - [string], keys to not display on the table
 *  * `row` - React.JSX.Element, row for rendering data, default no buttons
 *  * `urls` - [string], only needed if rendering row with buttons, [0] -> details, [1] -> modify
 * @returns
 */
export function CustomTableBody({
	key_prefix = 'custom_table_body',
	useContext = useDefaultTableContext,
	ignore_keys = ['id'],
	Row = CustomTableRow,
	urls = [],
	converter = (map) => [...map],
	rowProps = {},
}) {
	const { data, isLoading } = useContext();

	const to_display = useMemo(() => {
		if (isLoading) {
			return [];
		}
		var arr = [].fill(null, 0, data.length);
		for (let i = 0; i < data.length; i++) {
			arr[i] = objectForTable(data[i], converter, ...ignore_keys);
		}
		return arr;
	}, [data]);

	return (
		<>
			{to_display.map((model) => {
				return (
					<Row
						key={key_prefix + model.id}
						model={model}
						key_prefix={key_prefix}
						urls={urls}
						{...rowProps}
					/>
				);
			})}
		</>
	);
}

export function BaseTableRowEssentials({ model, values, key_prefix }) {
	function render(value) {
		switch (typeof value) {
			case 'string':
			case 'number':
			case 'bigint':
			case 'object':
				return value;
			case 'boolean':
				return (
					<Box flexGrow={1} textAlign={'center'}>
						<RenderBoolean bool={value} />
					</Box>
				);
		}
	}
	return (
		<>
			{values?.map(([key, value]) => {
				return (
					<TableCell key={key_prefix + key + value + model.id}>
						{render(value)}
					</TableCell>
				);
			})}
		</>
	);
}

export function CustomTableRowEssentials({ model, key_prefix }) {
	const values = useMemo(() => {
		let newValues = new Array(model.values.length);
		for (let i = 0; i < model.values.length; i++) {
			newValues[i] = [
				model.values[i][0],
				<Typography
					variant={'body2'}
					// style={{
					// 	maxWidth: '300px', // percentage also works
					// 	whiteSpace: 'nowrap',
					// 	overflow: 'hidden',
					// 	textOverflow: 'ellipsis',
					// }}
				>
					{model.values[i][1]}
				</Typography>,
			];
		}
		return newValues;
	}, [model]);
	return (
		<BaseTableRowEssentials
			model={model}
			values={values}
			key_prefix={key_prefix}
		></BaseTableRowEssentials>
	);
}

function CustomTableRow({ model, key_prefix }) {
	return (
		<TableRow hover>
			<TableCell></TableCell>
			<CustomTableRowEssentials model={model} key_prefix={key_prefix} />
		</TableRow>
	);
}

function CustomButton({
	url,
	model,
	navigate,
	EndIcon,
	text,
	props,
	useUrl = true,
	setOpen = (arg) => {},

	RenderButton = Button
}) {
	return (
		<RenderButton
			style={{
				textTransform: 'none',
				marginLeft: '5px',
				padding: 0,
			}}
			size={'small'}
			onClick={() => {
				if (useUrl) {
					navigate(url ? '/' + url + model.id : '/');
				} else {
					setOpen(model.id);
				}
			}}
			endIcon={EndIcon}
			{...props}
		>
			{text}
		</RenderButton>
	);
}

function DetailsButton({ urls, model }) {
	const navigate = useNavigate();
	return (
		<CustomButton
			url={urls[0]}
			model={model}
			navigate={navigate}
			EndIcon={<VisibilityIcon />}
			text={'Szczegóły'}
			props={{color: 'info'}}
		/>
	);
}

function ModifyButton({
	urls = ['', ''],
	model,
	useUrl = true,
	setOpen = (arg) => {},
	props = {},
}) {
	const navigate = useNavigate();
	return (
		<CustomButton
			url={urls[1]}
			model={model}
			props={{ color: 'success' }}
			navigate={navigate}
			EndIcon={<EditIcon />}
			text={'Modyfikuj'}
			useUrl={useUrl}
			setOpen={setOpen}
			{...props}
		/>
	);
}

function DeleteButton({ model, setDialog = (arg) => {} }) {
	return (
		<Button
			color="error"
			style={{
				textTransform: 'none',
				marginLeft: '5px',
				padding: 0,
			}}
			size={'small'}
			onClick={() => {
				let omap = new Map(model.values);
				omap.set('id', model.id);
				setDialog({
					open: true,
					model: omap,
				});
			}}
			endIcon={<DeleteIcon />}
		>
			Usuń
		</Button>
	);
}

function RenderBoolean({ bool }) {
	return (
		<>
			{bool ? (
				<CheckCircleRoundedIcon style={{ color: '#1cc586' }} />
			) : (
				<CancelRoundedIcon style={{ color: '#e93445' }} />
			)}
		</>
	);
}

/**
 *
 *  * `key_prefix` - string, prefix for the table rows
 *  * `useContext` - function, TableContext
 *  * `ignore_keys` - [string], keys to not display on the table
 *  * `row` - React.JSX.Element, row for rendering data
 */
export function RowBase({
	model,
	key_prefix,
	urls,
	setDialog = (value = {}) => {},
	setOpen = (arg) => {},

	useModifyUrl = true,
	useDetails = true,
	useModify = true,
	useDelete = true,

	modifyProps = {},
}) {
	return (
		<TableRow hover>
			<TableCell padding="checkbox">
				<Stack direction={'row'} spacing={3}>
					{useDetails && <DetailsButton model={model} urls={urls} />}
					{useModify && (
						<ModifyButton
							model={model}
							urls={urls}
							useUrl={useModifyUrl}
							setOpen={setOpen}
							props={modifyProps}
						/>
					)}
					{useDelete && (
						<DeleteButton model={model} setDialog={setDialog} />
					)}
				</Stack>
			</TableCell>
			<BaseTableRowEssentials
				model={model}
				values={model.values}
				key_prefix={key_prefix}
			/>
		</TableRow>
	);
}

