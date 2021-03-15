import { MapLocations } from '../types/Maps';
import { ActionFuncs } from './actionFuncs';
import { getNeighbour, utilItemComparisonProps } from '../types/Utils';
import { AllItemTypeNames } from '../types/Items';
import { Action } from './action';
import Player from './player';
import { Construction } from '../data/constructions';


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
	let stringArr: string[] = [];
	let string: string = 'Collect - ';
	commonItems.forEach((item) => item && stringArr.push(`${item.title}`));
	uncommonItems.forEach((item) => item && stringArr.push(`${item.title}`));
	if (stringArr.length === 0) return 'disable';
	string = string.concat(stringArr.join(', '));
	return string;
};

export const utilRandomNumber = (to: number, from: number = 0): number => {
	if (from === 0) {
		let n = Math.floor(Math.random() * (to + 1));
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

export const utilDailyMaximum = (n: number): Action['dailyLimit'] => {
	return { current: n, initial: n };
};
export const utilShuffleArray = (arr: any[]): any[] => {
	const shuffledArr: any[] = [];
	let i = 0;
	let check = 0;
	recursive();
	return shuffledArr;

	function recursive() {
		check++;
		if (check > 2000) throw new Error('Infinite Loop');
		if (shuffledArr.length < arr.length) {
			do {
				if (check > 2000) throw new Error('Infinite Loop, do while');
				check++;
				i = utilRandomNumber(arr.length - 1);
			} while (shuffledArr.includes(arr[i]));
			shuffledArr.push(arr[i]);
			recursive();
		}
		return;
	}
};

export const utilItemComparison = (got: Player['items'], needed: Construction['requirements']) => {
	if(!needed) throw new Error()
	
	const check: utilItemComparisonProps  = needed.map((item) => {
		const currentItem = got.find((playerItem) => item.title === playerItem.title);
		//returns if user doesn't have the needed item
		if (!currentItem) return [false, {}, { title: item.title, amount: item.amount, type: item.type } ];
		//returns if user doesn't have enough of the needed item
		if (currentItem.amount - item.amount < 0) {
			return [
				false,
				{},
				{ title: item.title, amount: item.amount - currentItem.amount, type: item.type  }
			];
		}
		//returns if user has the right amount of the right item
		return [
			true,
			{ title: currentItem.title, amount: 0 - item.amount, type: currentItem.type  },
			{ title: item.title, amount: 0, type: item.type  }
		];
	});
	return check;
};
