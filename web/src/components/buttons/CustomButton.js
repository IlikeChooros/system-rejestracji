import { Box, ButtonBase, Stack, Typography } from '@mui/material';

export default function CustomButton({
	icon,
	text = '',
	boxStyle = {},
	btnStyle = {},
	buttonBaseProps = {},
}) {
	return (
		<ButtonBase
			type="submit"
			style={{
				backgroundColor: '#f3edf9',
				border: 'none',
				borderRadius: '22px',
				p: '12px',
				m: 5,
				...btnStyle,
			}}
			{...buttonBaseProps}
		>
			<Box style={{ margin: 10, mx: 12, color: '#664e7c', ...boxStyle }}>
				<Stack direction={'row'} spacing={1}>
					<Typography>{text}</Typography>
					{icon}
				</Stack>
			</Box>
		</ButtonBase>
	);
}
