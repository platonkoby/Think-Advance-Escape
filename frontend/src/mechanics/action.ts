import { LocationType, Tag } from '../types/LocationTypes';
import { winWithRaftChecker } from './actionCheckers';
import funcs, { ActionFuncs as Func } from './actionFuncs';
import Stage from './stage';
import { ActionTitle, ActionMethods, ActionType } from '../types/Action';

class Action {
	title: ActionTitle;
	description: string;
	forTags: Tag[];
	forTypes: LocationType[];
	func: Func;
	type: ActionType[];
	repeats: number;
	delayed: boolean;

	constructor(props: Omit<Action, ActionMethods>) {
		const { title, description, forTags, forTypes, func, type, repeats } = props;
		this.title = title;
		this.description = description;
		this.forTags = forTags;
		this.forTypes = forTypes;
		this.func = func;
		this.type = type;
		this.repeats = repeats;
		this.delayed = false;
	}

	runUtils(stage: Stage) {
		this.repeats = this.repeats - 1;
		stage.updateAllActions(this);
	}
}
class DelayedAction extends Action {
	waitFor: Action['title'][];
	checker: (stage: Stage) => boolean;
	constructor(props: Omit<DelayedAction, ActionMethods>) {
		super(props);
		this.waitFor = props.waitFor;
		this.delayed = true;
		this.checker = props.checker;
	}
}

const goForward = new Action({
	title: 'go forward',
	description: 'move to the next location',
	forTags: [ 'explore' ],
	forTypes: [ 'all' ],
	func: funcs.goForwardFuncs,
	type: [ 'dynamic' ],
	repeats: Infinity
});
const goBackward = new Action({
	title: 'go backward',
	description: 'move to the previous location',
	forTags: [ 'explore' ],
	forTypes: [ 'all' ],
	func: funcs.goBackwardFuncs,
	type: [ 'dynamic' ],
	repeats: Infinity
});
const buildShelter = new Action({
	title: 'build a shleter',
	description: 'build a shelter, which slighly protects you from threats',
	forTags: [ 'all' ],
	forTypes: [ 'large' ],
	func: funcs.buildShelterFuncs,
	type: [ 'static' ],
	repeats: 1
});
const buildRaft = new Action({
	title: 'build raft',
	description: 'build a raft, which is used to escape from an island',
	forTags: [ 'coastal' ],
	forTypes: [ 'win condition' ],
	func: funcs.buildRaftFuncs,
	type: [ 'static' ],
	repeats: 1
});

const winWithRaft = new DelayedAction({
	title: 'win with a raft',
	description: "player built a raft and now needs to escape on it, don't forget to gather resources!",
	forTags: [ 'coastal' ],
	forTypes: [ 'win condition' ],
	func: funcs.winWithRaftFuncs,
	type: [ 'static' ],
	repeats: 1,
	waitFor: [ 'build raft' ],
	checker: winWithRaftChecker
});

const collectItems = new Action({
	title: 'collect common items',
	description: 'function created to perform the collection of common items in the area',
	forTags: [ 'all' ],
	forTypes: [ 'all' ],
	func: funcs.collectItemsFuncs,
	type: [ 'static' ],
	repeats: Infinity
});

const actionList: Action[] = [ goForward, goBackward, buildShelter, buildRaft, winWithRaft, collectItems ];
export default actionList;
export { Action, DelayedAction };
