export interface InjuryInterface {
	title: string;
}
export interface IllnessInterface {
	title: string;
}
export type ItemInterface = {
	title: string;
};

export type Stats = {
	str: number;
	agil: number;
	int: number;
};
export type Status = {
	hunger: number;
	thirst: number;
	illness: IllnessInterface[] | null;
	injuries: InjuryInterface[] | null;
};
