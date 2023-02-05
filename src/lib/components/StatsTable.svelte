<script lang="ts">
	import { numberWithCommas } from '$lib/util';
	import { Table } from 'sveltestrap';

	export let values: {
		type: string;
		mean: number;
		median: number;
		mode: number;
		stddev: number;
		mad: number;
		hidden?: boolean;
	}[];
</script>

<Table hover striped bordered responsive class="">
	<thead>
		<tr>
			<th>Type</th>
			<th>
				<abbr title="The mean, also known as average, is the sum of all values over the number of values.">Mean</abbr>
			</th>
			<th
				><abbr
					title="The median is the middle number of a list. This is often a good indicator of 'the middle' when there are outliers that skew the mean value."
					>Median</abbr
				></th
			>
			<th>
				<abbr title="The mode is the number that appears in a list the highest number of times.">Mode</abbr>
			</th>
			<th>
				<abbr
					title="The standard deviation is the square root of the variance. This is also known as the population standard deviation. It's useful for measuring the amount of variation or dispersion in a set of values."
					>Std.Dev</abbr
				>
			</th>
			<th>
				<abbr
					title="The Median Absolute Deviation is a robust measure of statistical dispersion. It is more resilient to outliers than the standard deviation."
					>MAD</abbr
				>
			</th>
		</tr>
	</thead>
	<tbody>
		{#each values as value, i}
			{#if !value.hidden}
				<tr>
					<td>{value.type}</td>
					<td>{numberWithCommas(value.mean)}</td>
					<td>{numberWithCommas(value.median)}</td>
					<td>{numberWithCommas(value.mode)}</td>
					<td>{numberWithCommas(value.stddev)}</td>
					<td>{numberWithCommas(value.mad)}</td>
				</tr>
			{/if}
		{/each}
	</tbody>
</Table>
