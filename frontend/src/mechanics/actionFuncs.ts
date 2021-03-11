import Stage from './stage';
import { getGraphNeighbour, utilGetItemsString } from './utils';
import { FuncProps, ActionTitle, ActionFuncsMethods } from '../types/ActionFuncs';

const INITIAL_PROPS = {
	level: undefined,
	currentPos: undefined,
	stage: undefined
};

// later, maybe removed and subtituted with actions having unique action, title methods
export class ActionFuncs {
	props: FuncProps;
	action: () => Stage;
	title: () => ActionTitle;
	constructor({ props = INITIAL_PROPS, action, title }: Props) {
		this.props = props;
		this.action = action;
		this.title = title;
	}

	static generate(props: Props) {
		const action = new ActionFuncs(props);
		return action;
	}
}

const goForwardFuncs = ActionFuncs.generate({
	props: INITIAL_PROPS,
	action: () => {
		const { level, currentPos, stage } = goForwardFuncs.props;
		if (!level || !currentPos || !stage) throw new Error();
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
	props: INITIAL_PROPS,
	action: () => {
		const { level, currentPos, stage } = goForwardFuncs.props;
		if (!level || !currentPos || !stage) throw new Error();
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
	props: INITIAL_PROPS,
	action: () => {
		const { level, currentPos, stage } = buildShelterFuncs.props;
		if (!stage || !currentPos || !level) throw new Error();
		return stage.move({});
	},
	title: () => {
		return { btn: 'build a shelter', effect: 'standart shelter built!' };
	}
});

const buildRaftFuncs = ActionFuncs.generate({
	props: INITIAL_PROPS,
	action: () => {
		const { level, currentPos, stage } = buildRaftFuncs.props;
		if (!level || !currentPos || !stage) throw new Error();
		return stage.move({});
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
	props: INITIAL_PROPS,
	action: () => {
		const { level, currentPos, stage } = winWithRaftFuncs.props;
		if (!level || !currentPos || !stage) throw new Error();
		return stage.move({});
	},
	title: () => {
		if (!buildRaftFuncs.props.level) throw new Error('Something is wrong with the level map');
		return { btn: 'Escape', effect: `You have successfully escaped the ${buildRaftFuncs.props.level.map}` };
	}
});
const collectItemsFuncs = ActionFuncs.generate({
	props: INITIAL_PROPS,
	action: () => {
		const { level, currentPos, stage } = collectItemsFuncs.props;
		if (!level || !currentPos || !stage) throw new Error();
		return stage.move({});
	},
	title: () => {
		// creates a string to show the user which items can be collected in this location
		const buttonString = utilGetItemsString(collectItemsFuncs);
		return { btn: buttonString, effect: 'collected items' };
	}
});

const actionFuncs = {
	goForwardFuncs,
	goBackwardFuncs,
	buildShelterFuncs,
	buildRaftFuncs,
	winWithRaftFuncs,
	collectItemsFuncs
};

export default actionFuncs;

type Props = Omit<ActionFuncs, ActionFuncsMethods>;
