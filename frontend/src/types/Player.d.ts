import { AllItemTypes } from './Items';
//ignore
export interface InjuryInterface {
	title: string;
}
//ignore
export interface IllnessInterface {
	title: string;
}
//ignore
export type Stats = {
	str: number;
	agil: number;
	int: number;
};
//ignore

export type Status = {
	hunger: number;
	thirst: number;
	illness: IllnessInterface[] | null;
	injuries: InjuryInterface[] | null;
};

//ignore utils
export type PlayerMethods = 'collectItems' | 'increaseHunger' | 'updateItem';

//ignore utils
export interface PlayerItems {
	title: AllItemTypes['title'];
	type: AllItemTypes['type'];
	amount: number;
}
