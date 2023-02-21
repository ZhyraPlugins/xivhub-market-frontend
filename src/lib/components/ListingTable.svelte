<script lang="ts">
	import { xivApi, type Listing } from '$lib/api';
	import { numberWithCommas } from '$lib/util';
	import { formatDistanceToNowStrict } from 'date-fns';
	import Card from '$lib/components/Card.svelte';
	import CardHeader from '$lib/components/CardHeader.svelte';

	export let title: string;
	export let listings: Listing[];
	export let withServer = false;
	export let mean: number;
	export let median: number;
</script>

<Card class="border border-gray-900">
	<CardHeader><div class="text-center font-bold text-2xl">{title}</div></CardHeader>
	<div class="flex">
		<div class="overflow-y-auto w-full" style="max-height: 500px;">
			<table class="table-auto border-collapse rounded-lg shadow w-full text-center border border-gray-800">
				<thead class="bg-gray-900 top-0 sticky">
					<tr>
						<th class="px-2 py-2">#</th>
						{#if withServer}
							<th class="px-2 py-2">Server</th>
						{/if}
						<th class="px-2 py-2"><abbr title="Difference to mean purchase (negative = cheaper)">Diff Mean</abbr></th>
						<th class="px-2 py-2"><abbr title="Difference to median purchase (negative = cheaper)">Diff Median</abbr></th>
						<th class="px-2 py-2">Price per unit</th>
						<th class="px-2 py-2">Quantity</th>
						<th class="px-2 py-2">Total</th>
						<th class="px-2 py-2">Materia</th>
						<th class="px-2 py-2">Listed</th>
					</tr>
				</thead>
				<tbody class="bg-gray-800 border border-gray-800">
					{#each listings as listing, i}
						{@const diffMean = (listing.price_per_unit / mean) * 100 - 100}
						{@const diffMedian = (listing.price_per_unit / median) * 100 - 100}
						<tr class="even:bg-gray-700">
							<td>{i + 1}</td>
							{#if withServer}
								<td>{xivApi.getServer(listing.world_id).name}</td>
							{/if}

							<td class="px-2 py-2 text-end {diffMean < 0 ? 'text-green-600' : 'text-rose-500'}">{diffMean.toFixed(2)}%</td>
							<td class="px-2 py-2 text-end {diffMedian < 0 ? 'text-green-600' : 'text-rose-500'}">{diffMedian.toFixed(2)}%</td>
							<td class="px-2 py-2 font-bold text-end">{numberWithCommas(listing.price_per_unit)}</td>
							<td class="px-2 py-2 font-bold text-end">{listing.quantity}</td>
							<td class="px-2 py-2 font-bold text-end">{numberWithCommas(listing.quantity * listing.price_per_unit)}</td>
							<td>{listing.materia_count}</td>
							<td>{formatDistanceToNowStrict(new Date(listing.last_review_time))} ago</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</Card>
