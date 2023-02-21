<script lang="ts">
	import '../app.css';

	import Alert from '$lib/components/Alert.svelte';
	import Container from '$lib/components/Container.svelte';
	import Button from '$lib/components/Button.svelte';
</script>

<svelte:head>
	<title>XivHub Market</title>
	<meta name="description" content="View FFXIV market board data." />
	<meta name="author" content="Zhyra" />
	<meta property="og:site_name" content="XivHub Market" />
</svelte:head>

<nav class="flex items-center justify-between flex-wrap bg-gray-900 p-6 mb-4">
	<div class="flex items-center flex-shrink-0 text-white mr-6">
		<span class="font-semibold text-xl tracking-tight">Xivhub Market</span>
	</div>
	<div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
		<div class="text-sm lg:flex-grow">
			<!--
			<a href="/search" class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">Search</a>
			<a href="#responsive-header" class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"> Examples </a>
			<a href="#responsive-header" class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white"> Blog </a>
			-->
		</div>

		<div>
			<a href="/search" class="block mt-4 lg:inline-block lg:mt-0 text-gray-200 hover:text-white mr-4">Search</a>
			<Button href="https://github.com/ZhyraPlugins/MarketUploader">Dalamud Upload Plugin</Button>
		</div>
	</div>
</nav>

<Container>
	<Alert type="warning">
		<h4 class="font-bold">Work in progress</h4>
		<p>
			The site is currently in live development. You can join our <a href="https://discord.gg/GZK9aME8wN" class="underline">discord</a>
			or follow us on <a href="https://twitter.com/XivHub" class="underline">twitter</a>!
		</p>
		<p class="mb-0">
			You can help providing data using the dalamud
			<a href="https://github.com/ZhyraPlugins/MarketUploader" class="underline">plugin</a>
		</p>
	</Alert>
</Container>

<slot />

<footer class="md:container mx-auto flex my-4 flex-col justify-center w-full px-4 py-2">
	<p class="text-muted text-center font-bold">&copy; 2022 <a class="text-teal-400 font-bold" href="https://xivhub.org">xivhub.org</a></p>
	<div class="flex gap-2 w-full justify-center">
		<p class="text-teal-400 font-bold"><a href="https://discord.gg/GZK9aME8wN">Discord</a></p>
		<span> | </span>
		<p class="text-teal-400 font-bold "><a href="https://twitter.com/XivHub">Twitter</a></p>
	</div>
	<p class="text-muted text-center mt-4">
		Final Fantasy XIV © 2010-2023 SQUARE ENIX CO., LTD. All Rights Reserved. This site is not affiliated in any way with SQUARE ENIX CO.,
		LTD.
	</p>
</footer>
