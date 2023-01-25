<script lang="ts">
	import { xivApi, type Listing } from '$lib/api';
	import { numberWithCommas } from '$lib/util';
	import { formatDistanceToNowStrict } from 'date-fns';
	import { Table } from 'sveltestrap';

	export let listings: Listing[];
	export let withServer = false;
	export let average: number;
</script>

<Table hover striped bordered responsive class="">
	<thead>
		<tr>
			<td>#</td>
			{#if withServer}
				<td>Server</td>
			{/if}
			<th><abbr title="Difference to average purchase (negative = cheaper)">DTAP</abbr></th>
			<th>Price per unit</th>
			<th>Quantity</th>
			<th>Total</th>
			<th>Materia</th>
			<th>Listed</th>
		</tr>
	</thead>
	<tbody>
		{#each listings as listing, i}
			{@const diff = (listing.price_per_unit / average) * 100 - 100}
			<tr>
				<td>{i + 1}</td>
				{#if withServer}
					<td>{xivApi.getServer(listing.world_id).name}</td>
				{/if}

				<td class="text-end {diff < 0 ? 'text-success' : 'text-danger'}">{diff.toFixed(2)}%</td>
				<td class="text-primary fw-bold text-end">{numberWithCommas(listing.price_per_unit)}</td>
				<td class="text-danger fw-bold text-end">{listing.quantity}</td>
				<td class="text-success fw-bold text-end">{numberWithCommas(listing.quantity * listing.price_per_unit)}</td>
				<td>{listing.materia_count}</td>
				<td>{formatDistanceToNowStrict(new Date(listing.last_review_time))} ago</td>
			</tr>
		{/each}
	</tbody>
</Table>
