import Dexie, { type Table } from 'dexie';
import type { XivApiItem } from './api';

// client-side database for caching game items, etc.

export interface CachedItem extends XivApiItem {
	Id: number;
}

export class XivHubDb extends Dexie {
	items!: Table<CachedItem>;

	constructor() {
		super('xivhub-marketv2');

		this.version(2).stores({
			items: '++Id, Name'
		});
	}
}

export const db = new XivHubDb();
