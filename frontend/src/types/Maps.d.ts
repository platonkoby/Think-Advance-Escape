import { AllLoc, LocationTitle } from './LocationTypes';

// a type, representing all existing game maps
export type GameMap = DessertedIsland;

// a parernt interface, which is used to create game map types
interface Maps {
	title: string;
	locations: LocationTitle[];
}

// a map type 'desserted island' map
export interface DessertedIsland extends Maps {
	title: 'desserted island';
	locations: ['beach', 'cave', 'rocky hills', 'white sands', 'jungle'];
}

// an interface, which is used to represent the location inside the graph of the level, read Level
export interface MapLocations {
	location: AllLoc;
	neighbours: AllLoc[];
}
