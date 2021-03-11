import { Action, DelayedAction } from '../mechanics/action';

export interface AllAction {
	initialActions: (Action | DelayedAction)[];
	delayedActions: DelayedAction[];
}

export type LevelMethods = '';
