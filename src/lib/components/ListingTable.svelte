<script lang="ts">
	import { xivApi, type Listing } from '$lib/api';
	import { numberWithCommas } from '$lib/util';
	import { formatDistanceToNowStrict } from 'date-fns';
	import { Table } from 'sveltestrap';

	export let listings: Listing[];
	export let withServer = false;
	export let mean: number;
	export let median: number;
</script>

<Table hover striped bordered responsive class="">
	<thead>
		<tr>
			<th>#</th>
			{#if withServer}
				<th>Server</th>
			{/if}
			<th><abbr title="Difference to mean purchase (negative = cheaper)">Diff Mean</abbr></th>
			<th><abbr title="Difference to median purchase (negative = cheaper)">Diff Median</abbr></th>
			<th>Price per unit</th>
			<th>Quantity</th>
			<th>Total</th>
			<th>Materia</th>
			<th>Listed</th>
		</tr>
	</thead>
	<tbody>
		{#each listings as listing, i}
			{@const diffMean = (listing.price_per_unit / mean) * 100 - 100}
			{@const diffMedian = (listing.price_per_unit / median) * 100 - 100}
			<tr>
				<td>{i + 1}</td>
				{#if withServer}
					<td>{xivApi.getServer(listing.world_id).name}</td>
				{/if}

				<td class="text-end {diffMean < 0 ? 'text-success' : 'text-danger'}">{diffMean.toFixed(2)}%</td>
				<td class="text-end {diffMedian < 0 ? 'text-success' : 'text-danger'}">{diffMedian.toFixed(2)}%</td>
				<td class="text-primary fw-bold text-end">{numberWithCommas(listing.price_per_unit)}</td>
				<td class="text-danger fw-bold text-end">{listing.quantity}</td>
				<td class="text-success fw-bold text-end">{numberWithCommas(listing.quantity * listing.price_per_unit)}</td>
				<td>{listing.materia_count}</td>
				<td>{formatDistanceToNowStrict(new Date(listing.last_review_time))} ago</td>
			</tr>
		{/each}
	</tbody>
</Table>
