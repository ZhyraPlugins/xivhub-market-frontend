<script lang="ts">
	import { xivApi, type Listing, type Purchase, type XivItemInfo } from '$lib/api';
	import { floatWithCommas, numberWithCommas } from '$lib/util';
	import { Card, CardBody, CardHeader, CardText, CardTitle, Col, Container, Nav, NavItem, NavLink, Row } from 'sveltestrap';
	import type { PageData } from './$types';
	import { formatDistanceToNowStrict } from 'date-fns';
	import LineGraph from '$lib/LineGraph.svelte';
	import ListingTable from '$lib/components/ListingTable.svelte';
	import { DataCenters } from '$lib/datacenters';
	import PurchasesTable from '$lib/components/PurchasesTable.svelte';
	import { onMount } from 'svelte';

	export let data: PageData;
	export let item: XivItemInfo = data.listings.item;
	let selectedDatacenter = 7;
	let selectedWorld = -1;
	let selectedWorldId = -1;

	onMount(() => {
		selectedDatacenter = parseInt(localStorage.getItem('default-dc') ?? '7');
	});

	// world -> listings
	export const listingsWorlds: Map<string, Listing[]> = new Map();
	// datacenter -> world -> listings
	export const listingsServers: Map<number, Map<string, Listing[]>> = new Map();
	export const purchasesServers: Map<number, Map<string, Purchase[]>> = new Map();

	export const listingsDataCenter: Map<number, Listing[]> = new Map();
	export const purchasesDataCenter: Map<number, Purchase[]> = new Map();

	export const cheapestNQListingPerDatacenter: Map<number, Listing> = new Map();
	export const cheapestHQListingPerDatacenter: Map<number, Listing> = new Map();

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

		let datacenterListings = listingsDataCenter.get(world.datacenter);

		if (!datacenterListings) {
			datacenterListings = [];
			listingsDataCenter.set(world.datacenter, datacenterListings);
		}

		datacenterListings.push(listing);
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

		let datacenterPurchases = purchasesDataCenter.get(world.datacenter);

		if (!datacenterPurchases) {
			datacenterPurchases = [];
			purchasesDataCenter.set(world.datacenter, datacenterPurchases);
		}

		datacenterPurchases.push(purchase);
	}

	// Sort datacenterListings
	for (let [_datacenter, listings] of listingsDataCenter) {
		listings.sort((a, b) => {
			if (a.price_per_unit < b.price_per_unit) {
				return -1;
			}
			if (a.price_per_unit > b.price_per_unit) {
				return 1;
			}
			return 0;
		});
	}

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

	let globalhqPurchases = data.purchases.purchases.filter((x) => x.hq);
	export const globalAverageHqPrice = Math.round(
		globalhqPurchases.map((x) => x.price_per_unit).reduce((a, b) => a + b, 0) / globalhqPurchases.length
	);
	let globalnqPurchases = data.purchases.purchases.filter((x) => !x.hq);
	export const globalAverageNqPrice = Math.round(
		globalnqPurchases.map((x) => x.price_per_unit).reduce((a, b) => a + b, 0) / globalnqPurchases.length
	);

	let lastUpdated: Map<string, Date> = new Map();
	let lastUpdatedDatacenter: Map<number, Date> = new Map();

	for (let up of data.item_uploads) {
		let world = xivApi.getServer(up.world_id);
		lastUpdated.set(world.name, new Date(up.upload_time));

		if (!lastUpdatedDatacenter.has(world.datacenter)) {
			lastUpdatedDatacenter.set(world.datacenter, new Date(up.upload_time));
		} else {
			let prev = lastUpdatedDatacenter.get(world.datacenter)!;
			let cur = new Date(up.upload_time);

			if (cur > prev) {
				lastUpdatedDatacenter.set(world.datacenter, cur);
			}
		}
	}

	// Select world / datacenter listings, purchases.
	let selectedWorldName: string;
	$: selectedWorldName = selectedWorldId == -1 ? datacenterNames[selectedDatacenter] : xivApi.getServer(selectedWorldId).name;
	let listings: Listing[];
	$: listings =
		selectedWorldId == -1
			? listingsDataCenter.get(selectedDatacenter) ?? []
			: listingsServers.get(selectedDatacenter)?.get(selectedWorldName) ?? [];
	$: listingsNQ = listings.filter((x) => !x.hq);
	$: listingsHQ = listings.filter((x) => x.hq);
	$: averageListingsNQPrice = Math.round(listingsNQ.map((x) => x.price_per_unit).reduce((a, b) => a + b, 0) / listingsNQ.length);
	$: averageListingsHQPrice = Math.round(listingsHQ.map((x) => x.price_per_unit).reduce((a, b) => a + b, 0) / listingsHQ.length);

	let purchases: Purchase[];
	$: purchases =
		selectedWorldId == -1
			? purchasesDataCenter.get(selectedDatacenter) ?? []
			: purchasesServers.get(selectedDatacenter)?.get(selectedWorldName) ?? [];
	$: purchasesNQ = purchases.filter((x) => !x.hq);
	$: purchasesHQ = purchases.filter((x) => x.hq);
	$: averagePurchaseNQPrice = Math.round(purchasesNQ.map((x) => x.price_per_unit).reduce((a, b) => a + b, 0) / purchasesNQ.length);
	$: averagePurchaseHQPrice = Math.round(purchasesHQ.map((x) => x.price_per_unit).reduce((a, b) => a + b, 0) / purchasesHQ.length);

	// Plotting data
	$: reversedPurchasesNQ = purchasesNQ.slice(0).reverse();
	$: purchasesDataNQ = {
		labels: reversedPurchasesNQ.map((x) => new Date(x.purchase_time)),
		datasets: [
			{
				label: 'Price per unit NQ',
				data: reversedPurchasesNQ.map((x) => x.price_per_unit),
				borderWidth: 2,
				fill: 'origin'
			}
		]
	};

	$: reversedPurchasesHQ = purchasesHQ.slice(0).reverse();
	$: purchasesHQData = {
		labels: reversedPurchasesHQ.map((x) => new Date(x.purchase_time)),
		datasets: [
			{
				label: 'Price per unit HQ',
				data: reversedPurchasesHQ.map((x) => x.price_per_unit),
				borderWidth: 2,
				fill: 'origin'
			}
		]
	};
