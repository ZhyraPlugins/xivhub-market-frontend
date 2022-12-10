<script lang="ts">
	import { hubApi, xivApi, type XivApiItem } from '$lib/api';
	import StatCard from '$lib/components/StatCard.svelte';
	import type { CachedItem } from '$lib/db';
	import { Alert, Card, CardBody, CardHeader, CardText, CardTitle, Col, Container, Row, Table } from 'sveltestrap';
	import type { PageData } from './$types';

	export let itemData: CachedItem[] = [];
	export let data: PageData;

	async function getItemData() {
		for (var item of data.items) {
			const res = await xivApi.getItem(fetch, item.item_id);
			itemData.push(res);
		}

		return itemData;
	}

	let uploadItemData = getItemData();
</script>

<Container>
	{#await uploadItemData then itemData}
		<Card class="mt-3">
			<CardHeader><CardTitle>Search</CardTitle></CardHeader>
			<CardBody>
				<CardText>
					<Table hover responsive>
						<thead>
							<th>Image</th>
							<th>Item</th>
						</thead>
						<tbody>
							{#each itemData as item}
								<tr>
									<td><img alt={`${item.Id} Icon`} src={`https://xivapi.com${item.Icon}`} /></td>
									<td><a class="text-decoration-none fw-bold " href={`/item/${item.Id}`}>{item.Name}</a></td>
								</tr>
							{/each}
						</tbody>
					</Table>
				</CardText>
			</CardBody>
		</Card>
	{/await}
</Container>
