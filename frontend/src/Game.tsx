import { useEffect, useState } from 'react';
import Level from './mechanics/level';
import Player from './mechanics/player';
import Loading from './Loading';
import { ActionFuncs as Func, ActionTitle } from './mechanics/actionFuncs';
import Stage from './mechanics/stage';
import { Action, DelayedAction } from './mechanics/action';

function Game({ loading, level, player, startGame }: Props) {
	const [ currentStage, setCurrentStage ] = useState<Stage | undefined>();
	const [ currentEffect, setCurrentEffect ] = useState('');

	const handleClick = (actionFuncs: Func, action: Action | DelayedAction) => {
		if (currentStage) {
			action.runUtils(currentStage);
		}
		const stage = actionFuncs.action();
		console.log(stage);
		setCurrentStage(stage);
		setCurrentEffect(actionFuncs.title().effect);
	};
	useEffect(
		() => {
			// console.log(currentStage);
		},
		[ currentStage ]
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
							Stage.generate({ currentLocation: pos, allActions, allLocations: allLocations.all })
						);
					}
				});
			}
		},
		[ level, loading ]
	);
	if (level && currentStage) {
		return (
			<div>
				<div>
					<h1>{currentStage.currentLocation.location.title}</h1>
					<p>
						{currentStage.currentLocation.location.text ? currentStage.currentLocation.location.text : ''}
					</p>
					<p>{currentEffect}</p>
				</div>
				<h2>You:</h2>
				<ul>
					{currentStage.currentLocation.location.actions.map((action) => {
						if (action.repeats === 0) return;
						const actionFuncs = action.func;
						actionFuncs.props = {
							level,
							currentPos: currentStage.currentLocation,
							stage: currentStage
						};
						const title = actionFuncs.title();

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
