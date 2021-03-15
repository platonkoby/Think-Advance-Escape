import { MapLocations } from './Maps';
import { PlayerItems } from './Player';

export interface getNeighbour {
	graph: Map<number, MapLocations>;
	currentPos: MapLocations;
	direction: 'next' | 'prev';
}

export type Optional<T> = { [P in keyof T]?: T[P] };

export type utilItemComparisonProps = [boolean, Optional<PlayerItems>, PlayerItems ][];