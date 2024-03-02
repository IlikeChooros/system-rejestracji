import React from 'react';
import { CreateFormHandler, FormHandlerProps } from './CreateFormHandler.tsx';
import MuiCard from '../mui-ready/MuiCard';
import { FormDataProvider } from '../../providers/FormData.tsx';
import { InputTemplateForm } from '../../datastructures/input-objects.ts';
import { Box } from '@mui/material';
import { FormSubmitHandler } from './FormGenerator.tsx';
import { FormArray } from './types.ts';
import { ErrorButton, SuccessButton } from '../buttons/Buttons.js';
import { useNavigate } from 'react-router-dom';

interface CreateViewTemplateProps extends FormHandlerProps {
	forms: Array<InputTemplateForm>;
	title: string;
	children: any;
	onSubmit: (inputs: FormArray) => void;
	buttonText: string;
	cardProps: object;
}

export default function CreateViewTemplate({
	forms,
	grids,
	title = '',
	children,
	buttonText = 'Potwierdź',
	onSubmit,
	cardProps = {},
}: CreateViewTemplateProps) {
	const navigate = useNavigate();
	return (
		<FormDataProvider forms={forms}>
			<FormSubmitHandler onSubmit={onSubmit}>
				<MuiCard
					sx={{ marginTop: '20px', padding: '10px' }}
					title={title}
					cardStyle={{ backgroundColor: '#ffffff' }}
					headerStyle={{ paddingBottom: '8px' }}
					{...cardProps}
				>
					<CreateFormHandler grids={grids} />
					<Box
						sx={{ paddingTop: '10px', px: '20px', display: 'flex' }}
					>
						<ErrorButton
							text="Powrót"
							props={{ onClick: () => navigate(-1) }}
						/>
						<Box sx={{ flexGrow: 1 }}></Box>
						<SuccessButton text={buttonText} />
					</Box>

					{children}
				</MuiCard>
			</FormSubmitHandler>
		</FormDataProvider>
	);
}
