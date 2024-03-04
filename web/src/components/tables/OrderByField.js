import React from 'react';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import { Button } from '@mui/material';

export default function OrderByField({ children, order_by, useContext, id }) {
	const { setOrderBy, orderFocus, setOrderFocus } = useContext();
	const [useOrder, setUseOrder] = React.useState('no-sort');
	const [focused, setFocused] = React.useState(false);

	return (
		<Button
			color="inherit"
			style={{ textTransform: 'none', textAlign: 'start' }}
			sx={{
				width: '100%',
				height: '100%',
				py: '2px',
				px: 0,
				m: 0,
			}}
			onClick={() => {
				if (orderFocus !== id) {
					setOrderBy(order_by);
					setOrderFocus(id);
					setUseOrder('sort-down');
					return;
				}
				let newOrderBy, newOrder;
				switch (useOrder) {
					case 'no-sort':
						newOrder = 'sort-down';
						newOrderBy = order_by;

						break;
					case 'sort-down':
						newOrder = 'sort-uButtonBase';
						newOrderBy = `-${order_by}`;

						break;
					default:
						newOrder = 'no-sort';
						newOrderBy = '';
				}
				setOrderBy(newOrderBy);
				setOrderFocus(id);
				setUseOrder(newOrder);
			}}
			onFocus={(e) => {
				if (!focused) {
					setFocused(true);
				}
			}}
			onBlur={() => {
				if (focused) {
					setFocused(false);
				}
			}}
			endIcon={
				<>
					{orderFocus !== id || useOrder === 'no-sort' ? (
						<DefaultSort focus={focused} />
					) : useOrder === 'sort-down' ? (
						<SortDown focus={focused} />
					) : (
						<SortUp focus={focused} />
					)}
				</>
			}
		>
			{children}
		</Button>
	);
}

function DefaultSort({ focus = false }) {
	return (
		<ImportExportIcon style={{ color: focus ? '#1e1e1e' : '#939393' }} />
	);
}

function SortUp({ focus = false }) {
	return <NorthIcon style={{ color: focus ? '#1e1e1e' : '#939393' }} />;
}

function SortDown({ focus = false }) {
	return <SouthIcon style={{ color: focus ? '#1e1e1e' : '#939393' }} />;
}
