<script lang="ts">
	import { Pagination, PaginationItem, PaginationLink } from 'sveltestrap';

	export let total: number;
	export let page: number = 0;
	// show 3 before and 3 after current page before using skip markers.
	export let margin = 3;
	let clazz: string | null | undefined = undefined;
	export { clazz as class };
</script>

<Pagination class={clazz}>
	{#if page != 0}
		<PaginationItem>
			<PaginationLink first on:click={() => (page = 0)} />
		</PaginationItem>
	{/if}
	{#if total > 0 && page > 0}
		<PaginationItem>
			<PaginationLink previous on:click={() => (page -= 1)} />
		</PaginationItem>
	{/if}

	{#each { length: Math.min(total, margin) + 1 } as _, i}
		{@const reversedIndex = margin - i}
		{#if page - reversedIndex > 0}
			<PaginationItem>
				<PaginationLink on:click={() => (page = page - reversedIndex - 1)}>{page - reversedIndex}</PaginationLink>
			</PaginationItem>
		{/if}
	{/each}
	<PaginationItem active>
		<PaginationLink>{page + 1}</PaginationLink>
	</PaginationItem>
	{#each { length: Math.min(total, margin) + 1 } as _, i}
		{#if page + i < total}
			<PaginationItem>
				<PaginationLink on:click={() => (page = page + i + 1)}>{page + i + 2}</PaginationLink>
			</PaginationItem>
		{/if}
	{/each}
	{#if page < total}
		<PaginationItem>
			<PaginationLink next on:click={() => (page += 1)} />
		</PaginationItem>
	{/if}
	{#if page < total}
		<PaginationItem>
			<PaginationLink last on:click={() => (page = total)} />
		</PaginationItem>
	{/if}
</Pagination>
