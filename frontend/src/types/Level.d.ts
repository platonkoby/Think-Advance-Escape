import { Action, DelayedAction } from '../mechanics/action';

// level.allActions and stage.allActions read Level and Stag,e
export interface AllAction {
	initialActions: (Action | DelayedAction)[];
	delayedActions: DelayedAction[];
}
// ignore this type, it is utility
export type LevelMethods = '';
