import { LocationTitle } from '../types/LocationTypes';
import { ConstructionMethods, ConstructionReqs } from '../types/Constructions';
import actionList, { DelayedAction } from '../mechanics/action';
import { ConstructionType } from '../types/Tags-Types';


export class Construction {
	title: string;
	type: ConstructionType[];
	forLocations: (LocationTitle | 'all')[];
	requirements?: ConstructionReqs;
	actions:  DelayedAction[];

	//@ts-ignore
	constructor({ title, forLocations, type, requirements, actions }: Props) {
		this.title = title;
		this.type = type;
		this.forLocations = forLocations;
		this.requirements = requirements;
		this.actions = actions;
	}

		static getActions(type: ConstructionType[]) {
		const actions = type.map((actionType) => actionList.filter((action) => action.forTypes.includes(actionType))).flat();
		return actions as DelayedAction[];
	}
}

const shelter = new Construction({
	title: 'standard shelter',
	type: [ 'shelter' ],
	forLocations: [ 'all' ],
	actions: Construction.getActions(['shelter'])
});
// ...Construction.getActions(['shelter'])

const raft = new Construction({
	title: 'raft',
	type: [ 'raft' ],
	forLocations: [ 'beach' ],
	actions: Construction.getActions(['raft'])
});
// ...Construction.getActions(['raft'])
const constructions = [ shelter, raft ];
export default constructions;

type Props = Omit<Construction, ConstructionMethods>;
