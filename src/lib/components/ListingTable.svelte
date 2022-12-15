<script lang="ts">
	import type { Listing } from '$lib/api';
	import { numberWithCommas } from '$lib/util';
	import { formatDistanceToNow } from 'date-fns';
	import { Table } from 'sveltestrap';

	export let listings: Listing[];
</script>

<Table hover striped bordered responsive class="">
	<thead>
		<tr>
			<th>Price per unit</th>
			<th>Quantity</th>
			<th>Total</th>
			<th>Listed</th>
		</tr>
	</thead>
	<tbody>
		{#each listings as listing}
			<tr>
				<td>{numberWithCommas(listing.price_per_unit)}</td>
				<td>{listing.quantity}</td>
				<td>{numberWithCommas(listing.quantity * listing.price_per_unit)}</td>
				<td>{formatDistanceToNow(new Date(listing.last_review_time))} ago</td>
			</tr>
		{/each}
	</tbody>
</Table>
