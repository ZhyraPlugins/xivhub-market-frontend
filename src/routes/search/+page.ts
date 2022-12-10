import { hubApi, xivApi } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const items = await hubApi.list_items(fetch, 0);

	return {
		items
	};
};

/*

{#if page != 0}
						<PaginationItem>
							<PaginationLink first href="#" on:click={() => (page = 0)}>1</PaginationLink>
						</PaginationItem>
					{/if}
					<PaginationItem active>
						<PaginationLink href="#">{page + 1}</PaginationLink>
					</PaginationItem>
					{#each { length: data.items.total_pages - 1 - page } as _, i}
						<PaginationItem>
							<PaginationLink last href="#" on:click={() => (page = page + i + 1)}>{page + i + 2}</PaginationLink>
						</PaginationItem>
					{/each}
					{#if page != data.items.total_pages}
						<PaginationItem>
							<PaginationLink last href="#" on:click={() => (page = data.items.total_pages)}>{data.items.total_pages + 1}</PaginationLink>
						</PaginationItem>
					{/if}
					*/
