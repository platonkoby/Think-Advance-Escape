import { Action, DelayedAction } from '../mechanics/action';
import Level from '../mechanics/level';
import Player from '../mechanics/player';
import Stage from '../mechanics/stage';
import { MapLocations } from './Maps';

export interface FuncProps {
	player: Player | undefined;
	level: Level | undefined;
	currentPos: MapLocations | undefined;
	stage: Stage | undefined;
	action: Action | DelayedAction | undefined;
}

export interface ActionTitle {
	btn: string;
	effect: string;
}

export type ActionFuncsMethods = '';
