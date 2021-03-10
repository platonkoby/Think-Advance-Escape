import Level from './level';
import actionList from './action';
import { MapLocations } from '../types/Maps';
import Stage from './stage';
import { getGraphNeighbour, utilGetItemsString } from './utils';

const INITIAL_PROPS = {
	level: undefined,
	currentPos: undefined,
	stage: undefined
};

interface FuncProps {
	level: Level | undefined;
	currentPos: MapLocations | undefined;
	stage: Stage | undefined;
}
export interface ActionTitle {
	btn: string;
	effect: string;
}

export class ActionFuncs {
	props: FuncProps;
	action: () => Stage;
	title: () => ActionTitle;
	constructor({ props = INITIAL_PROPS, action, title }: ActionFuncs) {
		this.props = props;
		this.action = action;
		this.title = title;
	}

	static generate(props: ActionFuncs) {
		const action = new ActionFuncs(props);
		return action;
	}
}
// export type Func = () => void |
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
		const buttonString = utilGetItemsString(collectItemsFuncs);
		return { btn: buttonString, effect: 'collected items' };
	}
});

export default {
	goForwardFuncs,
	goBackwardFuncs,
	buildShelterFuncs,
	buildRaftFuncs,
	winWithRaftFuncs,
	collectItemsFuncs
};
