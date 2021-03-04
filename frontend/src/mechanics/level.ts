import Player from './player';
import actions, { Action } from './action';
import {
	initialLocations,
	winConditionLocations,
	nonFixedLocations,
	LocInit,
	LocWC,
	GameMap,
	OneLoc,
	AllLoc
} from './location';

class Level {
	map: GameMap;
	nonFixedLocs?: OneLoc[];
	initialLocation?: LocInit;
	winConditionLocs?: LocWC[];
	graph: Map<number, MapLocations>;

	constructor(
		map: GameMap,
		nonFixedLocs: OneLoc[],
		initialLocation: LocInit,
		winConditionLocs: LocWC[],
		graph: Map<number, MapLocations>
	) {
		this.map = map;
		this.nonFixedLocs = nonFixedLocs;
		this.initialLocation = initialLocation;
		this.winConditionLocs = winConditionLocs;
		this.graph = graph;
	}
	// createActions(player?: Player): void {
	// 	this.actions = actionListGenerator(this.climate, this.locations, player);
	// }

	static generate(map: GameMap): Level {
		const winConditionLocs: LocWC[] = getWinConditionLocations(map);
		const nonFixedLocs: OneLoc[] = randomiseLocations();
		const initialLocation: LocInit = getInitialLocation(map);
		const graph: Map<number, MapLocations> = generateGraph(winConditionLocs, nonFixedLocs, initialLocation);
		const level = new Level(map, nonFixedLocs, initialLocation, winConditionLocs, graph);

		return level;
	}
}

// export interface Climate {
// 	title: string;
// }

// function actionListGenerator(climate: Climate, locations: LocationInterface[], player?: Player): Action[] {
// 	let actionList: Action[] = actions.filter((action) => {
// 		let locationTitlesAction: string[] = action.forLocations
// 			.map((actLoc) => {
// 				return Object.values(actLoc);
// 			})
// 			.flat();
// 		let locationTitlesLevel: string[] = locations.map((location) => location.title);
// 		let locationTitlesActionFilterd = locationTitlesAction.filter(
// 			(location) => locationTitlesLevel.indexOf(location) > -1
// 		);
// 		if (locationTitlesActionFilterd.length > 0) {
// 			return true;
// 		}
// 		return false;
// 	});
// 	return actionList;
// }

function randomiseLocations(): OneLoc[] {
	const chosenLocations: OneLoc[] = [];
	recursive(nonFixedLocations.length - chosenLocations.length);

	return chosenLocations;

	function recursive(n: number) {
		let location;
		let i = 0;
		do {
			i++;
			if (i > 30) throw new Error();

			location = nonFixedLocations[Math.floor(Math.random() * n)];
		} while (chosenLocations.indexOf(location) !== -1);

		chosenLocations.push(location);

		if (chosenLocations.length < 4) {
			recursive(n);
		}
	}
}

function getInitialLocation(map: GameMap): LocInit {
	const location = initialLocations.find((location: LocInit) => location.for === map);
	if (location === undefined) throw new Error(`No Initial Location for ${map}`);
	return location;
}

function getWinConditionLocations(map: GameMap): LocWC[] {
	const locations = winConditionLocations.filter((location) => location.for === map);
	if (locations.length < 1) throw new Error(`No Initial Location for ${map}`);
	return locations;
}

export interface MapLocations {
	location: AllLoc;
	neighbours: AllLoc[];
}

function generateGraph(winConditions: LocWC[], nonFixed: OneLoc[], initialLoc: LocInit): Map<number, MapLocations> {
	const locations = new Set([ ...winConditions, ...nonFixed, initialLoc ]);
	let graphArr: number[] = [];
	let i: number = 0;
	locations.forEach(() => {
		i++;
		graphArr.push(i);
	});
	const graph: Map<number, MapLocations> = new Map();

	locations.forEach(assignValues);
	graph.forEach((loc, key) => {
		let graphFirstItem: MapLocations | undefined = graph.get(1);
		let graphLastItem: MapLocations | undefined = graph.get(i);
		let neighbourOne: MapLocations | undefined = graph.get(key - 1);
		let neighbourTwo: MapLocations | undefined = graph.get(key + 1);
		if (!graphFirstItem || !graphLastItem)
			throw new Error("Something is wrong with the graph's first and last items");
		if (!neighbourOne) neighbourOne = graphLastItem;
		if (!neighbourTwo) neighbourTwo = graphFirstItem;

		graph.set(key, { location: loc.location, neighbours: [ neighbourOne.location, neighbourTwo.location ] });
	});

	return graph;

	function assignValues(location: AllLoc) {
		const random: number = getNumber(graphArr.length, graph);
		graph.set(graphArr[random], { location, neighbours: [] });
		graphArr = graphArr.filter((x, index) => index !== random);
	}

	function getNumber(n: number, graph: Map<number, MapLocations>): number {
		const random = Math.floor(Math.random() * n);
		if (graphArr.length === 0) {
			return random;
		}
		if (graph.has(random)) {
			getNumber(n, graph);
		}
		return random;
	}
}

export default Level;
