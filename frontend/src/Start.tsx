import { Link, Route, Redirect } from 'react-router-dom';

// For now, ignore this comoponent, at this stage it is created, but not really used
function Start({ startGame }: Props) {
	return (
		<div>
			<Route exact path="/">
				{true && <Redirect to="/game" />}
			</Route>
			<Link to="/game">
				<button className="start" onClick={startGame}>
					Generate Level!
				</button>
			</Link>
		</div>
	);
}

export default Start;

interface Props {
	startGame: () => void;
}
