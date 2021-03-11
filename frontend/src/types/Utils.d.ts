import { MapLocations } from './Maps';

export interface getNeighbour {
	graph: Map<number, MapLocations>;
	currentPos: MapLocations;
	direction: 'next' | 'prev';
}
