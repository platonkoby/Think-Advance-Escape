import { CommonItem } from '../data/commonItems';
import { UncommonItem } from '../data/uncommonItems';

export type AllItemTypes = CommonItem | UncommonItem;
export type AllItemTypeNames = 'common' | 'uncommon';

// used by locaitons, so they could keep the items which they have
export interface Items {
	commonItems: CommonItem[];
	uncommonItems: UncommonItem[];
}
