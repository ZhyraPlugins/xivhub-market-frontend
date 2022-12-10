import { hubApi } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const last_uploads = await hubApi.last_uploads(fetch);
	const stats = await hubApi.stats(fetch);

	return {
		last_uploads: last_uploads.slice(0, 50),
		stats
	};
};
