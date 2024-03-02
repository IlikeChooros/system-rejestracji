import { Alert, Snackbar } from '@mui/material';
import { createContext, useContext, useEffect, useState } from 'react';

export const initAlertMessageValue = {
	setNewAlert: (msg = '', type = '') => {},
};

export const DefaultMessageContext = createContext(initAlertMessageValue);

export function useDefaultMessageContext() {
	return useContext(DefaultMessageContext);
}

/**
 * ## Provides
 *  `setAlertOnCondition`
 */
export function AlertMessageProvider({
	children,
	Context = DefaultMessageContext,
}) {
	const [alerts, setAlerts] = useState([]);
	const [alertIsOpen, setAlertIsOpen] = useState(false);
	const [alert, setAlert] = useState(undefined);

	useEffect(() => {
		// No alerts to display (no queue)
		if (!alerts.length) {
			return;
		}
		// There are some alerts on queue
		if (!alert) {
			// No alert message, set new Snackbar
			setAlert(alerts[0]);
			setAlerts((current) => current.slice(1));
			setAlertIsOpen(true);
			return;
		} else if (alertIsOpen) {
			// Alert is open, but with no message, so closing it
			setAlertIsOpen(false);
		}
	}, [alerts, alertIsOpen, alert]);

	/**
	 * Adds on queue alert if given condition is true.
	 *
	 * @param {*} condition add given alert if condition is true
	 * @param {*} msg alert message
	 * @param {*} type 'success' | 'error' | 'warning' | 'info'
	 * @returns `condition`
	 */
	function setNewAlert(msg = '', type = 'success') {
		setAlerts((current) => [...current, { msg, type }]);
	}

	function handleClose(event, reason) {
		if (reason === 'clickaway') {
			return;
		}
		setAlertIsOpen(false);
	}

	function handleExited() {
		setAlert(undefined);
	}

	return (
		<Context.Provider value={{ setNewAlert }}>
			<Snackbar
				open={alertIsOpen}
				autoHideDuration={6000}
				onClose={handleClose}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				message={alert?.msg}
				TransitionProps={{ onExited: handleExited }}
			>
				<Alert
					onClose={handleClose}
					severity={alert?.type}
					sx={{ width: '100%' }}
				>
					{alert?.msg}
				</Alert>
			</Snackbar>

			{children}
		</Context.Provider>
	);
}
