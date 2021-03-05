import { MapLocations } from './level';
import { OneLoc } from '../types/locationTypes';

interface StageProps {
	currentLocation: MapLocations;
}
type Optional<T> = { [P in keyof T]?: T[P] };

class Stage {
	readonly currentLocation: MapLocations;

	constructor({ currentLocation }: StageProps) {
		this.currentLocation = currentLocation;
	}

	move(props: Optional<StageProps>) {
		return Stage.generate({ ...this, ...props });
	}

	static generate(props: StageProps) {
		const stage = new Stage(props);
		console.log(stage);
		return stage;
	}
}

export default Stage;
