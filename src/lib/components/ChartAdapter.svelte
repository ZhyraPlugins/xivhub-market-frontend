<script lang="ts">
	import { ColorType } from 'lightweight-charts';
	import { Chart } from 'svelte-lightweight-charts';
</script>

<Chart
	autoSize={true}
	container={{ class: 'chart-container' }}
	layout={{
		background: {
			type: ColorType.Solid,
			color: '#111827'
		},
		textColor: '#ffffff'
	}}
	leftPriceScale={{
		visible: true,
		scaleMargins: {
			top: 0.8,
			bottom: 0
		}
	}}
	timeScale={{
		fixLeftEdge: true,
		fixRightEdge: true
	}}
	grid={{
		vertLines: {
			color: '#374151'
		},
		horzLines: {
			color: '#374151'
		}
	}}>
	<slot />
</Chart>

<style>
	:global(.chart-container) {
		width: 100%;
	}
</style>
