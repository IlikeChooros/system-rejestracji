import { client } from './clients';

export function fetchAny(url) {
	return client
		.get(url)
		.then((res) => res?.data)
}

export function postAny(url, data) {
	return client
		.post(url, data)
		.then((res) => res?.data)
}