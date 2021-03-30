import { Tag, AllTypes } from '../types/Tags-Types';
import { shelterIsBuilt, winWithRaftChecker } from './actionCheckers';
import funcs, { ActionFuncs as Func } from './actionFuncs';
import Stage from './stage';
import { ActionTitle, ActionMethods, ActionType } from '../types/Action';
import { TimeOfDay } from '../types/Stage';
import { utilDailyMaximum } from './utils';
import Player from './player';


class Action {
	title: ActionTitle;
	description: string;
	funcs?: Func;
	forTags: Tag[];
	forTypes: AllTypes[];
	forTime: (TimeOfDay | 'all')[];
	type: ActionType[];
	repeats: number;
	delayed: boolean;
	dailyLimit: { current: number; initial: number };

	constructor(props: Props) {
		const { title, description, forTags, forTypes, funcs, type, repeats, forTime, dailyLimit } = props;
		this.title = title;
		this.description = description;
		this.forTags = forTags;
		this.forTypes = forTypes;
		this.funcs = funcs;
		this.type = type;
		this.repeats = repeats;
		this.delayed = false;
		this.forTime = forTime;
		this.dailyLimit = dailyLimit;
	}

	getActionFuncs(action: Action | DelayedAction) {
		const actionFuncs = funcs.filter((funcs) => funcs.forAction === action.title)[0];
		if (!actionFuncs) throw new Error(`no action funcs for this action ${action.title}`);
		actionFuncs.props.action = action;
		this.funcs = actionFuncs;
	}

	runUtils(stage: Stage, player: Player) {
		this.repeats -= 1;
		if (this.dailyLimit.current > 0) {
			this.dailyLimit.current -= 1;
		}
		if (!this.type.includes('skip')) {
			player.increaseHunger(10)
			stage.moveTime(this);

		}else {
			this.type = this.type.filter((t) => t !== 'skip')
		}
		Stage.updateAllActions(this, stage);
		stage.removeLocationText()
		stage.setWaitingList();
		stage.locationGetAction();

		
	}
	saveRepeats() {
		this.repeats += 1;
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
	repeats: Infinity,
	forTime: [ 'all' ],
	dailyLimit: utilDailyMaximum(Infinity)
});
const goBackward = Action.generate({
	title: 'go backward',
	description: 'move to the previous location',
	forTags: [ 'explore' ],
	forTypes: [ 'all' ],
	type: [ 'dynamic' ],
	repeats: Infinity,
	forTime: [ 'all' ],
	dailyLimit: utilDailyMaximum(Infinity)
});
const buildShelter = Action.generate({
	title: 'build a shelter',
	description: 'build a shelter, which slighly protects you from threats',
	forTags: [ 'all' ],
	forTypes: [ 'large' ],
	type: [ 'static', 'timing', 'build' ],
	repeats: 1,
	forTime: [ 'morning', 'afternoon', 'evening' ],
	dailyLimit: utilDailyMaximum(Infinity)
});
const buildRaft = Action.generate({
	title: 'build raft',
	description: 'build a raft, which is used to escape from an island',
	forTags: [ 'coastal' ],
	forTypes: [ 'win condition' ],
	type: [ 'static', 'timing', 'build' ],
	repeats: 1,
	forTime: [ 'morning', 'afternoon', 'evening' ],
	dailyLimit: utilDailyMaximum(Infinity)
});

const winWithRaft = DelayedAction.generate({
	title: 'win with a raft',
	description: "player built a raft and now needs to escape on it, don't forget to gather resources!",
	forTags: [ 'coastal' ],
	forTypes: [ 'win condition' ],
	type: [ 'static', 'timing' ],
	repeats: 1,
	waitFor: [ 'build raft' ],
	checker: winWithRaftChecker,
	forTime: [ 'all' ],
	dailyLimit: utilDailyMaximum(Infinity)
});

const collectItems = Action.generate({
	title: 'collect items',
	description: 'function created to perform the collection of common items in the area',
	forTags: [ 'all' ],
	forTypes: [ 'all' ],
	type: [ 'static', 'timing' ],
	repeats: Infinity,
	forTime: [ 'morning', 'afternoon' ],
	dailyLimit: utilDailyMaximum(2)
});

const sleep = DelayedAction.generate({
	title: 'sleep',
	description: 'skip every time of the dey to get to morning',
	forTags: [ 'all' ],
	forTypes: [ 'shelter' ],
	type: [ 'static' ],
	repeats: Infinity,
	waitFor: [ 'build a shelter' ],
	checker: shelterIsBuilt,
	forTime: [ 'all' ],
	dailyLimit: utilDailyMaximum(Infinity)
});
const waitNightOver = Action.generate({
	title: 'wait night over',
	description: 'allows the player to live through nigth time, with no sleeping benefits',
	forTags: [ 'all' ],
	forTypes: [ 'all' ],
	type: [ 'static', 'timing' ],
	repeats: Infinity,
	forTime: [ 'night' ],
	dailyLimit: utilDailyMaximum(Infinity)
});

const skipTime = Action.generate({
title: 'skip time',
description: 'skips one daily stage',
forTags: [ 'all' ],
forTypes: [ 'all' ],
type: [ 'static', 'timing' ],
repeats: Infinity,
forTime: [ 'morning', 'evening', 'afternoon' ],
dailyLimit: utilDailyMaximum(Infinity)
});

const actionList: (Action | DelayedAction)[] = [
	goForward,
	goBackward,
	buildShelter,
	buildRaft,
	winWithRaft,
	collectItems,
	sleep,
	waitNightOver,
	skipTime
];
export default actionList;
export { Action, DelayedAction };

type Props = Omit<Action, ActionMethods>;
