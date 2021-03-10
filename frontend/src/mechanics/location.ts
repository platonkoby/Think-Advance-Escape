import { Action } from './action';
import actionList from './action';
import {
	LocInit,
	LocWC,
	LocLarge,
	LocSmall,
	LocMedium,
	LocationType,
	AllLocations,
	AllLoc,
	LocationCollectionProps,
	LocationTitle
} from '../types/locationTypes';
import commonItems from '../data/commonItems';
import uncommonItems from '../data/uncommonItems';
import { dessertedIsland, GameMap } from '../types/Maps';

const winCon: 'win condition' = 'win condition';
const initLoc: 'initial location' = 'initial location';

let beach: LocInit & LocWC = {
	title: 'beach',
	description: 'The place where you woke up, the place where you recieve your initial items',
	type: [ 'win condition', 'initial location' ],
	tags: [ 'explore', 'coastal' ],
	fixed: true,
	actions: [],
	initial: true,
	for: dessertedIsland,
	text:
		'You were woken up by morning sunlight. Feeling the sand in your mouth and uncomfortable wet clothes wrapping you exhausted body, you stand up to look around. You see somekind of rainforest in front of you. ',
	items: { commonItems: commonItems.beach, uncommonItems: uncommonItems.beach }
};

let cave: LocMedium = {
	title: 'cave',
	description:
		'A deep 4 ED cave, which holds immense amount of stone, metal and even treasures. Be wary, caves have a rough landscape, the dangeour of which is enhanced by potential humid environment. Getting stuck there with broken bones surrounded by various cave beasts is not fun!',
	type: 'medium',
	tags: [ 'explore', 'rough terrain', 'dark' ],
	actions: [],
	fixed: false,
	items: { commonItems: commonItems.cave, uncommonItems: uncommonItems.cave }
};

let rockyHills: LocMedium = {
	title: 'rocky hills',
	description:
		'Relatively big hills, covered by rocks of different types and sizes. 2 ED location, which is very dangerous during rain or in humid environments. Interesting fact: venoumouse snakes love to live inbetween rocks!',
	type: 'medium',
	tags: [ 'explore', 'rough terrain', 'high' ],
	fixed: false,
	actions: [],
	items: { commonItems: commonItems.rockyHills, uncommonItems: uncommonItems.rockyHills }
};

let jungle: LocLarge = {
	title: 'jungle',
	description:
		'Very humid environment, a natural habitat for various types of animals. Humid, warm environment is perfect for vegetation, which can be your best friend or your worst enemy!',
	type: 'large',
	tags: [ 'explore', 'humid', 'high vegetation' ],
	actions: [],
	initial: false,
	fixed: false,
	items: { commonItems: commonItems.jungle, uncommonItems: uncommonItems.jungle }
};

let whiteSands: LocSmall = {
	title: 'white sands',
	description: 'a small sandy beach inbetween cliffs, a great place to relax, sun bath and... Hide treasures?',
	type: 'small',
	tags: [ 'explore', 'coastal' ],
	actions: [],
	fixed: false,
	items: { commonItems: commonItems.whiteSands, uncommonItems: uncommonItems.whiteSands }
};
let test: LocSmall = {
	title: 'test',
	description: 'test',
	type: 'small',
	tags: [ 'dark' ],
	actions: [],
	fixed: false,
	items: { commonItems: commonItems.test, uncommonItems: uncommonItems.test }
};

const locations = [ cave, rockyHills, jungle, whiteSands, beach, test ];

// function getNonFixedLocations(): (LocSmall | LocMedium | LocLarge)[] {
// 	const nonFixedLocs = <(LocSmall | LocMedium | LocLarge)[]>locations.filter((location) => location.fixed === false);
// 	return nonFixedLocs;
// }
// // function getInitialLocations(): LocInit[] {
// 	const initialLocs = utilityLocationSearch(true, initLoc);

// 	if (initialLocs.length < 1) throw new Error('utilityLocationSearch is written wrong or no inital location defined');

// 	return <LocInit[]>initialLocs;
// }
// function getWCLocations(): LocWC[] {
// 	const wcLocs = utilityLocationSearch(true, winCon);

// 	if (wcLocs.length < 1) throw new Error('utilityLocationSearch is written wrong or no WC defined');

// 	return <LocWC[]>wcLocs;
// }
// function utilityLocationSearch(fixed: boolean, type: LocationType) {
// 	const askedLocs = locations.filter((location) => {
// 		if (location.fixed === fixed) {
// 			if (Array.isArray(location.type)) {
// 				const types = location.type;
// 				if (type === winCon || (type === initLoc && types.indexOf(type) > -1)) return true;
// 			} else if (location.type === type) {
// 				return true;
// 			} else {
// 				return false;
// 			}
// 		} else {
// 			return false;
// 		}
// 	});
// 	return askedLocs;
// }

class LocationsCollection {
	all: AllLoc[];
	initialLocation?: LocInit;
	winConditionLocations?: LocWC[];
	nonFixedLocations?: (LocSmall | LocLarge | LocMedium)[];
	constructor({ all }: LocationCollectionProps) {
		this.all = all;
	}

	setInitialLocations(locations: AllLoc[] = this.all) {
		const initialLocs = LocationsCollection.utilityLocationSearch(true, initLoc, locations);
		if (initialLocs.length < 1)
			throw new Error('utilityLocationSearch is written wrong or no inital location defined');

		this.initialLocation = <LocInit>initialLocs[0];
	}

	setWCLocations(locations: AllLoc[] = this.all) {
		const wcLocs = LocationsCollection.utilityLocationSearch(true, winCon, locations);

		if (wcLocs.length < 1) throw new Error('utilityLocationSearch is written wrong or no WC defined');
		this.winConditionLocations = <LocWC[]>wcLocs;
	}

	setNonFixedLocations(locations: AllLoc[] = this.all) {
		const nonFixed = <(LocSmall | LocMedium | LocLarge)[]>locations.filter((location) => location.fixed === false);
		if (nonFixed.length < 1) throw new Error();
		this.nonFixedLocations = nonFixed;
	}

	static setMapLocations(map: GameMap, all: AllLocations['all']) {
		const { title, locations } = map;
		//@ts-ignore
		return all.filter((location) => locations.includes(location.title));
	}

	static utilityLocationSearch(fixed: boolean, type: LocationType, locations: AllLoc[]) {
		const askedLocs = locations.filter((location) => {
			if (location.fixed === fixed) {
				if (Array.isArray(location.type)) {
					const types = location.type;
					if (type === winCon || (type === initLoc && types.indexOf(type) > -1)) return true;
				} else if (location.type === type) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		});
		return askedLocs;
	}

	static generate(map: GameMap, all: AllLocations['all'] = locations) {
		all = LocationsCollection.setMapLocations(map, all);
		const collection = new LocationsCollection({ all });
		collection.setInitialLocations();
		collection.setNonFixedLocations();
		collection.setWCLocations();
		console.log(collection);
		return collection;
	}
}

export default LocationsCollection;
