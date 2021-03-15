import { CommonItem } from '../data/commonItems';
import { UncommonItem } from '../data/uncommonItems';

export type AllItemTypes = CommonItem | UncommonItem;
export type AllItemTypeNames = 'common' | 'uncommon';

// used by locaitons, so they could keep the items which they have
export interface Items {
	commonItems: CommonItem[];
	uncommonItems: UncommonItem[];
}

export type UncommonItemName = 'broken stalagmite' | 'plastic scrap' | 'vine';
export type CommonItemName = 'dead coral' | 'rock' | 'shell' | 'pebble' | 'wide leaf' | 'flexible branch';

export type AllItemNames = UncommonItemName | CommonItemName;

export type AllItems = (UncommonItem | CommonItem)[];

export type ItemUse = 'build' | 'weapon' | 'tool part' | 'throw';
export type ItemUses = ItemUse[];
