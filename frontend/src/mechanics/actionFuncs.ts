import Stage from './stage';
import { getGraphNeighbour, utilGetItemsString, utilItemComparison } from './utils';
import { FuncProps, ActionTitle, ActionFuncsMethods } from '../types/ActionFuncs';
import { DelayedAction, Action } from './action';
import { PlayerItems } from '../types/Player';
import constructions, { Construction } from '../data/constructions';
import { ConstructionTitle } from '../types/Constructions';


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

	static constructionAction (props: FuncProps, constructionName: ConstructionTitle, construction: Construction) {
		const { level, currentPos, stage, action, player } = props;
		if (!stage || !currentPos || !level || !action || !player) throw new Error();

		let playerItems: PlayerItems[] = player.items;
		const levelShelter = level.constructions.find((constr) => constr.title === constructionName);
		if (levelShelter) {
			const checker = utilItemComparison(playerItems, levelShelter.requirements);
			//setting player items
				//checking if there was enough of every item
				if(checker.filter((arr) => arr.includes(false)).length === 0){
					const updates = checker.map((arr) => arr.filter((item, index) => index === 1)).flat();
					player.updateItem(updates as PlayerItems[])
				}
			//getting the items which need to be collected
			const constructionRequirements = checker.filter((arr) => arr[0] === false).map((arr) => arr[2]);
			props.changes = constructionRequirements;
			
			
			// if construction wasn't built
			if (constructionRequirements.length > 0) {
				action.saveRepeats();
				action.type.push('skip');
				return {stage: stage.move({}), props};
			}
		}
		stage.addActionLayer(construction.title);
		if (!stage.constructions) {
			return {stage: stage.move({ constructions: [ construction ] }), props};
		}
		
		return {stage: stage.move({ constructions: [ ...stage.constructions, construction ] }), props};
	}

	static constructionEffect( defaultEffect: string, props: FuncProps): string {
		if (props.changes) {
			const constructionRequirements = props.changes;

			if (constructionRequirements.length > 0) {
				const effectsArr: string[] = [ 'You need' ];

				constructionRequirements.forEach((item: PlayerItems) =>
					effectsArr.push(`${item.title} - ${item.amount} `)
				);
				return effectsArr.join(', ');
			}
		}

		return defaultEffect
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
	forAction: 'build a shelter',
	props: INITIAL_PROPS,
	action: () => {
		const [shelter] = constructions;
		const {stage, props} = ActionFuncs.constructionAction(buildShelterFuncs.props, 'standard shelter', shelter);
		buildShelterFuncs.props = props;
		return stage;
	},
	title: () => {
		let effect: string = 'standard shelter built!';
		effect = ActionFuncs.constructionEffect(effect, buildShelterFuncs.props)
		return { btn: 'build a shelter', effect };
	}
});

const buildRaftFuncs = ActionFuncs.generate({
	forAction: 'build raft',
	props: INITIAL_PROPS,
	action: () => {
		const [raft] = constructions;
		const {stage, props} = ActionFuncs.constructionAction(buildRaftFuncs.props, 'raft', raft);
		buildRaftFuncs.props = props;
		return stage;
	},
	title: () => {
		if (!buildRaftFuncs.props.level) throw new Error('Something is wrong with the level map');
		let effect = `Escape Raft Built! You can now leave the ${buildRaftFuncs.props.level.map.title}`;
		effect = ActionFuncs.constructionEffect(effect, buildRaftFuncs.props)
		return {
			btn: 'build an escape raft',
			effect: effect
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
		return { btn: 'Escape', effect: `You have successfully escaped the ${buildRaftFuncs.props.level.map.title}!` };
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

const sleepFuncs = ActionFuncs.generate({
	forAction: 'sleep',
	props: INITIAL_PROPS,
	action: () => {
		const { level, currentPos, stage, action } = sleepFuncs.props;
		if (!level || !currentPos || !stage || !action) throw new Error();

		return stage.move({ timeOfTheDay: 'morning' });
	},
	title: () => {
		return { btn: 'sleep', effect: '' };
	}
});
const waitNightOverFuncs = ActionFuncs.generate({
	forAction: 'wait night over',
	props: INITIAL_PROPS,
	action: () => {
		const { level, currentPos, stage, action } = waitNightOverFuncs.props;
		if (!level || !currentPos || !stage || !action) throw new Error();
		return stage.move({});
	},
	title: () => {
		return { btn: 'wait night over', effect: 'you have lived through this night!' };
	}
});
const skipTimeFuncs = ActionFuncs.generate({
	forAction: 'skip time',
	props: INITIAL_PROPS,
	action: () => {
		const { level, currentPos, stage, action, player } = skipTimeFuncs.props;
		if (!level || !currentPos || !stage || !action || !player) throw new Error();
		return stage.move({});
	},
	title: () => {
		return { btn: 'skip time', effect: 'You have done nothing for several hours...' };
	}
})

const enterShelterFuncs = ActionFuncs.generate({
forAction: 'enter shelter',
props: INITIAL_PROPS,
action: () => {
	const { level, currentPos, stage, action, player } = enterShelterFuncs.props;
	if (!level || !currentPos || !stage || !action || !player) throw new Error();

	return stage.move({actionLayers: {actionLayerList: stage.actionLayers.actionLayerList, currentLayer: 'standard shelter'}});
},
title: () => {
	return { btn: 'Enter Shelter', effect: 'Inside the shelter' };
}
})

const exitConstructionFuncs = ActionFuncs.generate({
forAction: 'exit construction',
props: INITIAL_PROPS,
action: () => {
	const { level, currentPos, stage, action, player } = exitConstructionFuncs.props;
	if (!level || !currentPos || !stage || !action || !player) throw new Error();
return stage.move({actionLayers: {actionLayerList: stage.actionLayers.actionLayerList, currentLayer: 'main'}});
},
title: () => {
return { btn: 'Exit', effect: '' };
}
})

const actionFuncs = [
	goForwardFuncs,
	goBackwardFuncs,
	buildShelterFuncs,
	buildRaftFuncs,
	winWithRaftFuncs,
	collectItemsFuncs,
	sleepFuncs,
	waitNightOverFuncs,
	skipTimeFuncs,
	enterShelterFuncs,
	exitConstructionFuncs
];

export default actionFuncs;

type Props = Omit<ActionFuncs, ActionFuncsMethods>;
