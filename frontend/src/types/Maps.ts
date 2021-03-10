import { AllLoc, LocationTitle } from './locationTypes';

export type GameMap = DessertedIsland;

interface Maps {
	title: string;
	locations: LocationTitle[];
}

interface DessertedIsland extends Maps {
	title: 'desserted island';
	locations: ['beach', 'cave', 'rocky hills', 'white sands', 'jungle'];
}

export const dessertedIsland: DessertedIsland = {
	title: 'desserted island',
	locations: [ 'beach', 'cave', 'rocky hills', 'white sands', 'jungle' ]
};

export interface MapLocations {
	location: AllLoc;
	neighbours: AllLoc[];
}
