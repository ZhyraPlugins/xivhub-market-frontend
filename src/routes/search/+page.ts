import { hubApi } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const items = await hubApi.list_items(fetch, 0);

	return {
		items
	};
};