</script>

<svelte:head>
	<title>{item.name} | Xivhub Market</title>
	<meta
		name="description"
		content={`Market listings and purchases for ${item.name}. \nHQ: ${globalAverageHqPrice} | NQ: ${globalAverageNqPrice}`}
	/>
	<meta property="og:image" content={xivApi.apiBase(item.icon_hd)} />
	<meta
		property="og:description"
		content={`Market listings and purchases for ${item.name}. \nHQ: ${globalAverageHqPrice} | NQ: ${globalAverageNqPrice}`}
	/>
</svelte:head>

<Container fluid>
	<Container>
		<Row>
			<Col>
				<Card>
					<CardHeader>
						<CardTitle>{item.name} <span class="text-muted fs-6">{item.item_kind_name}</span></CardTitle>
					</CardHeader>
					<CardBody>
						<CardText>
							<Row>
								<Col xs={1}>
									<img alt={`${item.name} Icon`} src={`https://xivapi.com${item.icon_hd}`} />
									<img alt="Item Category Icon" class="mt-2" src={xivApi.apiBase(item.item_search_category_iconhd)} />
								</Col>
								<Col>
									<p style="white-space: pre-line">
										{item.description.replace(/[\n]+/g, '\n').replace(/(<([^>]+)>)/gi, '')}
									</p>
								</Col>
							</Row>
						</CardText>
					</CardBody>
				</Card>
			</Col>
		</Row>

		<Row>
			<Col>
				<Card class="mt-2">
					<CardBody>
						<Nav pills class="text-center d-flex justify-content-center">
							{#each Object.entries(DataCenters) as [datacenterIdStr, datacenter]}
								{@const datacenterId = parseInt(datacenterIdStr)}
								{@const lastUploadDate = lastUpdatedDatacenter.get(parseInt(datacenterIdStr)) ?? 'unknown'}
								<NavItem id={datacenterIdStr}>
									<NavLink
										class="fw-bold"
										active={selectedDatacenter == datacenterId}
										on:click={() => {
											selectedDatacenter = datacenterId;
											localStorage.setItem('default-dc', datacenterId.toString());
											selectedWorld = -1;
										}}
									>
										<span>{datacenter.name}</span>
										<br />
										<span class="fst-italic fw-normal">
											{#if lastUploadDate === 'unknown'}
												{lastUploadDate}
											{:else}
												{formatDistanceToNowStrict(lastUploadDate)} ago
											{/if}
										</span>
									</NavLink>
								</NavItem>
							{/each}
						</Nav>
					</CardBody>
				</Card>
			</Col>
		</Row>

		<Row>
			<Col>
				<Card class="mt-2">
					<CardBody>
						<Nav pills class="text-center d-flex justify-content-center">
							<NavItem>
								<NavLink
									class="fw-bold"
									active={selectedWorld == -1}
									on:click={() => {
										selectedWorld = -1;
										selectedWorldId = -1;
									}}
								>
									{@const lastUploadDate = lastUpdatedDatacenter.get(selectedDatacenter) ?? 'unknown'}
									<span>All</span>
									<br />
									<span class="fst-italic fw-normal">
										{#if lastUploadDate === 'unknown'}
											{lastUploadDate}
										{:else}
											{formatDistanceToNowStrict(lastUploadDate)} ago
										{/if}
									</span>
								</NavLink>
							</NavItem>
							{#each Object.entries(DataCenters[selectedDatacenter].worlds) as [worldId, worldName], i}
								{@const lastUploadDate = lastUpdated.get(worldName) ?? 'unknown'}
								<NavItem>
									<NavLink
										class="fw-bold"
										active={selectedWorld == i}
										on:click={() => {
											selectedWorld = i;
											selectedWorldId = parseInt(worldId);
										}}
									>
										<span>{worldName}</span>
										<br />
										<span class="fst-italic fw-normal">
											{#if lastUploadDate === 'unknown'}
												{lastUploadDate}
											{:else}
												{formatDistanceToNowStrict(lastUploadDate)} ago
											{/if}
										</span>
									</NavLink>
								</NavItem>
							{/each}
						</Nav>

						<Row class="d-flex justify-content-center text-center">
							{#if cheapestHQListingPerDatacenter.has(selectedDatacenter)}
								<Col>
									{@const cheapest = cheapestHQListingPerDatacenter.get(selectedDatacenter)}
									{#if cheapest}
										<span>
											Cheapest HQ at
											<b>{xivApi.getServer(cheapest.world_id).name}</b>:
											<b>{cheapest.quantity} x {numberWithCommas(cheapest.price_per_unit)}</b>
										</span>
									{/if}
								</Col>
							{/if}
							{#if cheapestNQListingPerDatacenter.has(selectedDatacenter)}
								<Col>
									{@const cheapest = cheapestNQListingPerDatacenter.get(selectedDatacenter)}
									{#if cheapest}
										<span>
											Cheapest NQ at
											<b>{xivApi.getServer(cheapest.world_id).name}</b>:
											<b>{cheapest.quantity} x {numberWithCommas(cheapest.price_per_unit)}</b>
										</span>
									{/if}
								</Col>
							{/if}
						</Row>
					</CardBody>
				</Card>
			</Col>
		</Row>
	</Container>

	<Row>
		<Col>
			<Card class="mt-3">
				<CardBody>
					<CardText>
						<Row>
							<Col>
								<h4 class="mt-2">Listings</h4>
								<ul class="mt-2">
									{#if !isNaN(averageListingsHQPrice)}
										<li>
											Average Listing HQ Price: <b>{numberWithCommas(averageListingsHQPrice)}</b>
											({((averageListingsHQPrice / averagePurchaseHQPrice) * 100).toFixed(2)}% of purchase average)
										</li>
									{/if}
									{#if !isNaN(averageListingsNQPrice)}
										<li>
											Average Listing NQ Price: <b>{numberWithCommas(averageListingsNQPrice)}</b>
											({((averageListingsNQPrice / averagePurchaseNQPrice) * 100).toFixed(2)}% of purchase average)
										</li>
									{/if}
								</ul>
								<h4 class="mt-2">HQ Listings</h4>
								<ListingTable listings={listingsHQ} withServer={selectedWorldId == -1} average={averagePurchaseHQPrice} />

								<h4 class="mt-2">NQ Listings</h4>
								<ListingTable listings={listingsNQ} withServer={selectedWorldId == -1} average={averagePurchaseNQPrice} />
							</Col>
							<Col>
								<h4 class="mt-2">Purchases</h4>
								<ul class="mt-2">
									{#if !isNaN(averagePurchaseHQPrice)}
										<li>Average Purchase HQ Price: <b>{numberWithCommas(averagePurchaseHQPrice)}</b></li>
									{/if}
									{#if !isNaN(averagePurchaseNQPrice)}
										<li>Average Purchase NQ Price: <b>{numberWithCommas(averagePurchaseNQPrice)}</b></li>
									{/if}
								</ul>

								<PurchasesTable {purchases} withServer={selectedWorldId == -1} />
							</Col>
						</Row>
					</CardText>
				</CardBody>
			</Card>
		</Col>
	</Row>

	<Row class="mt-2">
		<Col>
			<Card>
				<CardHeader>
					<CardTitle>NQ Purchase History</CardTitle>
				</CardHeader>
				<CardBody>
					<CardText class="text-center">
						<LineGraph data={purchasesDataNQ} />
					</CardText>
				</CardBody>
			</Card>
		</Col>

		<Col>
			<Card>
				<CardHeader>
					<CardTitle>HQ Purchase History</CardTitle>
				</CardHeader>
				<CardBody>
					<CardText class="text-center">
						<LineGraph data={purchasesHQData} />
					</CardText>
				</CardBody>
			</Card>
		</Col>
	</Row>
</Container>
