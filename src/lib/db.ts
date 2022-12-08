import Dexie, { type Table } from 'dexie';

// client-side database for caching game items, etc.

export interface CachedItem {
	Id: number;
	Icon: string;
	IconHD: string;
	Name: string;
}

export class XivHubDb extends Dexie {
	items!: Table<CachedItem>;

	constructor() {
		super('xivhub-market');

		this.version(1).stores({
			items: '++Id, Icon, IconHD, Name'
		});
	}
}

export const db = new XivHubDb();
