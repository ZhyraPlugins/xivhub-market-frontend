export function numberWithCommas(x: number) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function floatWithCommas(x: number) {
	return x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
