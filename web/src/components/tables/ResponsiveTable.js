import { useState, useEffect } from 'react';
// import { ErrorAlertReload } from '../alerts-error-status/ErrorAlert';
import {
	Backdrop,
	CardActions,
	CircularProgress,
	Grid,
	Pagination,
	Table,
	TableBody,
	TableContainer,
	TableHead,
	Typography,
} from '@mui/material';
import MuiCard from '../mui-ready/MuiCard';

// Must be the same as Backend 'MAX_VISIBLE_ITEMS'
export const MAX_TABLE_ITEMS_ON_ONE_PAGE = 10;

/** Must have either provider:
 * @param SpecificTableProvider
 * @param GeneralTableProvider
 *
 * Creates table, contained within Card.
 *
 * * `title` - prop for CardHeader
 * * `head` - upper part of the Card - react element,
 * * `body` - part below `head` - react element,
 * * `thead` - table HEADER - react element,
 * * `children` - table BODY - react element,
 * * `context` - table provider context hook, either: `useSpecificTableProvider()` or `useGeneralTableProvider()`
 */
export function ResponsisveTable({
	children,
	head,
	thead,
	body,
	title = '',
	context,
	cardActions,
}) {
	return (
		<MuiCard
			headerStyle={{ paddingBottom: '8px' }}
			title={title}
			titleTypographyProps={{
				textAlign: 'center',
				component: 'h1',
				variant: 'h5',
			}}
		>
			<UnstyledResponsiveTable
				children={children}
				head={head}
				thead={thead}
				body={body}
				context={context}
				cardActions={cardActions}
			/>
		</MuiCard>
	);
}

export function UnstyledResponsiveTable({
	children,
	head,
	thead,
	body,
	context,
	cardActions,
	cardProps,
}) {
	const { errMsg, setPage, size, page, setState, isLoading } = context();
	const [lowerLoad, setLowerLoad] = useState(0);
	const [upperLoad, setUpperLoad] = useState(0);

	useEffect(() => {
		setLowerLoad((page - 1) * MAX_TABLE_ITEMS_ON_ONE_PAGE + 1);
		setUpperLoad((prev) => {
			const upper = page * MAX_TABLE_ITEMS_ON_ONE_PAGE;
			return upper < size ? upper : size;
		});
	}, [page, size]);

	return (
		<>
			<Grid container rowSpacing={2}>
				<Grid item xs={12}>
					{head}
				</Grid>
				<Grid item xs={12}>
					{body}
				</Grid>
			</Grid>

			<MuiCard
				cardProps={cardProps}
			>
				{cardActions && (
					<CardActions style={{ padding: 0, marginTop: 0 }}>
						{cardActions}
					</CardActions>
				)}

				<Backdrop
					open={isLoading}
					sx={{
						backgroundColor: '#f2f2f2',
						position: 'absolute',
						display: 'flex',
						zIndex: (theme) => theme.zIndex.drawer + 1,
					}}
				>
					<CircularProgress sx={{ color: 'primary' }} />
				</Backdrop>
				<TableContainer>
					<Table size="small">
						<TableHead>{thead}</TableHead>
						<TableBody>{children}</TableBody>
					</Table>
				</TableContainer>
			</MuiCard>

			{<Typography textAlign={'center'}>{errMsg}</Typography>}
			{/* {errMsg ? (
				<ErrorAlertReload errMsg={errMsg} />
			) : isLoading && !size ? (
				<CircularProgress color={'secondary'} />
			) : (
				<></>
			)} */}

			<Grid container spacing={2} padding={1}>
				<Grid item xs={12}>
					<Typography textAlign={'center'}>
						Wczytano {lowerLoad} - {upperLoad} z {size}
					</Typography>
				</Grid>
				<Grid
					item
					xs={12}
					justifyContent={'center'}
					alignItems={'center'}
					display={'flex'}
				>
					<Pagination
						color="primary"
						count={
							size % 10 === 0 ? ~~(size / 10) : ~~(size / 10) + 1
						}
						page={page}
						onChange={(event, newPage) => {
							if (newPage === page) {
								return;
							}
							setPage(newPage);
							setState((current) => !current);
						}}
					/>
				</Grid>
			</Grid>
		</>
	);
}
