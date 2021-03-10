import LocationsCollection from './location';
import {
	LocInit,
	LocWC,
	OneLoc,
	AllLoc,
	LocationTitle,
	AllLocations,
	LocationCollectionProps,
	Tag
} from '../types/locationTypes';
import constructionsData, { Construction } from '../data/constructions';
import { MapLocations, GameMap, dessertedIsland } from '../types/Maps';
import actionList, { Action, DelayedAction } from './action';

export interface AllAction {
	initialActions: (Action | DelayedAction)[];
	delayedActions: DelayedAction[];
}

type LevelMethods = '';
type Props = Omit<Level, LevelMethods>;
class Level {
	map: GameMap;
	allLocations: LocationCollectionProps;
	graph: Map<number, MapLocations>;
	constructions: Construction[];
	tags: Tag[];
	allActions: AllAction;

	constructor({ map, graph, constructions, allLocations, tags, allActions }: Props) {
		this.map = map;
		this.allLocations = allLocations;
		this.graph = graph;
		this.constructions = constructions;
		this.tags = tags;
		this.allActions = allActions;
	}
	// createActions(player?: Player): void {
	// 	this.actions = actionListGenerator(this.climate, this.locations, player);
	// }

	static generate(map: GameMap = dessertedIsland, actions: Action[] = actionList): Level {
		const allLocations = LocationsCollection.generate(map);
		const { all, winConditionLocations, nonFixedLocations, initialLocation } = allLocations;
		if (!winConditionLocations || !nonFixedLocations || !initialLocation) throw new Error();
		// const locations: AllLoc[] = selectLocations(map, all);
		const constructions: Construction[] = getConstructions(map, all);
		const graph: Map<number, MapLocations> = generateGraph(
			winConditionLocations,
			randomiseLocations(nonFixedLocations),
			initialLocation
		);
		const tags = getAllTags(all);
		const allActions = getAllActions(tags, actions);
		const level = new Level({ map, allLocations, graph, constructions, tags, allActions });

		return level;
	}
}

function randomiseLocations(nonFixedLocations: LocationsCollection['nonFixedLocations']): OneLoc[] {
	const chosenLocations: OneLoc[] = [];
	if (!nonFixedLocations) throw new Error();
	recursive(nonFixedLocations.length - chosenLocations.length);

	return chosenLocations;

	function recursive(n: number) {
		let location;
		let i = 0;
		if (!nonFixedLocations) throw new Error();
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

function getInitialLocation(map: GameMap, allLocations: AllLocations): LocInit {
	const location = allLocations.initialLocations.find((location: LocInit) => location.for === map);
	if (location === undefined) throw new Error(`No Initial Location for ${map}`);
	return location;
}

function getWinConditionLocations(map: GameMap, winConditionLocations: AllLocations['winConditionLocations']): LocWC[] {
	const locations = winConditionLocations.filter((location) => location.for === map);
	if (locations.length < 1) throw new Error(`No Initial Location for ${map}`);
	return locations;
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

function getConstructions(map: GameMap, locations: AllLoc[]): Construction[] {
	const locationTitles: (LocationTitle | 'all')[] = locations.map((location) => location.title);
	locationTitles.push('all');
	const constructions = constructionsData.filter((item) => {
		let locations = item.forLocations.map((location) => locationTitles.includes(location));
		return locations.includes(true) ? true : false;
	});
	return constructions;
}

function selectLocations(map: GameMap, locations: AllLoc[]): AllLoc[] {
	console.log(map);
	console.log(locations);
	return locations;
}
function getAllTags(locations: AllLoc[]): Tag[] {
	const starterTags = locations.map((loc) => loc.tags).flat(Infinity);
	const tagsSet = new Set(starterTags);
	const tags: Tag[] = [];

	tagsSet.forEach((tag) => tags.push(<Tag>tag));
	return tags;
}
function getAllActions(tags: Tag[], actions: (Action | DelayedAction)[]) {
	actions = actions.filter(filterFunc);
	const delayedActions = <DelayedAction[]>actions.filter((action) => action.delayed);
	const initialActions = <Action[]>actions.filter((action) => !action.delayed);

	return { delayedActions, initialActions };

	function filterFunc(action: Action): boolean {
		const boolArr = action.forTags.map((tag) => {
			return tags.includes(tag) || tag === 'all';
		});
		return boolArr.includes(true);
	}
}

export default Level;
