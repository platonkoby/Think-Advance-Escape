import Stage from './stage';

// checks if the stage has a raft construction
export const winWithRaftChecker = (stage: Stage) => {
	if (stage.constructions) {
		console.log(stage);
		const raft = stage.constructions.filter((construction) => construction.title === 'raft');
		if (raft.length > 0) return true;
	}
	return false;
};
