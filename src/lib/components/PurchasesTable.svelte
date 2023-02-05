<script lang="ts">
	import { xivApi, type Purchase } from '$lib/api';
	import { numberWithCommas } from '$lib/util';
	import { formatDistanceToNowStrict } from 'date-fns';
	import { Table } from 'sveltestrap';

	export let purchases: Purchase[];
	export let withServer = false;
</script>

<Table hover striped bordered responsive>
	<thead>
		<tr>
			<th>#</th>
			{#if withServer}
				<th>Server</th>
			{/if}
			<th>Price per unit</th>
			<th>Quantity</th>
			<th>Total</th>
			<th>HQ</th>
			<th>Buyer</th>
			<th>Purchased</th>
		</tr>
	</thead>
	<tbody>
		{#each purchases as purchase, i}
			<tr>
				<td>{i + 1}</td>
				{#if withServer}
					<td>{xivApi.getServer(purchase.world_id).name}</td>
				{/if}
				<td class="text-primary fw-bold text-end">{numberWithCommas(purchase.price_per_unit)}</td>
				<td class="text-danger fw-bold text-end">{purchase.quantity}</td>
				<td class="text-success fw-bold text-end">{numberWithCommas(purchase.quantity * purchase.price_per_unit)}</td>
				<td>{purchase.hq ? 'Yes' : 'No'}</td>
				<td>{purchase.buyer_name}</td>
				<td>{formatDistanceToNowStrict(new Date(purchase.purchase_time))} ago</td>
			</tr>
		{/each}
	</tbody>
</Table>
