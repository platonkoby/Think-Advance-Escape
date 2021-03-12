import Stage from './stage';
import { getGraphNeighbour, utilGetItemsString } from './utils';
import { FuncProps, ActionTitle, ActionFuncsMethods } from '../types/ActionFuncs';
import constructions from '../data/constructions';
import { DelayedAction, Action } from './action';

const [ shelter, raft ] = constructions;

const INITIAL_PROPS: FuncProps = {
	player: undefined,
	level: undefined,
	currentPos: undefined,
	stage: undefined,
	action: undefined
};

export class ActionFuncs {
	props: FuncProps;
	action: () => Stage;
	title: () => ActionTitle;
	forAction: Action['title'] | DelayedAction['title'];
	constructor({ props = INITIAL_PROPS, action, title, forAction }: Props) {
		this.props = props;
		this.action = action;
		this.title = title;
		this.forAction = forAction;
	}

	static generate(props: Props) {
		const action = new ActionFuncs(props);
		return action;
	}
}

const goForwardFuncs = ActionFuncs.generate({
	forAction: 'go forward',
	props: INITIAL_PROPS,
	action: () => {
		const { level, currentPos, stage, action } = goForwardFuncs.props;
		if (!level || !currentPos || !stage || !action) throw new Error();
		const currentLocation = getGraphNeighbour({ graph: level.graph, currentPos, direction: 'next' });
		return stage.move({ currentLocation });
	},
	title: () => {
		if (goForwardFuncs.props && goForwardFuncs.props.currentPos) {
			return {
				btn: `move to ${goForwardFuncs.props.currentPos.neighbours[1].title}`,
				effect: ''
			};
		} else {
			throw new Error('title function error, or something with neigbours');
		}
	}
});
const goBackwardFuncs = ActionFuncs.generate({
	forAction: 'go backward',
	props: INITIAL_PROPS,
	action: () => {
		const { level, currentPos, stage, action } = goForwardFuncs.props;
		if (!level || !currentPos || !stage || !action) throw new Error();
		const currentLocation = getGraphNeighbour({ graph: level.graph, currentPos, direction: 'prev' });
		return stage.move({ currentLocation });
	},
	title: () => {
		if (goBackwardFuncs.props && goBackwardFuncs.props.currentPos) {
			return {
				btn: `move to ${goBackwardFuncs.props.currentPos.neighbours[0].title}`,
				effect: ''
			};
		} else {
			throw new Error('title function error, or something with neigbours');
		}
	}
});

const buildShelterFuncs = ActionFuncs.generate({
	forAction: 'build a shleter',
	props: INITIAL_PROPS,
	action: () => {
		const { level, currentPos, stage, action } = buildShelterFuncs.props;
		if (!stage || !currentPos || !level || !action) throw new Error();
		if (!stage.constructions) {
			return stage.move({ constructions: [ shelter ] });
		}

		return stage.move({ constructions: [ ...stage.constructions, shelter ] });
	},
	title: () => {
		return { btn: 'build a shelter', effect: 'standart shelter built!' };
	}
});

const buildRaftFuncs = ActionFuncs.generate({
	forAction: 'build raft',
	props: INITIAL_PROPS,
	action: () => {
		const { level, currentPos, stage, action } = buildRaftFuncs.props;
		if (!level || !currentPos || !stage || !action) throw new Error();
		if (!stage.constructions) {
			return stage.move({ constructions: [ raft ] });
		}
		return stage.move({ constructions: [ ...stage.constructions, raft ] });
	},
	title: () => {
		if (!buildRaftFuncs.props.level) throw new Error('Something is wrong with the level map');
		return {
			btn: 'build an escape raft',
			effect: `Escape Raft Built! You can now leave the ${buildRaftFuncs.props.level.map}`
		};
	}
});
const winWithRaftFuncs = ActionFuncs.generate({
	forAction: 'win with a raft',
	props: INITIAL_PROPS,
	action: () => {
		const { level, currentPos, stage, action } = winWithRaftFuncs.props;
		if (!level || !currentPos || !stage || !action) throw new Error();
		return stage.move({});
	},
	title: () => {
		if (!buildRaftFuncs.props.level) throw new Error('Something is wrong with the level map');
		return { btn: 'Escape', effect: `You have successfully escaped the ${buildRaftFuncs.props.level.map}` };
	}
});
const collectItemsFuncs = ActionFuncs.generate({
	forAction: 'collect items',
	props: INITIAL_PROPS,
	action: () => {
		const { level, currentPos, stage, action, player } = collectItemsFuncs.props;
		if (!level || !currentPos || !stage || !action || !player) throw new Error();
		const commonItems = currentPos.location.items.commonItems;
		const uncommonItems = currentPos.location.items.uncommonItems;
		player.collectItems([ commonItems, uncommonItems ]);
		return stage.move({});
	},
	title: () => {
		const buttonString = utilGetItemsString(collectItemsFuncs);
		return { btn: buttonString, effect: 'collected items' };
	}
});

const actionFuncs = [
	goForwardFuncs,
	goBackwardFuncs,
	buildShelterFuncs,
	buildRaftFuncs,
	winWithRaftFuncs,
	collectItemsFuncs
];

export default actionFuncs;

type Props = Omit<ActionFuncs, ActionFuncsMethods>;
