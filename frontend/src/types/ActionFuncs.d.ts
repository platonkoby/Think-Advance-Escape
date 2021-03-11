import Level from '../mechanics/level';
import Stage from '../mechanics/stage';
import { MapLocations } from './Maps';

// action.func.props interface, read ActionFuncs
export interface FuncProps {
	level: Level | undefined;
	currentPos: MapLocations | undefined;
	stage: Stage | undefined;
}

//action.func.title , read ActionFuncs
export interface ActionTitle {
	btn: string;
	effect: string;
}
// ignore this type, it is utility
export type ActionFuncsMethods = '';
