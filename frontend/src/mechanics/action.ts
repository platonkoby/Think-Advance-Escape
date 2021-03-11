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
	funcs?: Func;
	type: ActionType[];
	repeats: number;
	delayed: boolean;

	constructor(props: Props) {
		const { title, description, forTags, forTypes, funcs, type, repeats } = props;
		this.title = title;
		this.description = description;
		this.forTags = forTags;
		this.forTypes = forTypes;
		this.funcs = funcs;
		this.type = type;
		this.repeats = repeats;
		this.delayed = false;
	}

	getActionFuncs(action: Action | DelayedAction) {
		const actionFuncs = funcs.filter((funcs) => funcs.forAction === action.title)[0];
		if (!actionFuncs) throw new Error('no action funcs for this action');
		actionFuncs.props.action = action;
		this.funcs = actionFuncs;
	}

	runUtils(stage: Stage) {
		this.repeats = this.repeats - 1;

		Stage.updateAllActions(this, stage);

		stage.locationGetAction();
	}

	static generate(props: Props) {
		const newAction = new Action(props);

		newAction.getActionFuncs(newAction);
		return newAction;
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
	static generate(props: Omit<DelayedAction, ActionMethods>) {
		const newAction = new DelayedAction(props);

		newAction.getActionFuncs(newAction);
		return newAction;
	}
}

const goForward = Action.generate({
	title: 'go forward',
	description: 'move to the next location',
	forTags: [ 'explore' ],
	forTypes: [ 'all' ],
	type: [ 'dynamic' ],
	repeats: Infinity
});
const goBackward = Action.generate({
	title: 'go backward',
	description: 'move to the previous location',
	forTags: [ 'explore' ],
	forTypes: [ 'all' ],
	type: [ 'dynamic' ],
	repeats: Infinity
});
const buildShelter = Action.generate({
	title: 'build a shleter',
	description: 'build a shelter, which slighly protects you from threats',
	forTags: [ 'all' ],
	forTypes: [ 'large' ],
	type: [ 'static' ],
	repeats: 1
});
const buildRaft = Action.generate({
	title: 'build raft',
	description: 'build a raft, which is used to escape from an island',
	forTags: [ 'coastal' ],
	forTypes: [ 'win condition' ],
	type: [ 'static' ],
	repeats: 1
});

const winWithRaft = DelayedAction.generate({
	title: 'win with a raft',
	description: "player built a raft and now needs to escape on it, don't forget to gather resources!",
	forTags: [ 'coastal' ],
	forTypes: [ 'win condition' ],
	type: [ 'static' ],
	repeats: 1,
	waitFor: [ 'build raft' ],
	checker: winWithRaftChecker
});

const collectItems = Action.generate({
	title: 'collect items',
	description: 'function created to perform the collection of common items in the area',
	forTags: [ 'all' ],
	forTypes: [ 'all' ],
	type: [ 'static' ],
	repeats: Infinity
});

const actionList: Action[] = [ goForward, goBackward, buildShelter, buildRaft, winWithRaft, collectItems ];
export default actionList;
export { Action, DelayedAction };

type Props = Omit<Action, ActionMethods>;
