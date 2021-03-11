// ignore this type, it is utility
export type ActionMethods = 'runUtils' | 'delayed';
// a type for action.type, for more info, read note Action
export type ActionType = 'dynamic' | 'static';
// a type for action.title, for more info, read note Action
export type ActionTitle =
	| 'go forward'
	| 'collect common items'
	| 'win with a raft'
	| 'build raft'
	| 'build a shleter'
	| 'go backward';
