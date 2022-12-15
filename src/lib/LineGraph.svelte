<script lang="ts">
	import { Line } from 'svelte-chartjs';
	import 'chart.js/auto';
	import 'chartjs-adapter-date-fns';

	export let data: any;
</script>

<Line
	{data}
	options={{
		responsive: true,
		interaction: {
			mode: 'nearest',
			axis: 'x',
			intersect: false
		},
		scales: {
			x: {
				type: 'time',
				ticks: {
					source: 'auto',
					// Disabled rotation for performance
					maxRotation: 0,
					autoSkip: true
				}
			}
		}
	}}
/>
