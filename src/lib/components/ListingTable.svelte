<script lang="ts">
	import { xivApi, type Listing, type XivApiItem, type XivItemInfo } from '$lib/api';
	import { numberWithCommas } from '$lib/util';
	import { formatDistanceToNowStrict } from 'date-fns';
	import Card from '$lib/components/Card.svelte';
	import CardHeader from '$lib/components/CardHeader.svelte';

	export let title: string;
	export let listings: Listing[];
	export let withServer = false;
	export let mean: number;
	export let median: number;
	export let item_info: XivItemInfo;
</script>

<Card class="border border-gray-900">
	<CardHeader><div class="text-center font-bold text-2xl">{title}</div></CardHeader>
	<div class="flex">
		<div class="overflow-y-auto w-full" style="max-height: 300px;">
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
						{#if item_info.materia_slot_count > 0}
							<th class="px-2 py-2">Materia</th>
						{/if}
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

							<td class="px-2 py-2 text-end font-bold {diffMean < 0 ? 'text-green-400' : 'text-rose-400'}">{diffMean.toFixed(2)}%</td>
							<td class="px-2 py-2 text-end font-bold {diffMedian < 0 ? 'text-green-400' : 'text-rose-400'}">{diffMedian.toFixed(2)}%</td>
							<td class="px-2 py-2 font-bold text-end text-teal-400">{numberWithCommas(listing.price_per_unit)}</td>
							<td class="px-2 py-2 font-bold text-end text-teal-400">{listing.quantity}</td>
							<td class="px-2 py-2 font-bold text-end underline">{numberWithCommas(listing.quantity * listing.price_per_unit)}</td>
							{#if item_info.materia_slot_count > 0}
								<td class="px-2 py-2 font-bold text-end">{listing.materia_count}</td>
							{/if}
							<td class="px-2 py-2 text-end">{formatDistanceToNowStrict(new Date(listing.last_review_time))} ago</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</Card>
