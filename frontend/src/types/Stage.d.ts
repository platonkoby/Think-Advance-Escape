import { Action, DelayedAction } from '../mechanics/action';

export type StageMethods =
	| 'move'
	| 'actionChecker'
	| 'locationGetAction'
	| 'updateAllActions'
	| 'advance'
	| 'moveTime'
	| 'setWaitingList'
	| 'resetDailyActions'
	| 'removeLocationText';


export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export interface StageActions {
	initialActions: (Action | DelayedAction)[];
	delayedActions: DelayedAction[];
	waitingActions: (Action | DelayedAction)[];
}
