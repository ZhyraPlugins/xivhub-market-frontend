<script lang="ts">
	import { xivApi, type Listing, type Purchase, type XivItemInfo } from '$lib/api';
	import { numberWithCommas } from '$lib/util';
	import { Nav, NavItem, NavLink } from 'sveltestrap';
	import type { PageData } from './$types';
	import { formatDistanceToNowStrict } from 'date-fns';
	import LineGraph from '$lib/LineGraph.svelte';
	import ListingTable from '$lib/components/ListingTable.svelte';
	import { DataCenters } from '$lib/datacenters';
	import PurchasesTable from '$lib/components/PurchasesTable.svelte';
	import { onMount } from 'svelte';
	import { median, medianAbsoluteDeviation, mode, sampleSkewness, standardDeviation, variance } from 'simple-statistics';
	import StatsTable from '$lib/components/StatsTable.svelte';
	import Container from '$lib/components/Container.svelte';
	import Card from '$lib/components/Card.svelte';
	import CardHeader from '$lib/components/CardHeader.svelte';

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
	$: listingsNQPrices = listingsNQ.map((x) => x.price_per_unit);
	$: listingsHQPrices = listingsHQ.map((x) => x.price_per_unit);
	$: listingsNQQuantities = listingsNQ.map((x) => x.quantity);
	$: listingsHQQuantities = listingsHQ.map((x) => x.quantity);
	$: averageListingsNQPrice = Math.round(listingsNQPrices.reduce((a, b) => a + b, 0) / listingsNQ.length);
	$: averageListingsHQPrice = Math.round(listingsHQPrices.reduce((a, b) => a + b, 0) / listingsHQ.length);
	$: medianListingNQPrice = listingsNQ.length > 0 ? median(listingsNQPrices) : NaN;
	$: medianListingHQPrice = listingsHQ.length > 0 ? median(listingsHQPrices) : NaN;
	$: modeListingNQPrice = listingsNQ.length > 0 ? mode(listingsNQPrices) : NaN;
	$: modeListingHQPrice = listingsHQ.length > 0 ? mode(listingsHQPrices) : NaN;

	$: meanListingsNQQuantity = Math.round(listingsNQQuantities.reduce((a, b) => a + b, 0) / listingsNQ.length);
	$: meanListingsHQQuantity = Math.round(listingsHQQuantities.reduce((a, b) => a + b, 0) / listingsHQ.length);
	$: medianListingNQQuantity = listingsNQ.length > 0 ? median(listingsNQQuantities) : NaN;
	$: medianListingHQQuantity = listingsHQ.length > 0 ? median(listingsHQQuantities) : NaN;
	$: modeListingNQQuantity = listingsNQ.length > 0 ? mode(listingsNQQuantities) : NaN;
	$: modeListingHQQuantity = listingsHQ.length > 0 ? mode(listingsHQQuantities) : NaN;

	let purchases: Purchase[];
	$: purchases =
		selectedWorldId == -1
			? purchasesDataCenter.get(selectedDatacenter) ?? []
			: purchasesServers.get(selectedDatacenter)?.get(selectedWorldName) ?? [];
	$: purchasesNQ = purchases.filter((x) => !x.hq);
	$: purchasesHQ = purchases.filter((x) => x.hq);
	$: purchasesNQPrices = purchasesNQ.map((x) => x.price_per_unit);
	$: purchasesHQPrices = purchasesHQ.map((x) => x.price_per_unit);
	$: purchasesNQQuantities = purchasesNQ.map((x) => x.quantity);
	$: purchasesHQQuantities = purchasesHQ.map((x) => x.quantity);
	$: averagePurchaseNQPrice = Math.round(purchasesNQPrices.reduce((a, b) => a + b, 0) / purchasesNQ.length);
	$: averagePurchaseHQPrice = Math.round(purchasesHQPrices.reduce((a, b) => a + b, 0) / purchasesHQ.length);
	$: medianPurchaseNQPrice = purchasesNQ.length > 0 ? median(purchasesNQPrices) : NaN;
	$: medianPurchaseHQPrice = purchasesHQ.length > 0 ? median(purchasesHQPrices) : NaN;
	$: modePurchaseNQPrice = purchasesNQ.length > 0 ? mode(purchasesNQPrices) : NaN;
	$: modePurchaseHQPrice = purchasesHQ.length > 0 ? mode(purchasesHQPrices) : NaN;

	$: meanPurchaseNQQuantity = Math.round(purchasesNQQuantities.reduce((a, b) => a + b, 0) / listingsNQ.length);
	$: meanPurchaseHQQuantity = Math.round(purchasesHQQuantities.reduce((a, b) => a + b, 0) / listingsHQ.length);
	$: medianPurchaseNQQuantity = purchasesNQ.length > 0 ? median(purchasesNQQuantities) : NaN;
	$: medianPurchaseHQQuantity = purchasesHQ.length > 0 ? median(purchasesHQQuantities) : NaN;
	$: modePurchaseNQQuantity = purchasesNQ.length > 0 ? mode(purchasesNQQuantities) : NaN;
	$: modePurchaseHQQuantity = purchasesHQ.length > 0 ? mode(purchasesHQQuantities) : NaN;

	// Plotting data
	$: reversedPurchasesNQ = purchasesNQ.slice(0).reverse();
	$: purchasesDataNQ = {
		labels: reversedPurchasesNQ.map((x) => new Date(x.purchase_time)),
		datasets: [
			{
				label: 'Price per unit NQ',
				data: reversedPurchasesNQ.map((x) => x.price_per_unit),
				borderWidth: 2,
				fill: 'origin',
				borderColor: '#0d9488',
				backgroundColor: '#1f2937'
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
				fill: 'origin',
				borderColor: '#0d9488',
				backgroundColor: '#1f2937'
			}
		]
	};

	$: lastDatacenterUploadDate = lastUpdatedDatacenter.get(selectedDatacenter);
