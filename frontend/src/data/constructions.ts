import { LocationTitle } from '../types/LocationTypes';
import { ConstructionType, ConstructionMethods, ConstructionReqs } from '../types/Constructions';

export class Construction {
	title: string;
	type: ConstructionType[];
	forLocations: (LocationTitle | 'all')[];
	requirements?: ConstructionReqs;
	constructor({ title, forLocations, type, requirements }: Props) {
		this.title = title;
		this.type = type;
		this.forLocations = forLocations;
		this.requirements = requirements;
	}
}

const shelter = new Construction({
	title: 'standard shelter',
	type: [ 'shelter' ],
	forLocations: [ 'all' ]
});

const raft = new Construction({
	title: 'raft',
	type: [ 'raft' ],
	forLocations: [ 'beach' ]
});
const constructions = [ shelter, raft ];
export default constructions;

type Props = Omit<Construction, ConstructionMethods>;
