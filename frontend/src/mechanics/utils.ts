import { MapLocations } from './level';

interface getNeighbour {
	graph: Map<number, MapLocations>;
	currentPos: MapLocations;
	direction: 'next' | 'prev';
}

export const getGraphNeighbour = ({ graph, currentPos, direction }: getNeighbour): MapLocations => {
	let neighbourLoc: MapLocations | undefined;
	graph.forEach((pos) => {
		const neigbour = currentPos.neighbours[direction === 'next' ? 1 : 0];
		if (pos.location.title === neigbour.title) {
			neighbourLoc = pos;
		}
	});
	if (!neighbourLoc) throw new Error();
	return neighbourLoc;
};
