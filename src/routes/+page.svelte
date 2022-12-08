<script lang="ts">
	import { hubApi, xivApi, type XivApiItem } from '$lib/api';
	import StatCard from '$lib/components/StatCard.svelte';
	import type { CachedItem } from '$lib/db';
	import { Alert, Card, CardBody, CardHeader, CardText, CardTitle, Col, Container, Row, Table } from 'sveltestrap';
	import type { PageData } from './$types';

	export let itemData: Map<number, CachedItem> = new Map();
	export let data: PageData;

	async function getItemData() {
		for (var item of data.last_uploads) {
			if (!itemData.has(item.item_id)) {
				const res = await xivApi.getItem(fetch, item.item_id);
				itemData.set(item.item_id, res);
			}
		}

		return itemData;
	}

	let uploadItemData = getItemData();
</script>

<Container>
	<Row class="gap-2">
		<Col>
			<StatCard title="Uploads" data={data.stats.total_uploads} />
		</Col>
		<Col>
			<StatCard title="Purchases" data={data.stats.total_purchases} />
		</Col>
		<Col>
			<StatCard title="Listings" data={data.stats.active_listings} />
		</Col>
		<Col>
			<StatCard title="Items" data={data.stats.unique_items} />
		</Col>
		<Col>
			<StatCard title="Uploaders" data={data.stats.unique_uploaders} />
		</Col>
	</Row>
	<Card class="mt-3">
		<CardHeader><CardTitle>Latest Uploads</CardTitle></CardHeader>
		<CardBody>
			<CardText>
				<Table hover responsive>
					<thead>
						<th>Image</th>
						<th>Item</th>
						<th>World</th>
						<th>Date</th>
						<th>Upload Type</th>
					</thead>
					<tbody>
						{#each data.last_uploads as upload}
							<tr>
								{#await uploadItemData}
									<td>{upload.item_id}</td>
									<td>{upload.item_id}</td>
								{:then itemData}
									{@const item = itemData.get(upload.item_id)}
									<td><img alt={`${upload.item_id} Icon`} src={`https://xivapi.com${item?.Icon}`} /></td>
									<td><a class="text-decoration-none fw-bold " href={`/item/${item?.Id}`}>{item?.Name}</a></td>
								{:catch error}
									<td>{upload.item_id}</td>
									<td>{upload.item_id}</td>
								{/await}
								<td>{xivApi.getServer(upload.world_id).name}</td>
								<td>{new Date(upload.upload_time).toLocaleString()}</td>
								<td>{upload.upload_type == 0 ? 'Listings' : 'Purchases'}</td>
							</tr>
						{/each}
					</tbody>
				</Table>
			</CardText>
		</CardBody>
	</Card>
</Container>
