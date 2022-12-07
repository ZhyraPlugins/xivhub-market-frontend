import { PUBLIC_MARKET_API } from '$env/static/public';
//import { PUBLIC_XIVAPI_KEY } from '$env/static/public';
import Servers from '../servers.json';
import { writable } from 'svelte/store';

// todo cache this
export const cachedItemData = writable(new Map<number, XivApiItem>());

export interface Upload {
	id: string;
	uploader_id: string;
	upload_time: string;
	world_id: number;
	item_id: number;
	upload_type: number;
}

export interface Item {
	listing_id: number;
	upload_id: string;
	world_id: number;
	item_id: number;
	hq: boolean;
	seller_id: string;
	retainer_id: string;
	retainer_name: string;
	creator_id: string;
	creator_name: string;
	last_review_time: string;
	price_per_unit: number;
	quantity: number;
	retainer_city_id: number;
	materia_count: number;
}

export interface Purchase {
	item_id: number;
	world_id: number;
	upload_id: string;
	buyer_name: string;
	hq: boolean;
	on_mannequin: boolean;
	purchase_time: string;
	quantity: number;
	price_per_unit: number;
}

export interface Stats {
	total_uploads: number;
	active_listings: number;
	total_purchases: number;
	unique_uploaders: number;
	unique_items: number;
}

export class HubApi {
	getUrl(path: string) {
		return `${PUBLIC_MARKET_API}${path}`;
	}

	async last_uploads(): Promise<Upload[]> {
		const res = await fetch(this.getUrl(`/last_uploads`));

		return await res.json();
	}

	async listings(item_id: number): Promise<Item[]> {
		const res = await fetch(this.getUrl(`/item/${item_id}`));

		return await res.json();
	}

	async purchases(item_id: number, page?: number): Promise<Purchase[]> {
		const res = await fetch(this.getUrl(`/item/${item_id}/purchases?page=${page ?? 0}`));

		return await res.json();
	}

	async stats(): Promise<Stats> {
		const res = await fetch(this.getUrl(`/stats`));

		return await res.json();
	}
}

export const hubApi = new HubApi();

export interface XivApiItem {
	Icon: string;
	IconHD: string;
	Name: string;
}

// https://chasingcode.dev/blog/svelte-persist-state-to-localstorage/
export class XivApi {
	private last_request: number;

	constructor() {
		this.last_request = 0;
	}

	apiBase(path: string) {
		return `https://xivapi.com${path}`;
	}

	async getItem(item_id: number): Promise<XivApiItem> {
		const res = await fetch(this.apiBase(`/item/${item_id}?columns=Name,Icon,IconHD`));

		return await res.json();
	}

	getServer(world_id: number): { name: string; datacenter: number } {
		return (Servers as Record<string, any>)[world_id.toString()];
	}
}

export const xivApi = new XivApi();
