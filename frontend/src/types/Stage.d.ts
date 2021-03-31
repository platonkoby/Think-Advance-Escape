import { Action, DelayedAction } from '../mechanics/action';
import { ConstructionTitle } from './Constructions';

export type StageMethods =
	| 'move'
	| 'actionChecker'
	| 'locationGetAction'
	| 'updateAllActions'
	| 'advance'
	| 'moveTime'
	| 'setWaitingList'
	| 'resetDailyActions'
	| 'removeLocationText'
	| 'addActionLayer';


export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export interface StageActions {
	initialActions: (Action | DelayedAction)[];
	delayedActions: DelayedAction[];
	waitingActions: (Action | DelayedAction)[];
}

export interface StageActionLayers {
	actionLayerList: ActionLayer[];
	currentLayer: 'main' | ConstructionTitle;
}

export type ActionLayer = ('main' | ConstructionTitle);