</script>

<svelte:head>
	<title>{item.name} | Xivhub Market</title>
	<meta
		name="description"
		content={`Market listings and purchases for ${item.name}. \nHQ: ${globalAverageHqPrice} | NQ: ${globalAverageNqPrice}`} />
	<meta property="og:image" content={xivApi.apiBase(item.icon_hd)} />
	<meta
		property="og:description"
		content={`Market listings and purchases for ${item.name}. \nHQ: ${globalAverageHqPrice} | NQ: ${globalAverageNqPrice}`} />
</svelte:head>

<Container class="flex flex-col gap-2">
	<Card>
		<CardHeader>
			<div class="font-bold text-xl">{item.name} <span class="text-base font-normal text-gray-100">{item.item_kind_name}</span></div>
		</CardHeader>
		<div class="flex flex-row px-4 py-2 gap-4">
			<div class="max-w-xs">
				<img alt={`${item.name} Icon`} src={`https://xivapi.com${item.icon_hd}`} />
				<img alt="Item Category Icon" class="mt-2" src={xivApi.apiBase(item.item_search_category_iconhd)} />
			</div>
			<div class="flex-1">
				<p class="whitespace-pre-wrap">
					{item.description.replace(/[\n]+/g, '\n').replace(/(<([^>]+)>)/gi, '')}
				</p>
				<ul class="list-inside list-disc">
					<li>Stack Size: {item.stack_size}</li>
					<li>Item level: {item.level_item}</li>
					<li>Equip level: {item.level_equip}</li>
					<li>Can be HQ: {item.can_be_hq.toString()}</li>
					<li>Rarity: {item.rarity}</li>
				</ul>
			</div>
		</div>
	</Card>

	<!-- Datacenters -->
	<Card>
		<ul class="flex px-4 py-2 gap-2">
			{#each Object.entries(DataCenters) as [datacenterIdStr, datacenter]}
				{@const datacenterId = parseInt(datacenterIdStr)}
				{@const lastUploadDate = lastUpdatedDatacenter.get(parseInt(datacenterIdStr)) ?? 'unknown'}
				<li id={datacenterIdStr} class="flex-1">
					<button
						class="text-center block border border-gray-500 rounded-md hover:border-teal-400 text-teal-500 
							hover:bg-gray-800 py-1 px-2 w-full h-full
						 {selectedDatacenter == datacenterId ? 'bg-gray-800' : ''}"
						on:click={() => {
							selectedDatacenter = datacenterId;
							localStorage.setItem('default-dc', datacenterId.toString());
							selectedWorld = -1;
						}}>
						<span class="font-bold text-lg">{datacenter.name}</span>
						<br />
						<span class="italic font-normal text-sm">
							{#if lastUploadDate === 'unknown'}
								{lastUploadDate}
							{:else}
								{formatDistanceToNowStrict(lastUploadDate)} ago
							{/if}
						</span>
					</button>
				</li>
			{/each}
		</ul>
	</Card>

	<!-- Worlds -->
	<Card>
		<div class="flex flex-col">
			<ul class="flex px-4 py-2 gap-2">
				<li class="flex-1">
					<button
						class="text-center block border border-gray-500 rounded-md hover:border-teal-400 text-teal-500 
							hover:bg-gray-800 py-1 px-2 w-full h-full
						 {selectedWorld == -1 ? 'bg-gray-800' : ''}"
						on:click={() => {
							selectedWorld = -1;
							selectedWorldId = -1;
						}}>
						<span class="font-bold text-lg">All</span>
						<br />
						<span class="italic font-normal text-sm">
							{#if lastDatacenterUploadDate === undefined}
								Unknown
							{:else}
								{formatDistanceToNowStrict(lastDatacenterUploadDate)} ago
							{/if}
						</span>
					</button>
				</li>
				{#each Object.entries(DataCenters[selectedDatacenter].worlds) as [worldId, worldName], i}
					{@const lastUploadDate = lastUpdated.get(worldName)}
					<li class="flex-1">
						<button
							class="text-center block border border-gray-500 rounded-md hover:border-teal-400 text-teal-500 
								 hover:bg-gray-800 py-1 px-2 w-full h-full
						 			{selectedWorld == i ? 'bg-gray-800' : ''}"
							on:click={() => {
								selectedWorld = i;
								selectedWorldId = parseInt(worldId);
							}}>
							<span class="font-bold text-lg">{worldName}</span>
							<br />
							<span class="italic font-normal text-sm">
								{#if lastUploadDate === undefined}
									Unknown
								{:else}
									{formatDistanceToNowStrict(lastUploadDate)} ago
								{/if}
							</span>
						</button>
					</li>
				{/each}
			</ul>
			<div class="flex justify-center pb-2 gap-4">
				{#if cheapestHQListingPerDatacenter.has(selectedDatacenter)}
					{@const cheapest = cheapestHQListingPerDatacenter.get(selectedDatacenter)}
					<div>
						{#if cheapest}
							<span>
								Cheapest HQ at
								<b>{xivApi.getServer(cheapest.world_id).name}</b>:
								<b
									>{cheapest.quantity} x {numberWithCommas(cheapest.price_per_unit)} = {numberWithCommas(
										cheapest.quantity * cheapest.price_per_unit
									)}</b>
							</span>
						{/if}
					</div>
				{/if}
				{#if cheapestNQListingPerDatacenter.has(selectedDatacenter)}
					{@const cheapest = cheapestNQListingPerDatacenter.get(selectedDatacenter)}
					<div>
						{#if cheapest}
							<span>
								Cheapest NQ at
								<b>{xivApi.getServer(cheapest.world_id).name}</b>:
								<b
									>{cheapest.quantity} x {numberWithCommas(cheapest.price_per_unit)} = {numberWithCommas(
										cheapest.quantity * cheapest.price_per_unit
									)}</b>
							</span>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</Card>

	<div class="flex flex-row gap-2 flex-1">
		<div class="flex flex-col gap-2 flex-1">
			{#if listingsHQ.length > 0}
				<StatsTable
					title="HQ Listing Stats"
					values={[
						{
							type: 'Price per unit',
							mean: averageListingsHQPrice,
							median: medianListingHQPrice,
							mode: modeListingHQPrice,
							stddev: standardDeviation(listingsHQPrices),
							mad: medianAbsoluteDeviation(listingsHQPrices)
						},
						{
							type: 'Quantity',
							mean: meanListingsHQQuantity,
							median: medianListingHQQuantity,
							mode: modeListingHQQuantity,
							stddev: standardDeviation(listingsHQQuantities),
							mad: medianAbsoluteDeviation(listingsHQQuantities)
						}
					]} />

				<ListingTable
					title="HQ Listings"
					listings={listingsHQ}
					withServer={selectedWorldId == -1}
					mean={averagePurchaseHQPrice}
					median={medianPurchaseHQPrice}
					item_info={item} />
			{:else}
				<!--	<p>There are no HQ Listings.</p>-->
			{/if}

			{#if listingsNQ.length > 0}
				<StatsTable
					title="NQ Listing Stats"
					values={[
						{
							type: 'Price per unit',
							mean: averageListingsNQPrice,
							median: medianListingNQPrice,
							mode: modeListingNQPrice,
							stddev: standardDeviation(listingsNQPrices),
							mad: medianAbsoluteDeviation(listingsNQPrices)
						},
						{
							type: 'Quantity',
							mean: meanListingsNQQuantity,
							median: medianListingNQQuantity,
							mode: modeListingNQQuantity,
							stddev: standardDeviation(listingsNQQuantities),
							mad: medianAbsoluteDeviation(listingsNQQuantities)
						}
					]} />

				<ListingTable
					title="NQ Listings"
					item_info={item}
					listings={listingsNQ}
					withServer={selectedWorldId == -1}
					mean={averagePurchaseNQPrice}
					median={medianPurchaseNQPrice} />
			{:else}
				<p>There are no NQ Listings.</p>
			{/if}
		</div>

		<div class="flex flex-col gap-2 flex-1">
			<StatsTable
				title="Purchases Stats"
				values={[
					{
						type: 'Price per unit (HQ)',
						mean: averagePurchaseNQPrice,
						median: medianPurchaseNQPrice,
						mode: modePurchaseNQPrice,
						stddev: purchasesHQ.length > 0 ? standardDeviation(purchasesHQPrices) : NaN,
						mad: purchasesHQ.length > 0 ? medianAbsoluteDeviation(purchasesHQPrices) : NaN,
						hidden: purchasesHQ.length == 0
					},
					{
						type: 'Quantity (HQ)',
						mean: meanPurchaseHQQuantity,
						median: medianPurchaseHQQuantity,
						mode: modePurchaseHQQuantity,
						stddev: purchasesHQ.length > 0 ? standardDeviation(purchasesHQQuantities) : NaN,
						mad: purchasesHQ.length > 0 ? medianAbsoluteDeviation(purchasesHQQuantities) : NaN,
						hidden: purchasesHQ.length == 0
					},
					{
						type: 'Price per unit (NQ)',
						mean: averagePurchaseNQPrice,
						median: medianPurchaseNQPrice,
						mode: modePurchaseNQPrice,
						stddev: purchasesNQ.length > 0 ? standardDeviation(purchasesNQPrices) : NaN,
						mad: purchasesNQ.length > 0 ? medianAbsoluteDeviation(purchasesNQPrices) : NaN,
						hidden: purchasesNQ.length == 0
					},
					{
						type: 'Quantity (NQ)',
						mean: meanPurchaseNQQuantity,
						median: medianPurchaseNQQuantity,
						mode: modePurchaseNQQuantity,
						stddev: purchasesNQ.length > 0 ? standardDeviation(purchasesNQQuantities) : NaN,
						mad: purchasesNQ.length > 0 ? medianAbsoluteDeviation(purchasesNQQuantities) : NaN,
						hidden: purchasesNQ.length == 0
					}
				]} />

			<PurchasesTable title="Purchases" {purchases} withServer={selectedWorldId == -1} />
		</div>
	</div>

	<div class="flex flex-row w-full gap-2">
		<div class="flex-1"><LineGraph data={purchasesDataNQ} /></div>
		<div class="flex-1"><LineGraph data={purchasesHQData} /></div>
	</div>

	<!--
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
	-->
</Container>
