<script lang="ts">
	import { hubApi } from '$lib/api';
	import Container from '$lib/components/Container.svelte';
	import Card from '$lib/components/Card.svelte';
	import CardHeader from '$lib/components/CardHeader.svelte';
	import Button from '$lib/components/Button.svelte';
	import Paginate from '$lib/components/Paginate.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let search = '';
	let inputSearch = '';
	let page = 0;

	async function onSearch() {
		search = inputSearch;
		page = 0;
	}

	$: {
		hubApi.list_items(fetch, page, search).then((items) => {
			data = { items };
		});
	}
</script>

<Container>
	<Card class="mt-3">
		<CardHeader><div class="text-center font-bold text-3xl">Search</div></CardHeader>
		<div>
			<div class="px-4 py-2 flex justify-center gap-2 align-middle ">
				<input
					type="text"
					name="search"
					class="shadow border border-teal-500 rounded 
						py-2 px-3 text-white bg-gray-700 focus:bg-gray-800
						flex-1 max-w-screen-sm
					 	focus:outline-none focus:shadow-outline"
					bind:value={inputSearch} />
				<Button on:click={onSearch}>Search</Button>
			</div>

			<div class="flex justify-center m-2">
				<Paginate class="mt-2" total={data.items.total_pages} bind:page />
			</div>

			<div class="flex">
				<div class="overflow-y-auto border border-gray-900" style="max-height: 500px;">
					<table class="table-fixed border-collapse rounded-lg shadow text-center border border-gray-800 w-full">
						<thead class="bg-gray-900 top-0 sticky">
							<tr>
								<th class="px-2 py-2">Image</th>
								<th class="px-2 py-2">Item</th>
								<th class="px-2 py-2">Listings</th>
							</tr>
						</thead>
						<tbody class="bg-gray-800 border border-gray-800">
							{#each data.items.items as item}
								<tr class="even:bg-gray-700">
									<td class="px-4 py-2 flex align-middle justify-center"
										><img alt={`${item.item_id} Icon`} src={`https://xivapi.com${item.icon}`} /></td>
									<td class="px-4 py-2"
										><a class="font-bold text-teal-400 hover:underline" href={`/item/${item.item_id}`}>{item.name}</a></td>
									<td class="px-4 py-2">{item.listings ?? 0}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</Card>
</Container>
