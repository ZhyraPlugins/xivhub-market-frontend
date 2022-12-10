import { hubApi, xivApi } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const items = await hubApi.list_items(fetch, 0);

	return {
		items
	};
};
