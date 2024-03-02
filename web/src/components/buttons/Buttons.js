import CustomButton from './CustomButton';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import DoneIcon from '@mui/icons-material/Done';

export function SuccessButton({
	text = 'Potwierdź',
	icon = <DoneIcon />,
	props = {},
}) {
	return (
		<CustomButton
			buttonBaseProps={props}
			btnStyle={{ backgroundColor: '#E0F2F1' }}
			boxStyle={{ color: '#00897B' }}
			text={text}
			icon={icon}
		></CustomButton>
	);
}

export function ErrorButton({
	text = '',
	icon = <KeyboardReturnIcon />,
	props = {},
}) {
	return (
		<CustomButton
			buttonBaseProps={{ ...props, type: 'button' }}
			btnStyle={{ backgroundColor: '#FFEBEE' }}
			boxStyle={{ color: '#B71C1C' }}
			text={text}
			icon={icon}
		></CustomButton>
	);
}

export function InfoButton({
	text = '',
	icon = <KeyboardReturnIcon />,
	props = {},
}) {
	return (
		<CustomButton
			buttonBaseProps={props}
			btnStyle={{ backgroundColor: '#E0F7FA' }}
			boxStyle={{ color: '#006064' }}
			text={text}
			icon={icon}
		></CustomButton>
	);
}
