<script lang="ts">
	import { hubApi, xivApi, type Listing } from '$lib/api';
	import {
		Card,
		CardBody,
		CardHeader,
		CardText,
		CardTitle,
		Col,
		Container,
		Row,
		Spinner,
		TabContent,
		Table,
		TabPane
	} from 'sveltestrap';
	import type { PageData } from './$types';

	export let data: PageData;
	// Map -> datacenter -> world -> listings
	export const listingsServers: Map<number, Map<string, Listing[]>> = new Map();

	// Put the listings inside each datacenter, world
	for (let listing of data.listings) {
		const world = xivApi.getServer(listing.world_id);
		let worlds = listingsServers.get(world.datacenter);

		if (!worlds) {
			worlds = new Map();
			listingsServers.set(world.datacenter, worlds);
		}

		let listings = worlds.get(world.name);

		if (!listings) {
			listings = [];
			worlds.set(world.name, listings);
		}

		listings.push(listing);
	}

	async function getItemData() {
		return await xivApi.getItem(fetch, data.item_id);
	}

	export let itemData = getItemData();

	export const datacenterNames: Record<number, string> = {
		1: 'Elemental',
		2: 'Gaia',
		3: 'Mana',
		4: 'Aether',
		5: 'Primal',
		6: 'Chaos',
		7: 'Light',
		8: 'Crystal',
		9: 'Materia',
		10: 'Meteor',
		11: 'Dynamis'
	};

	let datacenterTab: number | string = 0;
	let worldTab: number | string = 0;
</script>

<svelte:head>
	{#await itemData then itemData}
		<title>{itemData.Name} | Xivhub Market</title>
	{/await}
</svelte:head>

<Container>
	{#await itemData}
		<Card class="mt-3">
			<CardBody>
				<CardText>
					<h2>Loading...</h2>
					<Spinner />
				</CardText>
			</CardBody>
		</Card>
	{:then itemData}
		<Card class="mt-3">
			<CardHeader><CardTitle>{itemData.Name}</CardTitle></CardHeader>
			<CardBody>
				<CardText>
					<Row>
						<Col xs={1}>
							<img alt={`${itemData.Id} Icon`} src={`https://xivapi.com${itemData.IconHD}`} />
						</Col>
						<Col>
							<h2>Listings</h2>
							<TabContent
								vertical
								pills
								class="w-100"
								on:tab={(e) => {
									worldTab = 0;
									datacenterTab = e.detail;
								}}
							>
								{#each Array.from(listingsServers.entries()) as [datacenter, worlds], i}
									<TabPane
										id={`datacenter-${i}`}
										tabId={i}
										active={datacenterTab == i}
										class="w-100"
									>
										<span slot="tab">
											{datacenterNames[datacenter] ?? datacenter}
										</span>

										<TabContent
											on:tab={(e) => {
												worldTab = e.detail;
											}}
										>
											{#each Array.from(worlds.entries()) as [world_name, listings], ii}
												<TabPane id={`world-${i}-${ii}`} tabId={ii} active={worldTab == ii}>
													<span slot="tab">
														{world_name}
													</span>

													<Table hover responsive class="mt-2">
														<thead>
															<th>Price per unit</th>
															<th>Quantity</th>
															<th>Total</th>
															<th>Last Review</th>
														</thead>
														<tbody>
															{#each listings as listing}
																<tr>
																	<td>{listing.price_per_unit}</td>
																	<td>{listing.quantity}</td>
																	<td>{listing.quantity * listing.price_per_unit}</td>
																	<td>{new Date(listing.last_review_time).toUTCString()}</td>
																</tr>
															{/each}
														</tbody>
													</Table>
												</TabPane>
											{/each}
										</TabContent>
									</TabPane>
								{/each}
							</TabContent>
						</Col>
					</Row>
				</CardText>
			</CardBody>
		</Card>
	{/await}
</Container>
