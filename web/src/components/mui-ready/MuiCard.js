import { Card, CardContent, CardHeader } from '@mui/material';

export default function MuiCard({
	sx = {},
	cardStyle = {},
	headerStyle = {},
	title = '',
	subheader = '',
	titleTypographyProps = {},
	subtitleTypograhpyProps = {},
	children,
	cardHeaderProps = {},
	cardProps = {},
}) {
	return (
		<Card
			style={{
				borderRadius: '16px',
				...cardStyle,
			}}
			sx={sx}
			elevation={0}
			{...cardProps}
		>
			<CardHeader
				title={title}
				subheader={subheader}
				titleTypographyProps={titleTypographyProps}
				subheaderTypographyProps={subtitleTypograhpyProps}
				style={{
					paddingBottom: 0,
					...headerStyle,
				}}
				{...cardHeaderProps}
			/>
			<CardContent style={{ paddingTop: 0 }}>{children}</CardContent>
		</Card>
	);
}
