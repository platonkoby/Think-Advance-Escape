import { LocationTitle } from '../types/locationTypes';

type ConstructionType = 'shelter' | 'escape';

export class Construction {
	title: string;
	type: ConstructionType[];
	forLocations: (LocationTitle | 'all')[];
	constructor({ title, forLocations, type }: Props) {
		this.title = title;
		this.type = type;
		this.forLocations = forLocations;
	}
}

const shelter = new Construction({
	title: 'standart shelter',
	type: [ 'shelter' ],
	forLocations: [ 'all' ]
});

const raft = new Construction({
	title: 'raft',
	type: [ 'escape' ],
	forLocations: [ 'beach' ]
});

export default [ shelter, raft ];

type ConstructionMethods = '';
type Props = Omit<Construction, ConstructionMethods>;
