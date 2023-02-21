<script lang="ts">
	import { Line } from 'svelte-chartjs';
	import 'chart.js/auto';
	import 'chartjs-adapter-date-fns';
	import Card from './components/Card.svelte';
	import { Chart } from 'chart.js';
	Chart.defaults.borderColor = 'rgb(107 114 128)';
	Chart.defaults.color = 'white';

	export let data: any;
</script>

<Card class="p-2">
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
						autoSkip: true
					}
				}
			}
		}} />
</Card>
