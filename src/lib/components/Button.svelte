<script lang="ts">
	export let href: string | null = null;
</script>

{#if href != null}
	<a
		{href}
		class="inline-block text-sm px-4 py-2 leading-none border rounded 
text-teal-400 bg-gray-700 border-teal-500 
		hover:border-transparent hover:bg-teal-500 hover:text-black lg:mt-0 font-bold">
		<slot />
	</a>
{:else}
	<button
		on:click
		class="inline-block text-sm px-4 py-2 leading-none border rounded 
	text-teal-400 bg-gray-700 border-teal-500 
			hover:border-transparent hover:bg-teal-500 hover:text-black lg:mt-0 font-bold">
		<slot />
	</button>
{/if}
