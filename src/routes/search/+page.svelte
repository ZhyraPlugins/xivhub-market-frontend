<script lang="ts">
	import { hubApi, xivApi } from '$lib/api';
	import Paginate from '$lib/components/Paginate.svelte';
	import {
		Button,
		Card,
		CardBody,
		CardHeader,
		CardText,
		CardTitle,
		Col,
		Container,
		Form,
		FormGroup,
		Input,
		Label,
		Pagination,
		PaginationItem,
		PaginationLink,
		Row,
		Table
	} from 'sveltestrap';
	import type { PageData } from './$types';

	export let data: PageData;

	let search = '';
	let inputSearch = '';
	let page = 0;

	async function onSearch() {
		search = inputSearch;
		page = 0;
	}

	$: {
		hubApi.list_items(fetch, page, search).then((items) => {
			data = { items };
		});
	}
</script>

<Container>
	<Card class="mt-3">
		<CardHeader><CardTitle>Search</CardTitle></CardHeader>
		<CardBody>
			<CardText>
				<Form>
					<FormGroup>
						<Input type="text" name="search" bind:value={inputSearch} />
					</FormGroup>
					<Button color="primary" on:click={onSearch}>Search</Button>
				</Form>

				<div class="d-flex justify-content-center">
					<Paginate class="mt-2" total={data.items.total_pages} bind:page />
				</div>

				<Table hover responsive>
					<thead>
						<th>Image</th>
						<th>Item</th>
						<th>Listings</th>
					</thead>
					<tbody>
						{#each data.items.items as item}
							<tr>
								<td><img alt={`${item.item_id} Icon`} src={`https://xivapi.com${item.icon}`} /></td>
								<td><a class="text-decoration-none fw-bold " href={`/item/${item.item_id}`}>{item.name}</a></td>
								<td>{item.listings ?? 0}</td>
							</tr>
						{/each}
					</tbody>
				</Table>
			</CardText>
		</CardBody>
	</Card>
</Container>
