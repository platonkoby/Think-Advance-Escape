export type ActionMethods = 'runUtils' | 'delayed' | 'getActionFuncs' | 'saveRepeats';

export type ActionType = 'dynamic' | 'static' | 'timing' | 'build' | 'skip';

export type ActionTitle =
	| 'go forward'
	| 'collect items'
	| 'win with a raft'
	| 'build raft'
	| 'build a shelter'
	| 'go backward'
	| 'sleep'
	| 'wait night over'
	| 'skip time';
