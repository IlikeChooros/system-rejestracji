import { TableCell, TableRow } from '@mui/material';
import OrderByField from './OrderByField';

/**
 * Table header with sorting fields
 *
 * - `first` - first th
 * - `fields_with_order` - [['order_field_name', <> Content to display </>], ...]
 * - `key_prefix` - prefix for key element
 * - `useContext` - table context
 * @returns
 */
export default function TableHeaderWithOrdering({
	first,
	fields_with_order = [],
	key_prefix = 'table_header_with_ordering',
	useContext,
	fields_no_order = [],
}) {
	return (
		<TableRow>
			<TableCell>{first}</TableCell>

			{fields_with_order.map((value, index) => {
				return (
					<TableCell key={`${key_prefix}_${index}`}>
						<OrderByField
							order_by={value[0]}
							useContext={useContext}
							id={index + 1}
						>
							{value[1]}
						</OrderByField>
					</TableCell>
				);
			})}
			{fields_no_order.map((value, index) => {
				return (
					<TableCell
						key={`${key_prefix}_${index}`}
						sx={{ textAlign: 'center' }}
					>
						{value}
					</TableCell>
				);
			})}
		</TableRow>
	);
}
