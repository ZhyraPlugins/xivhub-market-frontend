import { PUBLIC_MARKET_API } from '$env/static/public';
//import { PUBLIC_XIVAPI_KEY } from '$env/static/public';
import Servers from '../servers.json';
import { db, type CachedItem } from './db';

export interface Upload {
	id: string;
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
}

export interface SimpleItem {
	item_id: number;
	listings: number;
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

	async stats(fetch: Fetch): Promise<Stats> {
		const res = await fetch(this.getUrl(`/stats`));

		return await res.json();
	}

	async list_items(fetch: Fetch, page: number): Promise<SimpleItem[]> {
		const res = await fetch(this.getUrl(`/item?page=${page}`));

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

	async getItem(fetch: Fetch, item_id: number): Promise<CachedItem> {
		const item = await db.items.get(item_id);

		if (item !== undefined) {
			return item;
		} else {
			const res = await fetch(
				this.apiBase(
					`/item/${item_id}?columns=Name,Icon,IconHD,Description,ItemKind.Name,ItemKind.ID,ItemSearchCategory.Category,ItemSearchCategory.IconHD,ItemSearchCategory.Name`
				)
			);
			const resItem: XivApiItem = await res.json();

			const item = {
				Id: item_id,
				...resItem
			};
			await db.items.add(item);
			return item;
		}
	}

	getServer(world_id: number): { name: string; datacenter: number } {
		return (Servers as Record<string, any>)[world_id.toString()];
	}
}

export const xivApi = new XivApi();
