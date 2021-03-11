import { AllLoc, LocationTitle } from './LocationTypes';

export type GameMap = DessertedIsland;

interface Maps {
	title: string;
	locations: LocationTitle[];
}

export interface DessertedIsland extends Maps {
	title: 'desserted island';
	locations: ['beach', 'cave', 'rocky hills', 'white sands', 'jungle'];
}

export interface MapLocations {
	location: AllLoc;
	neighbours: AllLoc[];
}
