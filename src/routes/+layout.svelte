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
		Container,
		Col,
		Alert,
		ListGroup,
		ListGroupItem,
		Row
	} from 'sveltestrap';
</script>

<svelte:head>
	<title>XivHub Market</title>
	<meta name="description" content="View FFXIV market board data." />
	<meta name="author" content="Zhyra" />
	<meta property="og:site_name" content="XivHub Market" />
</svelte:head>

<Styles />

<Navbar color="light" light expand="lg" class="mb-4">
	<NavbarBrand href="/" class="me-auto">XivHub Market</NavbarBrand>
	<Nav navbar>
		<NavItem>
			<NavLink href="/search">Search</NavLink>
		</NavItem>
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

<Container>
	<Alert color="warning">
		<h4 class="alert-heading text-capitalize">Work in progress</h4>
		<p>
			The site is currently in live development. You can join our <a href="https://discord.gg/GZK9aME8wN">discord</a>
			or follow us on <a href="https://twitter.com/XivHub">twitter</a>!
		</p>
		<p class="mb-0">
			You can help providing data using the dalamud
			<a href="https://github.com/ZhyraPlugins/MarketUploader"> plugin </a>
		</p>
	</Alert>
</Container>

<slot />

<Container class="mt-2">
	<hr />
	<footer class="d-flex">
		<Row class="w-100">
			<Col xs={8}><p class="text-muted text-center">&copy; 2022 <a href="https://xivhub.org">xivhub.org</a></p></Col>
			<Col xs={2}>
				<ListGroup flush>
					<ListGroupItem tag="a" href="https://discord.gg/GZK9aME8wN">Discord</ListGroupItem>
					<ListGroupItem tag="a" href="https://twitter.com/XivHub">Twitter</ListGroupItem>
				</ListGroup>
			</Col>
		</Row>
	</footer>
</Container>
