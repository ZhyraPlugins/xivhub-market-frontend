<script lang="ts">
	import { numberWithCommas } from '$lib/util';
	import Card from '$lib/components/Card.svelte';
	import CardHeader from '$lib/components/CardHeader.svelte';

	export let title: string;
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

<Card class="border border-gray-900">
	<CardHeader><div class="text-center font-bold text-2xl">{title}</div></CardHeader>
	<div class="flex">
		<div class="overflow-y-auto w-full" style="max-height: 500px;">
			<table class="table-auto border-collapse rounded-lg shadow w-full text-center border border-gray-800">
				<thead class="bg-gray-900 top-0 sticky">
					<tr>
						<th class="px-2 py-2">Type</th>
						<th class="px-2 py-2">
							<abbr title="The mean, also known as average, is the sum of all values over the number of values.">Mean</abbr>
						</th>
						<th class="px-2 py-2"
							><abbr
								title="The median is the middle number of a list. This is often a good indicator of 'the middle' when there are outliers that skew the mean value."
								>Median</abbr
							></th>
						<th class="px-2 py-2">
							<abbr title="The mode is the number that appears in a list the highest number of times.">Mode</abbr>
						</th>
						<th class="px-2 py-2">
							<abbr
								title="The standard deviation is the square root of the variance. This is also known as the population standard deviation. It's useful for measuring the amount of variation or dispersion in a set of values."
								>Std.Dev</abbr>
						</th>
						<th class="px-2 py-2">
							<abbr
								title="The Median Absolute Deviation is a robust measure of statistical dispersion. It is more resilient to outliers than the standard deviation."
								>MAD</abbr>
						</th>
					</tr>
				</thead>
				<tbody class="bg-gray-800 border border-gray-800">
					{#each values as value, i}
						{#if !value.hidden}
							<tr class="even:bg-gray-700">
								<td class="px-2 py-2">{value.type}</td>
								<td class="px-2 py-2">{numberWithCommas(value.mean)}</td>
								<td class="px-2 py-2">{numberWithCommas(value.median)}</td>
								<td class="px-2 py-2">{numberWithCommas(value.mode)}</td>
								<td class="px-2 py-2">{numberWithCommas(value.stddev)}</td>
								<td class="px-2 py-2">{numberWithCommas(value.mad)}</td>
							</tr>
						{/if}
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</Card>

<!--
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
				></th>
			<th>
				<abbr title="The mode is the number that appears in a list the highest number of times.">Mode</abbr>
			</th>
			<th>
				<abbr
					title="The standard deviation is the square root of the variance. This is also known as the population standard deviation. It's useful for measuring the amount of variation or dispersion in a set of values."
					>Std.Dev</abbr>
			</th>
			<th>
				<abbr
					title="The Median Absolute Deviation is a robust measure of statistical dispersion. It is more resilient to outliers than the standard deviation."
					>MAD</abbr>
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
-->
