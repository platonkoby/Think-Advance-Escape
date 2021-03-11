import { MapLocations } from './Maps';

export interface getNeighbour {
	graph: Map<number, MapLocations>;
	currentPos: MapLocations;
	direction: 'next' | 'prev';
}

export type Optional<T> = { [P in keyof T]?: T[P] };
