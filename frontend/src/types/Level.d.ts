import { Action, DelayedAction } from '../mechanics/action';
import { ConstructionType } from './Constructions';
import { AllItems, ItemUse } from './Items';

export interface AllAction {
	initialActions: (Action | DelayedAction)[];
	delayedActions: DelayedAction[];
}

export type LevelMethods = '';

//props of filterChain function

export interface RequirementsByUse {
	use: FilterChain['use'];
	commonItems: {
		unique: FilterChain['uniqueItemAmount'];
		amount: FilterChain['itemAmount'];
	};
	uncommonItems: {
		unique: FilterChain['uniqueItemAmount'];
		amount: FilterChain['itemAmount'];
	};
}

export interface FilterChain {
	items: AllItems;
	type: AllItemTypeNames;
	use: ItemUse;
	uniqueItemAmount: number;
	itemAmount: number;
}
