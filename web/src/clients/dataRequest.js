import { client } from './clients';

export function fetchAny(url) {
	return client
		.get(url)
		.then((res) => res?.data)
}
