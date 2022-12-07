import { hubApi } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const last_uploads = await hubApi.last_uploads();
	const stats = await hubApi.stats();

	return {
		last_uploads: last_uploads.slice(0, 10),
		stats
	};
};
