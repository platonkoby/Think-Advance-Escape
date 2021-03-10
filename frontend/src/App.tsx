import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import Player from './mechanics/player';
import Level from './mechanics/level';
import Start from './Start';
import Game from './Game';

function App() {
	const [ level, setLevel ] = useState<Level | undefined>();
	const [ player, setPlayer ] = useState<Player | undefined>();
	const [ loading, setLoading ] = useState(true);

	const startGame = (): void => {
		const level = Level.generate();
		setLevel(level);
		setPlayer(Player.generate());
	};

	useEffect(
		() => {
			if (level && player) {
				setLoading(false);
			}
		},
		[ level, player ]
	);

	return (
		<React.Fragment>
			<Route exact path="/">
				<Start startGame={startGame} />
			</Route>
			<Route path="/game">
				<Game loading={loading} level={level} player={player} startGame={startGame} />
			</Route>
		</React.Fragment>
	);
}

export default App;
