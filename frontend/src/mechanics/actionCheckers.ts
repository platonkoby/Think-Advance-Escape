import Stage from './stage';

export const winWithRaftChecker = (stage: Stage) => {
	const initialActions = stage.allActions.initialActions;
	const raftCheck = initialActions.map((action) => action.title === 'build raft');
	if (raftCheck.includes(true)) return true;
	return false;
};
