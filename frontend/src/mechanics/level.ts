import LocationsCollection from './location';
import { LocInit, LocWC, OneLoc, AllLoc, LocationTitle, LocationCollectionProps } from '../types/LocationTypes';
import { Tag, LocationTag } from '../types/Tags-Types'
import constructionsData, { Construction } from '../data/constructions';
import { MapLocations, GameMap } from '../types/Maps';
import actionList, { Action, DelayedAction } from './action';
import { dessertedIsland } from '../data/Maps';
import { LevelMethods, AllAction, FilterChain, RequirementsByUse } from '../types/Level';
import { AllItems} from '../types/Items';
import {  utilShuffleArray } from './utils';

class Level {
	map: GameMap; 
	allActions: AllAction;
	allLocations: LocationCollectionProps;
	allItems: AllItems;
	graph: Map<number, MapLocations>;
	constructions: Construction[];
	tags: LocationTag[];

	constructor(props: Props) {
		const { map, graph, constructions, allLocations, tags, allActions, allItems } = props;
		this.map = map;
		this.allLocations = allLocations;
		this.graph = graph;
		this.constructions = constructions;
		this.tags = tags;
		this.allActions = allActions;
		this.allItems = allItems;
	}

	static generate(map: GameMap = dessertedIsland, actions: Action[] = actionList): Level {
		const allLocations = LocationsCollection.generate(map);
		const { all, winConditionLocations, nonFixedLocations, initialLocation } = allLocations;
		const allItems = getAllItems(all);
		if (!winConditionLocations || !nonFixedLocations || !initialLocation) throw new Error();
		const constructions: Construction[] = getConstructions(map, all, allItems);
		const graph: Map<number, MapLocations> = generateGraph(
			winConditionLocations,
			randomiseLocations(nonFixedLocations, 4),
			initialLocation
		);
		const tags = getAllTags(all);
		const allActions = getAllActions(tags, actions);
		const level = new Level({ map, allLocations, graph, constructions, tags, allActions, allItems });

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
//right now getConstruction works only with construction which have only 1 type
function getConstructions(map: GameMap, locations: AllLoc[], items: AllItems): Construction[] {
	const locationTitles: (LocationTitle | 'all')[] = locations.map((location) => location.title);
	locationTitles.push('all');
	const constructions = constructionsData.filter(funelNeeded).map(getRequirements);

	return constructions;

	// returns the construction, which can be built on one of the locaitons
	function funelNeeded(item: Construction) {
		let locations = item.forLocations.map((location) => locationTitles.includes(location));
		return locations.includes(true) ? true : false;
	}
	// returns a construction, with requirements
	function getRequirements(constr: Construction): Construction {
		items = utilShuffleArray(items);
		let requirements: Construction['requirements'];
		if (constr.type.includes('shelter')) {
			const shelterReqProps: RequirementsByUse = {
				use: 'build',
				commonItems: { unique: 3, amount: 10 },
				uncommonItems: { unique: 1, amount: 3 }
			};
			requirements = requirementsByUse(shelterReqProps);
		} else if (constr.type.includes('raft')) {
			const escapeReqProps: RequirementsByUse = {
				use: 'build',
				commonItems: { unique: 3, amount: 10 },
				uncommonItems: { unique: 1, amount: 3 }
			};
			requirements = requirementsByUse(escapeReqProps);
		}

		if (!requirements) throw new Error(`update getRequirements in level, to use ${constr.type[0]}`);
		constr.requirements = requirements;
		return constr;

		function requirementsByUse({
			use,
			commonItems,
			uncommonItems
		}: RequirementsByUse): Construction['requirements'] {
			const { unique: commonUnique, amount: commonAmount } = commonItems;
			const { unique: uncommonUnique, amount: uncommonAmount } = uncommonItems;
			const commonFilterProps: FilterChain = {
				items,
				type: 'common',
				use,
				uniqueItemAmount: commonUnique,
				itemAmount: commonAmount
			};
			const uncommonFilterProps: FilterChain = {
				items,
				type: 'uncommon',
				use,
				uniqueItemAmount: uncommonUnique,
				itemAmount: uncommonAmount
			};
			return [...filterChain(commonFilterProps),
				...filterChain(uncommonFilterProps)]
		}

		function filterChain({ items, type, use, uniqueItemAmount, itemAmount }: FilterChain) {
			//filters by the type of the item
			return (
				items
					.filter((item) => item.type === type)
					//filters by the use of the item
					.filter((item) => item.uses.includes(use))
					//gets only the first 3 items of the list, they are always different, since list is shuffled
					.map((item, index) => (index < uniqueItemAmount ? item : null))
					//prev .map returned nulls, here nulls are removed
					.filter((item) => item)
					//adds the amount to item
					.map((item) => {
						if (!item)
							throw new Error('level => getConstructions => getRequirements => filter chain, is null');
						return {
							title: item.title,
							amount: itemAmount,
							type: item.type
						};
					})
			);
		}
	}
}

function getAllTags(locations: AllLoc[]): Tag[] {
	const starterTags = locations.map((loc) => loc.tags).flat(Infinity);
	const tagsSet = new Set(starterTags);
	const tags: Tag[] = [];

	tagsSet.forEach((tag) => tags.push(tag as Tag));
	return tags;
}
function getAllActions(tags: LocationTag[], actions: (Action | DelayedAction)[]) {
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

function getAllItems(locations: AllLoc[]): AllItems {
	const initialItems = locations
		.map((location) => {
			return [ ...location.items.commonItems, ...location.items.uncommonItems ];
		})
		.flat();
	const itemsSet = new Set(initialItems);

	const items: AllItems = [];
	itemsSet.forEach((item) => items.push(item));

	return items;
}

export default Level;

type Props = Omit<Level, LevelMethods>;
