import { PUBLIC_MARKET_API } from '$env/static/public';
import Servers from '../worlds.json';
import qs from 'query-string';

export interface Upload {
	id: string;
	name: string;
	icon: string;
	uploader_id: string;
	upload_time: string;
	world_id: number;
	item_id: number;
	upload_type: number;
}

export interface Listing {
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
	uploads_per_day: { count: number; day: string }[];
	purchase_by_day: { count: number; day: string }[];
}

export interface SimpleItem {
	item_id: number;
	name: string;
	icon: string;
	icon_hd: string;
	description: string;
	item_kind_name: string;
	item_kind_id: number;
	item_search_category: number;
	item_search_category_iconhd: string;
	item_search_category_name: string;
	listings: number | null;
}

type Fetch = (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>;

export interface XivItemInfo {
	item_id: number;
	name: string;
	icon: string;
	icon_hd: string;
	description: string;
	item_kind_name: string;
	item_kind_id: number;
	item_search_category: number;
	item_search_category_iconhd: string;
	item_search_category_name: string;
	stack_size: number;
	level_item: number;
	level_equip: number;
	rarity: number;
	can_be_hq: boolean;
}

export interface ListingsResponse {
	listings: Listing[];
	item: XivItemInfo;
}

export interface PurchasesResponse {
	purchases: Purchase[];
	item: XivItemInfo;
	page: number;
}

export interface ListItemsReponse {
	items: SimpleItem[];
	page: number;
	total_pages: number;
}

export interface WorldUpload {
	world_id: number;
	upload_time: string;
}

export class HubApi {
	getUrl(path: string) {
		return `${PUBLIC_MARKET_API}${path}`;
	}

	async last_uploads(fetch: Fetch): Promise<Upload[]> {
		const res = await fetch(this.getUrl(`/last_uploads`));

		return await res.json();
	}

	async listings(fetch: Fetch, item_id: number): Promise<ListingsResponse> {
		const res = await fetch(this.getUrl(`/item/${item_id}`));

		return await res.json();
	}

	async purchases(fetch: Fetch, item_id: number, page?: number): Promise<PurchasesResponse> {
		const res = await fetch(this.getUrl(`/item/${item_id}/purchases?page=${page ?? 0}`));

		return await res.json();
	}

	async item_uploads(fetch: Fetch, item_id: number): Promise<WorldUpload[]> {
		const res = await fetch(this.getUrl(`/item/${item_id}/uploads`));

		return await res.json();
	}

	async stats(fetch: Fetch): Promise<Stats> {
		const res = await fetch(this.getUrl(`/stats`));

		return await res.json();
	}

	async list_items(fetch: Fetch, page: number, search?: string): Promise<ListItemsReponse> {
		const query: Record<string, unknown> = {
			page
		};

		if (search !== undefined) {
			search = search.trim();

			if (search !== '') query.search = search;
		}

		const res = await fetch(this.getUrl(`/item?${qs.stringify(query)}`));

		return await res.json();
	}
}

export const hubApi = new HubApi();

export interface XivApiItem {
	Description: string;
	Icon: string;
	IconHD: string;
	Name: string;
	ItemKind: {
		ID: string;
		Name: string;
	};
	ItemSearchCategory: {
		Category: number;
		Name: string;
		IconHD: string;
	};
}

export class XivApi {
	apiBase(path: string) {
		return `https://xivapi.com${path}`;
	}

	getServer(world_id: number): { name: string; datacenter: number } {
		return (Servers as Record<string, any>)[world_id.toString()];
	}
}

export const xivApi = new XivApi();
