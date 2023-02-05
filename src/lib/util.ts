import { format } from 'numerable';

export function numberWithCommas(x: number) {
	return format(x, '0,0[.]00');
}
