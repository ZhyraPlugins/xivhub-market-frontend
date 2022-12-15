<script lang="ts">
	import { xivApi } from '$lib/api';
	import StatCard from '$lib/components/StatCard.svelte';
	import { Card, CardBody, CardHeader, CardText, CardTitle, Col, Container, Row, Table } from 'sveltestrap';
	import type { PageData } from './$types';
	import { Bar } from 'svelte-chartjs';
	import 'chart.js/auto';
	import 'chartjs-adapter-date-fns';
	import { formatDistanceToNow } from 'date-fns';

	export let data: PageData;

	let uploadsData = {
		labels: data.stats.uploads_per_day.map((x) => new Date(x.day)),
		datasets: [
			{
				label: 'Upload Count',
				data: data.stats.uploads_per_day.map((x) => x.count),
				borderWidth: 2
			}
		]
	};

	let purchasesData = {
		labels: data.stats.purchase_by_day.map((x) => new Date(x.day)),
		datasets: [
			{
				label: 'Purchases by Day',
				data: data.stats.purchase_by_day.map((x) => x.count),
				borderWidth: 2
			}
		]
	};
</script>

<svelte:head>
	<title>Xivhub Market</title>
</svelte:head>

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

	<Row class="gap-2 mt-2">
		<Col>
			<Card>
				<CardBody>
					<CardText class="text-center">
						<Bar
							data={uploadsData}
							options={{
								responsive: true,
								scales: {
									x: {
										type: 'time',
										ticks: {
											source: 'auto',
											// Disabled rotation for performance
											maxRotation: 0,
											autoSkip: true
										},
										time: {
											unit: 'day'
										}
									}
								}
							}}
						/>
					</CardText>
				</CardBody>
			</Card>
		</Col>
		<Col>
			<Card>
				<CardBody>
					<CardText class="text-center">
						<Bar
							data={purchasesData}
							options={{
								responsive: true,
								scales: {
									x: {
										type: 'time',
										ticks: {
											source: 'auto',
											// Disabled rotation for performance
											maxRotation: 0,
											autoSkip: true
										},
										time: {
											unit: 'day'
										}
									}
								}
							}}
						/>
					</CardText>
				</CardBody>
			</Card>
		</Col>
	</Row>

	<Card class="mt-3">
		<CardHeader><CardTitle>Latest Uploads</CardTitle></CardHeader>
		<CardBody>
			<CardText>
				<Table hover striped bordered responsive>
					<thead>
						<tr>
							<th>Image</th>
							<th>Item</th>
							<th>World</th>
							<th>When</th>
							<th>Upload Type</th>
						</tr>
					</thead>
					<tbody>
						{#each data.last_uploads as upload}
							<tr>
								<td><img alt={`${upload.item_id} Icon`} src={xivApi.apiBase(upload.icon)} /></td>
								<td><a class="text-decoration-none fw-bold " href={`/item/${upload.item_id}`}>{upload.name}</a></td>
								<td>{xivApi.getServer(upload.world_id).name}</td>
								<td>{formatDistanceToNow(new Date(upload.upload_time))} ago</td>
								<td>{upload.upload_type == 0 ? 'Listings' : 'Purchases'}</td>
							</tr>
						{/each}
					</tbody>
				</Table>
			</CardText>
		</CardBody>
	</Card>
</Container>
