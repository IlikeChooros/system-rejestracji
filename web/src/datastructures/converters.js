/**
 * Converts date to string: YYYY-MM-DD
 *
 * @param {*} date Date object
 * @returns
 */
export function serializeDate(date, setNull = false) {
	if (!date) {
		return setNull ? null : '';
	}
	return `${date.$y}-${date.$M < 9 ? '0' + (date.$M + 1) : date.$M + 1}-${
		date.$D < 10 ? '0' + date.$D : date.$D
	}`;
}
