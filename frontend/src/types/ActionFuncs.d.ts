import Level from '../mechanics/level';
import Stage from '../mechanics/stage';
import { MapLocations } from './Maps';

export interface FuncProps {
	level: Level | undefined;
	currentPos: MapLocations | undefined;
	stage: Stage | undefined;
}
export interface ActionTitle {
	btn: string;
	effect: string;
}

export type ActionFuncsMethods = '';
