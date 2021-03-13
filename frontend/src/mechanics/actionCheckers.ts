import Stage from './stage';

export const winWithRaftChecker = (stage: Stage) => {
	if (stage.constructions) {
		console.log(stage);
		const raft = stage.constructions.filter((construction) => construction.title === 'raft');
		if (raft.length > 0) return true;
	}
	return false;
};

export const shelterIsBuilt = (stage: Stage) => {
	if (stage.constructions && stage.constructions.find((construction) => construction.title === 'standart shelter')) {
		return true;
	}
	return false;
};
