<script lang="ts">
	import { hubApi, xivApi, type Listing, type Purchase, type XivItemInfo } from '$lib/api';
	import { numberWithCommas } from '$lib/util';
	import { get } from 'svelte/store';
	import { Card, CardBody, CardHeader, CardText, CardTitle, Col, Container, Row, Spinner, TabContent, Table, TabPane } from 'sveltestrap';
	import type { PageData } from './$types';

	export let data: PageData;
	export let item: XivItemInfo = data.listings.item;

	// Map -> datacenter -> world -> listings
	export const listingsServers: Map<number, Map<string, Listing[]>> = new Map();
	export const purchasesServers: Map<number, Map<string, Purchase[]>> = new Map();

	export const cheapestNQListingPerDatacenter: Map<number, Listing> = new Map();
	export const cheapestHQListingPerDatacenter: Map<number, Listing> = new Map();

	let globalhqPurchases = data.purchases.purchases.filter((x) => x.hq);
	export const globalAverageHqPrice = Math.round(
		globalhqPurchases.map((x) => x.price_per_unit).reduce((a, b) => a + b, 0) / globalhqPurchases.length
	);
	let globalnqPurchases = data.purchases.purchases.filter((x) => !x.hq);
	export const globalAverageNqPrice = Math.round(
		globalnqPurchases.map((x) => x.price_per_unit).reduce((a, b) => a + b, 0) / globalnqPurchases.length
	);

	// Put the listings inside each datacenter, world
	for (let listing of data.listings.listings) {
		const world = xivApi.getServer(listing.world_id);
		let worlds = listingsServers.get(world.datacenter);

		if (!worlds) {
			worlds = new Map();
			listingsServers.set(world.datacenter, worlds);
		}

		if (listing.hq) {
			if (!cheapestHQListingPerDatacenter.has(world.datacenter)) {
				cheapestHQListingPerDatacenter.set(world.datacenter, listing);
			} else {
				let current_cheapest = cheapestHQListingPerDatacenter.get(world.datacenter)!;

				if (current_cheapest.price_per_unit > listing.price_per_unit) {
					cheapestHQListingPerDatacenter.set(world.datacenter, listing);
				}
			}
		}

		if (!listing.hq) {
			if (!cheapestNQListingPerDatacenter.has(world.datacenter)) {
				cheapestNQListingPerDatacenter.set(world.datacenter, listing);
			} else {
				let current_cheapest = cheapestNQListingPerDatacenter.get(world.datacenter)!;

				if (current_cheapest.price_per_unit > listing.price_per_unit) {
					cheapestNQListingPerDatacenter.set(world.datacenter, listing);
				}
			}
		}

		let listings = worlds.get(world.name);

		if (!listings) {
			listings = [];
			worlds.set(world.name, listings);
		}

		listings.push(listing);
	}

	for (let purchase of data.purchases.purchases) {
		const world = xivApi.getServer(purchase.world_id);
		let worlds = purchasesServers.get(world.datacenter);

		if (!worlds) {
			worlds = new Map();
			purchasesServers.set(world.datacenter, worlds);
		}

		let purchases = worlds.get(world.name);

		if (!purchases) {
			purchases = [];
			worlds.set(world.name, purchases);
		}

		purchases.push(purchase);
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
	<title>{item.name} | Xivhub Market</title>
	<meta name="description" content={`Market listings and purchases for ${item.name}.`} />
	<meta property="og:image" content={xivApi.apiBase(item.icon_hd)} />
	<meta property="og:description" content={`Market listings and purchases for ${item.name}.`} />
</svelte:head>

<Container fluid>
	<Container>
		<Row>
			<Col>
				<Card class="mt-3">
					<CardHeader>
						<CardTitle>{item.name}</CardTitle>
					</CardHeader>
					<CardBody>
						<CardText>
							<Row>
								<Col xs={1}>
									<img alt={`${item.name} Icon`} src={`https://xivapi.com${item.icon_hd}`} />
									<img class="mt-2" src={xivApi.apiBase(item.item_search_category_iconhd)} />
								</Col>
								<Col>
									<ul>
										<li><b>Item Kind</b>: {item.item_kind_name}</li>
										<li>
											<b>Global Average HQ price</b>: {numberWithCommas(globalAverageHqPrice)}
										</li>
										<li>
											<b>Global Average NQ price</b>: {numberWithCommas(globalAverageNqPrice)}
										</li>
									</ul>
									<p style="white-space: pre-line">
										{item.description.replace(/[\n]+/g, '\n')}
									</p>
								</Col>
							</Row>
						</CardText>
					</CardBody>
				</Card>
			</Col>
		</Row>
	</Container>

	<Row>
		<Col>
			<Card class="mt-3">
				<CardHeader><CardTitle>Listings</CardTitle></CardHeader>
				<CardBody>
					<CardText>
						<TabContent
							vertical
							pills
							on:tab={(e) => {
								worldTab = 0;
								datacenterTab = e.detail;
							}}
						>
							{#each Array.from(listingsServers.entries()) as [datacenter, worlds], i}
								{@const dataCenterName = datacenterNames[datacenter] ?? datacenter}
								<TabPane id={`datacenter-${i}`} tabId={i} active={datacenterTab == i} class="w-100">
									<span slot="tab">
										{dataCenterName}
									</span>
									<TabContent
										on:tab={(e) => {
											worldTab = e.detail;
										}}
									>
										{#each Array.from(worlds.entries()) as [world_name, listings], ii}
											{@const hqListings = listings.filter((x) => x.hq)}
											{@const nqListings = listings.filter((x) => !x.hq)}
											<TabPane id={`world-${i}-${ii}`} tabId={ii} active={worldTab == ii}>
												<span slot="tab">
													{world_name}
												</span>
												{#if cheapestHQListingPerDatacenter.has(datacenter)}
													{@const cheapest = cheapestHQListingPerDatacenter.get(datacenter)}
													<p class="mb-0">
														Cheapest HQ on <b>{dataCenterName}</b> at
														<b>{xivApi.getServer(cheapest?.world_id).name}</b> for <b>{numberWithCommas(cheapest?.price_per_unit)}</b>
													</p>
												{/if}
												{#if cheapestNQListingPerDatacenter.has(datacenter)}
													{@const cheapest = cheapestNQListingPerDatacenter.get(datacenter)}
													<p class="mt-0">
														Cheapest NQ on <b>{dataCenterName}</b> at
														<b>{xivApi.getServer(cheapest?.world_id).name}</b> for <b>{numberWithCommas(cheapest?.price_per_unit)}</b>
													</p>
												{/if}

												<h4 class="mt-2">HQ Listings</h4>
												<Table hover responsive class="mt-2">
													<thead>
														<th>Price per unit</th>
														<th>Quantity</th>
														<th>Total</th>
														<th>Last Review</th>
													</thead>
													<tbody>
														{#each hqListings as listing}
															<tr>
																<td>{numberWithCommas(listing.price_per_unit)}</td>
																<td>{listing.quantity}</td>
																<td>{numberWithCommas(listing.quantity * listing.price_per_unit)}</td>
																<td>{new Date(listing.last_review_time).toLocaleString()}</td>
															</tr>
														{/each}
													</tbody>
												</Table>

												<h4 class="mt-2">NQ Listings</h4>
												<Table hover responsive class="mt-2">
													<thead>
														<th>Price per unit</th>
														<th>Quantity</th>
														<th>Total</th>
														<th>Last Review</th>
													</thead>
													<tbody>
														{#each nqListings as listing}
															<tr>
																<td>{numberWithCommas(listing.price_per_unit)}</td>
																<td>{listing.quantity}</td>
																<td>{numberWithCommas(listing.quantity * listing.price_per_unit)}</td>
																<td>{new Date(listing.last_review_time).toLocaleString()}</td>
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
					</CardText>
				</CardBody>
			</Card>
		</Col>
		<Col>
			<Card class="mt-3">
				<CardHeader><CardTitle>Purchases</CardTitle></CardHeader>
				<CardBody>
					<CardText>
						<TabContent
							vertical
							pills
							on:tab={(e) => {
								worldTab = 0;
								datacenterTab = e.detail;
							}}
						>
							{#each Array.from(purchasesServers.entries()) as [datacenter, worlds], i}
								<TabPane id={`datacenter-${i}`} tabId={i} active={datacenterTab == i} class="w-100">
									<span slot="tab">
										{datacenterNames[datacenter] ?? datacenter}
									</span>

									<TabContent
										on:tab={(e) => {
											worldTab = e.detail;
										}}
									>
										{#each Array.from(worlds.entries()) as [world_name, listings], ii}
											{@const nqListings = listings.filter((x) => !x.hq)}
											{@const averageNqPriceUnit = Math.round(
												nqListings.map((x) => x.price_per_unit).reduce((a, b) => a + b, 0) / nqListings.length
											)}
											{@const hqListings = listings.filter((x) => x.hq)}
											{@const averageHqPriceUnit = Math.round(
												hqListings.map((x) => x.price_per_unit).reduce((a, b) => a + b, 0) / hqListings.length
											)}
											<TabPane id={`world-${i}-${ii}`} tabId={ii} active={worldTab == ii}>
												<span slot="tab">
													{world_name}
												</span>

												<ul class="mt-2">
													<li>Average HQ Price: {numberWithCommas(averageHqPriceUnit)}</li>
													<li>Average NQ Price: {numberWithCommas(averageNqPriceUnit)}</li>
												</ul>

												<Table hover responsive class="mt-2">
													<thead>
														<th>Price per unit</th>
														<th>Quantity</th>
														<th>Total</th>
														<th>HQ</th>
														<th>Purchased At</th>
													</thead>
													<tbody>
														{#each listings as listing}
															<tr>
																<td>{numberWithCommas(listing.price_per_unit)}</td>
																<td>{listing.quantity}</td>
																<td>{numberWithCommas(listing.quantity * listing.price_per_unit)}</td>
																<td>{listing.hq.toString()}</td>
																<td>{new Date(listing.purchase_time).toLocaleString()}</td>
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
					</CardText>
				</CardBody>
			</Card>
		</Col>
	</Row>
</Container>
