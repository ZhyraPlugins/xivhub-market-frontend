import { hubApi } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const item_id = parseInt(params.id);
	const listings = await hubApi.listings(fetch, item_id);
	const purchases = await hubApi.purchases(fetch, item_id);

	return {
		listings,
		purchases,
		item_id
	};
};
