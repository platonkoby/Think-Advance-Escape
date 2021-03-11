import LocationsCollection from './location';
import { LocInit, LocWC, OneLoc, AllLoc, LocationTitle, LocationCollectionProps, Tag } from '../types/LocationTypes';
import constructionsData, { Construction } from '../data/constructions';
import { MapLocations, GameMap } from '../types/Maps';
import actionList, { Action, DelayedAction } from './action';
import { dessertedIsland } from '../data/Maps';
import { LevelMethods, AllAction } from '../types/Level';

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

	static generate(map: GameMap = dessertedIsland, actions: Action[] = actionList): Level {
		const allLocations = LocationsCollection.generate(map);
		const { all, winConditionLocations, nonFixedLocations, initialLocation } = allLocations;
		if (!winConditionLocations || !nonFixedLocations || !initialLocation) throw new Error();
		const constructions: Construction[] = getConstructions(map, all);
		const graph: Map<number, MapLocations> = generateGraph(
			winConditionLocations,
			randomiseLocations(nonFixedLocations, 4),
			initialLocation
		);
		const tags = getAllTags(all);
		const allActions = getAllActions(tags, actions);
		const level = new Level({ map, allLocations, graph, constructions, tags, allActions });

		return level;
	}
}

function randomiseLocations(
	nonFixedLocations: LocationsCollection['nonFixedLocations'],
	locationNum: number
): OneLoc[] {
	if (!nonFixedLocations) throw new Error();
	if (locationNum > nonFixedLocations.length) throw new Error('not enough nonFixedLocations for this map');
	const chosenLocations: OneLoc[] = [];
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

		if (chosenLocations.length < locationNum) {
			recursive(n);
		}
	}
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

function getAllTags(locations: AllLoc[]): Tag[] {
	const starterTags = locations.map((loc) => loc.tags).flat(Infinity);
	const tagsSet = new Set(starterTags);
	const tags: Tag[] = [];

	tagsSet.forEach((tag) => tags.push(tag as Tag));
	return tags;
}
function getAllActions(tags: Tag[], actions: (Action | DelayedAction)[]) {
	actions = actions.filter(filterFunc);
	const delayedActions = actions.filter((action) => action.delayed) as DelayedAction[];
	const initialActions = actions.filter((action) => !action.delayed) as Action[];

	return { delayedActions, initialActions };

	function filterFunc(action: Action): boolean {
		const boolArr = action.forTags.map((tag) => {
			return tags.includes(tag) || tag === 'all';
		});
		return boolArr.includes(true);
	}
}

export default Level;

type Props = Omit<Level, LevelMethods>;
