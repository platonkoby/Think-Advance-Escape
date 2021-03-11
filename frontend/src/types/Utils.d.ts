import { MapLocations } from './Maps';

// utility interface for props of the getNeighbour function
export interface getNeighbour {
	graph: Map<number, MapLocations>;
	currentPos: MapLocations;
	direction: 'next' | 'prev';
}

// a type which creates an optional vertion of the type
export type Optional<T> = { [P in keyof T]?: T[P] };
