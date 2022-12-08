<script lang="ts">
	import { Card, CardBody, CardText } from 'sveltestrap';

	export let title: string;
	export let data: string | number;
</script>

<Card>
	<CardBody>
		<CardText class="text-center">
			<h4 class="fw-bolder text-capitalize">{title}</h4>
			<span class="fs-4 fw-bold text-success">{data}</span>
		</CardText>
	</CardBody>
</Card>
