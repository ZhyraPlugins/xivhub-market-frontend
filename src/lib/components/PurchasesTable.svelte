<script lang="ts">
	import { xivApi, type Purchase } from '$lib/api';
	import { numberWithCommas } from '$lib/util';
	import { formatDistanceToNowStrict } from 'date-fns';
	import Card from '$lib/components/Card.svelte';
	import CardHeader from '$lib/components/CardHeader.svelte';

	export let title: string;
	export let purchases: Purchase[];
	export let withServer = false;
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
						<th class="px-2 py-2">Price per unit</th>
						<th class="px-2 py-2">Quantity</th>
						<th class="px-2 py-2">Total</th>
						<th class="px-2 py-2">HQ</th>
						<th class="px-2 py-2">Buyer</th>
						<th class="px-2 py-2">Purchased</th>
					</tr>
				</thead>
				<tbody class="bg-gray-800 border border-gray-800">
					{#each purchases as purchase, i}
						<tr class="even:bg-gray-700">
							<td>{i + 1}</td>
							{#if withServer}
								<td class="px-2 py-2">{xivApi.getServer(purchase.world_id).name}</td>
							{/if}
							<td class="px-2 py-2 font-bold text-end text-teal-400">{numberWithCommas(purchase.price_per_unit)}</td>
							<td class="px-2 py-2 font-bold text-end text-teal-400">{purchase.quantity}</td>
							<td class="px-2 py-2 font-bold text-end underline">{numberWithCommas(purchase.quantity * purchase.price_per_unit)}</td>
							<td class="px-2 py-2">{purchase.hq ? 'Yes' : 'No'}</td>
							<td class="px-2 py-2">{purchase.buyer_name}</td>
							<td class="px-2 py-2">{formatDistanceToNowStrict(new Date(purchase.purchase_time))} ago</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</Card>
