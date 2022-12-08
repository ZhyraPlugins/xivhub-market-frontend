<script lang="ts">
	import {
		Collapse,
		Navbar,
		NavbarBrand,
		NavbarToggler,
		Styles,
		Nav,
		NavItem,
		NavLink,
		Container
	} from 'sveltestrap';
</script>

<Styles />

<svelte:head>
	<title>Xivhub Market</title>
	<meta name="description" content="View FFXIV market board data." />
	<meta name="author" content="Zhyra" />
</svelte:head>

<Navbar color="light" light expand="lg" class="mb-4">
	<NavbarBrand href="/" class="me-auto">XivHub Market</NavbarBrand>
	<Nav navbar>
		<NavItem>
			<NavLink href="https://github.com/ZhyraPlugins/MarketUploader">Dalamud Upload Plugin</NavLink>
		</NavItem>
		<!--
			<NavItem>
			<NavLink href="/search">Most Bought</NavLink>
		</NavItem>
		<NavItem>
			<NavLink href="/search">Most Sold</NavLink>
		</NavItem>
		<NavItem>
			<NavLink href="/search">Search</NavLink>
		</NavItem>
		-->
	</Nav>
</Navbar>

<slot />
