<script lang="ts">
	export let title: string;
	export let data: string | number;
</script>

<div class="w-full rounded overflow-hidden shadow-md text-center px-6 py-4 bg-gray-700">
	<h4 class="font-bold capitalize text-teal-50">{title}</h4>
	<span class="text-4xl font-bold text-teal-400">{data}</span>
</div>
