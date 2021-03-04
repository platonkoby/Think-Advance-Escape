import { Action } from './action';
import actionList from './action';

const winCon: 'win condition' = 'win condition';
const initLoc: 'initial location' = 'initial location';

export type Tag =
	| 'explore'
	| 'rough terrain'
	| 'enclosed'
	| 'dark'
	| 'high'
	| 'high vegetation'
	| 'humid'
	| 'coastal'
	| 'all';
export type LocationType = 'large' | 'medium' | 'small' | 'win condition' | 'initial location' | 'all';
export type OneLoc = LocWC | LocSmall | LocLarge | LocMedium;
export type GameMap = 'desserted island';
export type AllLoc = OneLoc | LocWC | LocInit;

interface Loc {
	title: string;
	type: LocationType | [LocationType, LocationType];
	description: string;
	tags: Tag[];
	fixed: boolean;
	initial?: boolean;
	text?: string;
	actions: Action[];
}

interface LocLarge extends Loc {
	type: 'large';
	fixed: false;
}
interface LocMedium extends Loc {
	type: 'medium';
	fixed: false;
}
interface LocSmall extends Loc {
	type: 'small';
	fixed: false;
}
export interface LocWC extends Loc {
	type: 'win condition' | ['win condition', 'initial location'];
	fixed: true;
	for: GameMap;
}
export interface LocInit extends Loc {
	type: 'initial location' | ['win condition', 'initial location'];
	fixed: true;
	initial: true;
	for: GameMap;
	text: string;
}

let beach: LocInit & LocWC = {
	title: 'beach',
	description: 'The place where you woke up, the place where you recieve your initial items',
	type: [ 'win condition', 'initial location' ],
	tags: [ 'explore', 'coastal' ],
	fixed: true,
	actions: [],
	initial: true,
	for: 'desserted island',
	text:
		'You were woken up by morning sunlight. Feeling the sand in your mouth and uncomfortable wet clothes wrapping you exhausted body, you stand up to look around. You see somekind of rainforest in front of you. '
};

let cave: LocMedium = {
	title: 'cave',
	description:
		'A deep 4 ED cave, which holds immense amount of stone, metal and even treasures. Be wary, caves have a rough landscape, the dangeour of which is enhanced by potential humid environment. Getting stuck there with broken bones surrounded by various cave beasts is not fun!',
	type: 'medium',
	tags: [ 'explore', 'rough terrain', 'dark' ],
	actions: [],
	fixed: false
};

let rockyHills: LocMedium = {
	title: 'rocky hills',
	description:
		'Relatively big hills, covered by rocks of different types and sizes. 2 ED location, which is very dangerous during rain or in humid environments. Interesting fact: venoumouse snakes love to live inbetween rocks!',
	type: 'medium',
	tags: [ 'explore', 'rough terrain', 'high' ],
	fixed: false,
	actions: []
};

let jungle: LocLarge = {
	title: 'jungle',
	description:
		'Very humid environment, a natural habitat for various types of animals. Humid, warm environment is perfect for vegetation, which can be your best friend or your worst enemy!',
	type: 'large',
	tags: [ 'explore', 'humid', 'high vegetation' ],
	actions: [],
	initial: false,
	fixed: false
};

let whiteSands: LocSmall = {
	title: 'white sands',
	description: 'a small sandy beach inbetween cliffs, a great place to relax, sun bath and... Hide treasures?',
	type: 'small',
	tags: [ 'explore', 'coastal' ],
	actions: [],
	fixed: false
};

const locations = [ cave, rockyHills, jungle, whiteSands, beach ];
locations.forEach((location) => {
	const candidateActions: Action[] = [];
	actionList.forEach((action) => {
		action.forTags.forEach((tag) => {
			if (tag === 'all') {
				candidateActions.push(action);
			} else if (location.tags.includes(tag)) {
				candidateActions.push(action);
			}
		});
	});
	candidateActions.forEach((action) => {
		action.forTypes.forEach((type) => {
			if (type === 'all') {
				location.actions.push(action);
			} else if (typeof location.type === 'object') {
				if (location.type.includes(<'win condition' | 'initial location'>type)) {
					location.actions.push(action);
				}
			} else if (location.type === type) {
				location.actions.push(action);
			}
		});
	});
});

const nonFixedLocations: (LocSmall | LocLarge | LocMedium)[] = getNonFixedLocations();
const initialLocations: LocInit[] = getInitialLocations();
const winConditionLocations: LocWC[] = getWCLocations();

export { nonFixedLocations, initialLocations, winConditionLocations, locations };

function getNonFixedLocations(): (LocSmall | LocMedium | LocLarge)[] {
	const nonFixedLocs = <(LocSmall | LocMedium | LocLarge)[]>locations.filter((location) => location.fixed === false);
	return nonFixedLocs;
}
function getInitialLocations(): LocInit[] {
	const initialLocs = utilityLocationSearch(true, initLoc);

	if (initialLocs.length < 1) throw new Error('utilityLocationSearch is written wrong or no inital location defined');

	return <LocInit[]>initialLocs;
}
function getWCLocations(): LocWC[] {
	const wcLocs = utilityLocationSearch(true, winCon);

	if (wcLocs.length < 1) throw new Error('utilityLocationSearch is written wrong or no WC defined');

	return <LocWC[]>wcLocs;
}
function utilityLocationSearch(fixed: boolean, type: LocationType) {
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
