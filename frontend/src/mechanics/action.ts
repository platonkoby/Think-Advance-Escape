// import actions from './actions.json';
// import { LocationInterface, Climate } from './level';
import { LocationType, Tag } from './location';
import funcs, { ActionFuncs as Func } from './actionFuncs';
import Player from './player';

type ActionMethods = 'runUtils';

class Action {
	title: string;
	description: string;
	forTags: Tag[];
	forTypes: LocationType[];
	func: Func;
	type: ('dynamic' | 'static' | 'wait')[];
	repeats: number;

	constructor(props: Omit<Action, ActionMethods>) {
		const { title, description, forTags, forTypes, func, type, repeats } = props;
		this.title = title;
		this.description = description;
		this.forTags = forTags;
		this.forTypes = forTypes;
		this.func = func;
		this.type = type;
		this.repeats = repeats;
	}

	runUtils() {
		this.repeats = this.repeats - 1;
	}
	static generate(props: Omit<Action, ActionMethods>) {
		const action = new Action(props);
		return action;
	}
}

// const buildShelter = new Action('build shelter', 'Build a shelter', [], [ 'large' ]);
const goForward = Action.generate({
	title: 'go forward',
	description: 'move to the next location',
	forTags: [ 'explore' ],
	forTypes: [ 'all' ],
	func: funcs.goForwardFuncs,
	type: [ 'dynamic' ],
	repeats: Infinity
});
const goBackward = Action.generate({
	title: 'move to',
	description: 'move to the previous location',
	forTags: [ 'explore' ],
	forTypes: [ 'all' ],
	func: funcs.goBackwardFuncs,
	type: [ 'dynamic' ],
	repeats: Infinity
});
const buildShelter = Action.generate({
	title: 'build a shleter',
	description: 'build a shelter, which slighly protects you from threats',
	forTags: [ 'all' ],
	forTypes: [ 'large' ],
	func: funcs.buildShelterFuncs,
	type: [ 'static' ],
	repeats: 1
});
const buildRaft = Action.generate({
	title: 'build an escape raft',
	description: 'build a raft, which is used to escape from an island',
	forTags: [ 'coastal' ],
	forTypes: [ 'win condition' ],
	func: funcs.buildRaftFuncs,
	type: [ 'static' ],
	repeats: 1
});

const winWithRaft = Action.generate({
	title: 'win with a raft',
	description: "player built a raft and now needs to escape on it, don't forget to gather resources!",
	forTags: [ 'coastal' ],
	forTypes: [ 'win condition' ],
	func: funcs.winWithRaftFuncs,
	type: [ 'static', 'wait' ],
	repeats: 1
});

const actionList: Action[] = [ goForward, goBackward, buildShelter, buildRaft, winWithRaft ];
const waitActionList: Action[] = actionList.filter((action) => (action.type.includes('wait') ? true : false));
console.log(waitActionList);
export default actionList;
export { Action };
