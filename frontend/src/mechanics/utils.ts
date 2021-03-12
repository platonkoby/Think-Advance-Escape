import { MapLocations } from '../types/Maps';
import { ActionFuncs } from './actionFuncs';
import { getNeighbour } from '../types/Utils';
import { AllItemTypeNames } from '../types/Items';

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

export const utilGetItemsString = (currentPos: ActionFuncs): string => {
	if (!currentPos.props.currentPos) throw new Error();
	const { commonItems, uncommonItems } = currentPos.props.currentPos.location.items;
	let string = [ 'collect: ' ];
	commonItems.forEach((item) => item && string.push(`${item.title}, `));
	uncommonItems.forEach((item) => item && string.push(`${item.title}, `));
	if (string.length === 1) return 'disable';
	return string.reduce((a, b) => a + b);
};

export const utilRandomNumber = (to: number, from: number = 0): number => {
	if (from === 0) {
		let n = Math.floor(Math.random() * (to + 1));
		console.log(n);
		return n;
	} else {
		return Math.floor(Math.random() * (to - from + 1)) + from;
	}
};

export const getUtilRandomNumberProps = (type: AllItemTypeNames): [number, number] => {
	switch (type) {
		case 'common':
			return [ 20, 10 ];

		case 'uncommon':
			return [ 10, 0 ];
		default:
			throw new Error(`${type} is not a valid item type`);
			break;
	}
};
