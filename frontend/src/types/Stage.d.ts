export type StageMethods = 'move' | 'actionChecker' | 'locationGetAction' | 'updateAllActions';
export type Optional<T> = { [P in keyof T]?: T[P] };
