import { MapLocations } from '../types/Maps';
import { ActionFuncs } from './actionFuncs';
import { getNeighbour } from '../types/Utils';

//Read Utils
// funciton which gets the neighbours of the location on the graph
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

// function which is used in action.actionFuncs.title.btn to create a button title for the action
export const utilGetItemsString = (currentPos: ActionFuncs): string => {
	if (!currentPos.props.currentPos) throw new Error();
	const { commonItems, uncommonItems } = currentPos.props.currentPos.location.items;
	let string = [ 'collect: ' ];
	commonItems.forEach((item) => item && string.push(`${item.title}, `));
	uncommonItems.forEach((item) => item && string.push(`${item.title}, `));
	if (string.length === 1) return 'disable';
	return string.reduce((a, b) => a + b);
};
