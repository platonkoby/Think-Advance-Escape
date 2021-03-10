import { CommonItem } from '../data/commonItems';
import { UncommonItem } from '../data/uncommonItems';
import { Action } from '../mechanics/action';
import LocationsCollection from '../mechanics/location';
import { GameMap } from './Maps';

export type LocationTitle = 'beach' | 'cave' | 'rocky hills' | 'jungle' | 'white sands' | 'test';
export type Tag =
	| 'explore'
	| 'rough terrain'
	| 'enclosed'
	| 'dark'
	| 'high'
	| 'high vegetation'
	| 'humid'
	| 'coastal'
	| 'all';
export type LocationType = 'large' | 'medium' | 'small' | 'win condition' | 'initial location' | 'all';
export type OneLoc = LocWC | LocSmall | LocLarge | LocMedium;

export type AllLoc = OneLoc | LocWC | LocInit;
interface Items {
	commonItems: CommonItem[];
	uncommonItems: UncommonItem[];
}
export interface AllLocations {
	all: AllLoc[];
	nonFixedLocations: (LocSmall | LocLarge | LocMedium)[];
	initialLocations: LocInit[];
	winConditionLocations: LocWC[];
}
export type LocationsCollectionMethods = 'setInitialLocations' | 'setWCLocations' | 'setNonFixedLocations';
export type LocationCollectionProps = Omit<LocationsCollection, LocationsCollectionMethods>;

interface Loc {
	title: LocationTitle;
	type: LocationType | [LocationType, LocationType];
	description: string;
	tags: Tag[];
	fixed: boolean;
	initial?: boolean;
	text?: string;
	items: Items;
	actions: Action[];
}

export interface LocLarge extends Loc {
	type: 'large';
	fixed: false;
}
export interface LocMedium extends Loc {
	type: 'medium';
	fixed: false;
}
export interface LocSmall extends Loc {
	type: 'small';
	fixed: false;
}
export interface LocWC extends Loc {
	type: 'win condition' | ['win condition', 'initial location'];
	fixed: true;
	for: GameMap;
}
export interface LocInit extends Loc {
	type: 'initial location' | ['win condition', 'initial location'];
	fixed: true;
	initial: true;
	for: GameMap;
	text: string;
}
