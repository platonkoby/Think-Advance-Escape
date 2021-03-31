import { useEffect, useState } from 'react';
import Level from './mechanics/level';
import Player from './mechanics/player';
import Loading from './Loading';
import { ActionFuncs as Func } from './mechanics/actionFuncs';
import Stage from './mechanics/stage';
import { Action, DelayedAction } from './mechanics/action';


function Game({ loading, level, startGame, player }: Props) {
	const [ currentStage, setCurrentStage ] = useState<Stage | undefined>();
	const [ currentEffect, setCurrentEffect ] = useState('');

	const handleClick = (actionFuncs: Func, action: Action | DelayedAction) => {
		let stage = actionFuncs.action();
		if (currentStage && player) {
			action.runUtils(stage, player);
		}
		setCurrentStage(stage);
		setCurrentEffect(actionFuncs.title().effect);
	};
	useEffect(
		() => {
			if (currentStage && player && level) {
				console.log(currentStage);
				console.log(player);
			}
		},
		[ currentStage, player, level ]
	);
	useEffect(() => {
		startGame();
	}, []);
	useEffect(
		() => {
			if (!loading && level) {
				console.log(level);
				if (level.allLocations.initialLocation === undefined) throw new Error('No Initial Location');
				level.graph.forEach((pos) => {
					if (pos.location.initial) {
						const { allActions, allLocations } = level;

						setCurrentStage(
							Stage.generate({
								currentLocation: pos,
								allActions: { ...allActions, waitingActions: [] },
								allLocations: allLocations.all,
								timeOfTheDay: 'morning',
								actionLayers: {actionLayerList: ['main'], currentLayer: 'main'}
							})
						);
					}
				});
			}
		},
		[ level, loading ]
	);
	if (level && currentStage) {
		const layer = currentStage.actionLayers.currentLayer;
		let {title, text, actions} = currentStage.currentLocation.location;

		if (layer !== 'main') {
			const actionList = currentStage.constructions?.find((constr) => constr.title === layer)?.actions;
			if (!actionList) throw new Error('there is a proble with action layer, there is no such layer/construction');
			actions = actionList;
		}


		return (
			<div className='container'>
				<div className='header'>
					<h1>{title.charAt(0).toUpperCase() + title.slice(1)}</h1>
					<p>
						{text ? text : ''}
					</p>
					<p>{currentEffect}</p>
				</div>
				<div className="action-container-holder">
					<h2>You:</h2>
				<ul className="action-container">
					{actions.map((action, index) => {
						if (action.repeats === 0 || !action.funcs) return null;
						const actionFuncs = action.funcs;
						actionFuncs.props = {
							player,
							action,
							level,
							currentPos: currentStage.currentLocation,
							stage: currentStage
						};
						const title = actionFuncs.title();

						if (title.btn === 'disable') return null;
						return (
							<li className="action" key={action.description}>
								<button
									onClick={() => {
										handleClick(actionFuncs, action);
									}}
								>
									{title.btn}
								</button>
							</li>
						);
					})}
				</ul>
				</div>
				
			</div>
		);
	}
	return <Loading />;
}

export default Game;

interface Props {
	loading: boolean;
	level: Level | undefined;
	player: Player | undefined;
	startGame: () => void;
}
