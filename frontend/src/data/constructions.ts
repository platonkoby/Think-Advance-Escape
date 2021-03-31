import { LocationTitle } from '../types/LocationTypes';
import { ConstructionMethods, ConstructionReqs, ConstructionTitle } from '../types/Constructions';
import actionList, { DelayedAction } from '../mechanics/action';
import { ConstructionType } from '../types/Tags-Types';


export const RAFT: ConstructionTitle = 'raft';
export const SHELTER: ConstructionTitle = 'standard shelter';

export class Construction {
	title: ConstructionTitle;
	type: ConstructionType[];
	forLocations: (LocationTitle | 'all')[];
	requirements?: ConstructionReqs;
	actions:  DelayedAction[];

	constructor({ title, forLocations, type, requirements, actions }: Props) {
		this.title = title;
		this.type = type;
		this.forLocations = forLocations;
		this.requirements = requirements;
		this.actions = actions;
	}

		static getActions(type: ConstructionType[]) {
			type.push('construction');
		const actions = type.map((actionType) => actionList.filter((action) => action.forTypes.includes(actionType))).flat();
		return actions as DelayedAction[];
	}
}

const shelter = new Construction({
	title: 'standard shelter',
	type: [ 'shelter', 'construction' ],
	forLocations: [ 'all' ],
	actions: Construction.getActions(['shelter'])
});
// ...Construction.getActions(['shelter'])

const raft = new Construction({
	title: 'raft',
	type: [ 'raft', 'construction' ],
	forLocations: [ 'beach' ],
	actions: Construction.getActions(['raft'])
});
// ...Construction.getActions(['raft'])
const constructions = [ shelter, raft ];
export default constructions;


type Props = Omit<Construction, ConstructionMethods>;
