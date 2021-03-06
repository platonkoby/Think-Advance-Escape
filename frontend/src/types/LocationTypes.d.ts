import { CommonItem } from '../data/commonItems';
import { UncommonItem } from '../data/uncommonItems';
import { Action } from '../mechanics/action';
import LocationsCollection from '../mechanics/location';
import { Items } from './Items';
import { GameMap } from './Maps';
import { LocationType, LocationTag } from './Tags-Types';


export type LocationTitle = 'beach' | 'cave' | 'rocky hills' | 'jungle' | 'white sands' | 'test';

export type OneLoc = LocWC | LocSmall | LocLarge | LocMedium;

export type AllLoc = OneLoc | LocWC | LocInit;

export interface AllLocations {
	all: AllLoc[];
	nonFixedLocations: (LocSmall | LocLarge | LocMedium)[];
	initialLocations: LocInit[];
	winConditionLocations: LocWC[];
}

type LocationsCollectionMethods = 'setInitialLocations' | 'setWCLocations' | 'setNonFixedLocations';

export type LocationCollectionProps = Omit<LocationsCollection, LocationsCollectionMethods>;

interface Loc {
	title: LocationTitle;
	type: LocationType | [LocationType, LocationType];
	description: string;
	tags: LocationTag[];
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
