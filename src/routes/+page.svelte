<script lang="ts">
	import { xivApi } from '$lib/api';
	import StatCard from '$lib/components/StatCard.svelte';
	import type { PageData } from './$types';
	import { Bar } from 'svelte-chartjs';
	import 'chart.js/auto';
	import 'chartjs-adapter-date-fns';
	import { Chart } from 'chart.js';
	Chart.defaults.borderColor = 'rgb(107 114 128)';
	Chart.defaults.color = 'white';
	import { formatDistanceToNow } from 'date-fns';
	import Container from '$lib/components/Container.svelte';
	import Card from '$lib/components/Card.svelte';
	import CardHeader from '$lib/components/CardHeader.svelte';

	export let data: PageData;

	let uploadsData = {
		labels: data.stats.uploads_per_day.map((x) => new Date(x.day)),
		datasets: [
			{
				label: 'Upload Count',
				data: data.stats.uploads_per_day.map((x) => x.count),
				borderWidth: 2,
				borderColor: '#0d9488',
				backgroundColor: '#1f2937'
			}
		]
	};

	let purchasesData = {
		labels: data.stats.purchase_by_day.map((x) => new Date(x.day)),
		datasets: [
			{
				label: 'Purchases by Day',
				data: data.stats.purchase_by_day.map((x) => x.count),
				borderWidth: 2,
				borderColor: '#0d9488',
				backgroundColor: '#1f2937'
			}
		]
	};
</script>

<svelte:head>
	<title>Xivhub Market</title>
</svelte:head>

<Container>
	<div class="flex gap-2 my-2">
		<div class="flex-1">
			<StatCard title="Uploads" data={data.stats.total_uploads} />
		</div>
		<div class="flex-1">
			<StatCard title="Purchases" data={data.stats.total_purchases} />
		</div>
		<div class="flex-1">
			<StatCard title="Listings" data={data.stats.active_listings} />
		</div>
		<div class="flex-1">
			<StatCard title="Items" data={data.stats.unique_items} />
		</div>
		<div class="flex-1">
			<StatCard title="Uploaders" data={data.stats.unique_uploaders} />
		</div>
	</div>

	<div class="flex gap-2 my-2">
		<div class="flex-1 text-center">
			<Card class="p-2">
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
					}} />
			</Card>
		</div>
		<div class="flex-1 text-center">
			<Card class="p-2">
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
					}} />
			</Card>
		</div>
	</div>

	<Card class="border border-gray-900">
		<CardHeader><div class="text-center font-bold text-3xl">Latest Uploads</div></CardHeader>
		<div class="flex">
			<div class="overflow-y-auto w-full" style="max-height: 500px;">
				<table class="table-fixed border-collapse rounded-lg shadow w-full text-center border border-gray-800">
					<thead class="bg-gray-900 top-0 sticky">
						<tr>
							<th class="px-2 py-2">Icon</th>
							<th class="px-2 py-2">Item</th>
							<th class="px-2 py-2">World</th>
							<th class="px-2 py-2">When</th>
							<th class="px-2 py-2">Upload Type</th>
						</tr>
					</thead>
					<tbody class="bg-gray-800 border border-gray-800">
						{#each data.last_uploads as upload}
							<tr class="even:bg-gray-700">
								<td class="px-4 py-2 flex align-middle justify-center"
									><img alt={`${upload.item_id} Icon`} src={xivApi.apiBase(upload.icon)} /></td>
								<td class="px-4 py-2"
									><a class="font-bold text-teal-400 hover:underline" href={`/item/${upload.item_id}`}>{upload.name}</a></td>
								<td class="px-4 py-2">{xivApi.getServer(upload.world_id).name}</td>
								<td class="px-4 py-2" title={new Date(upload.upload_time).toLocaleString()}
									>{formatDistanceToNow(new Date(upload.upload_time))} ago</td>
								<td class="px-4 py-2">{upload.upload_type == 0 ? 'Listings' : 'Purchases'}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</Card>
</Container>
