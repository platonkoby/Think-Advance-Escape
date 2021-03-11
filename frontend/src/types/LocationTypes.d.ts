import { CommonItem } from '../data/commonItems';
import { UncommonItem } from '../data/uncommonItems';
import { Action } from '../mechanics/action';
import LocationsCollection from '../mechanics/location';
import { Items } from './Items';
import { GameMap } from './Maps';

// read Location
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

//type of location, which represents any one location except LocInit
export type OneLoc = LocWC | LocSmall | LocLarge | LocMedium;

//type of location which represents any one location
export type AllLoc = OneLoc | LocWC | LocInit;

// type is the same as LocationsCollection, but with the properties not optional
export interface AllLocations {
	all: AllLoc[];
	nonFixedLocations: (LocSmall | LocLarge | LocMedium)[];
	initialLocations: LocInit[];
	winConditionLocations: LocWC[];
}

// ignore this type, it is utility
type LocationsCollectionMethods = 'setInitialLocations' | 'setWCLocations' | 'setNonFixedLocations';

// type for the constructor of LocationCollection class
export type LocationCollectionProps = Omit<LocationsCollection, LocationsCollectionMethods>;

// an interface which is a parent for the other Loc based interfaces
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

// an interface for large locations, read Location
export interface LocLarge extends Loc {
	type: 'large';
	fixed: false;
}

// an interface for medium locations, read Location
export interface LocMedium extends Loc {
	type: 'medium';
	fixed: false;
}

// an interface for small locations, read Location
export interface LocSmall extends Loc {
	type: 'small';
	fixed: false;
}

// an interface for win condition locations, read Location
export interface LocWC extends Loc {
	type: 'win condition' | ['win condition', 'initial location'];
	fixed: true;
	for: GameMap;
}

// an interface for initial locations, read Location
export interface LocInit extends Loc {
	type: 'initial location' | ['win condition', 'initial location'];
	fixed: true;
	initial: true;
	for: GameMap;
	text: string;
}
