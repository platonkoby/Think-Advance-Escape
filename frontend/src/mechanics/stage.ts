import { MapLocations } from '../types/Maps';
import { LocationCollectionProps } from '../types/LocationTypes';
import { Action, DelayedAction } from './action';
import { StageActions, StageMethods, TimeOfDay } from '../types/Stage';
import { Optional } from '../types/Utils';
import { Construction } from '../data/constructions';

class Stage {
	currentLocation: MapLocations;
	allLocations: LocationCollectionProps['all'];
	allActions: StageActions;
	dependencyMap?: Map<Action['title'], DelayedAction[]>;
	constructions?: Construction[];
	timeOfTheDay: TimeOfDay;

	constructor({ currentLocation, allActions, allLocations, dependencyMap, constructions, timeOfTheDay }: Props) {
		this.currentLocation = currentLocation;
		this.allLocations = allLocations;
		this.allActions = allActions;
		this.dependencyMap = dependencyMap;
		this.constructions = constructions;
		this.timeOfTheDay = timeOfTheDay;
	}

	move(props: Optional<Props>): Stage {
		return Stage.generate({ ...this, ...props });
	}

	locationGetAction() {
		const locations = this.allLocations.map((location) => {
			location.actions = this.allActions.initialActions.filter((action) => {
				if (action.forTags.includes('all')) return true;
				if (action.repeats < 1) return false;
				const locationTags = location.tags;
				const actionTags = action.forTags;
				const shareTags = locationTags.map((tag) => actionTags.includes(tag));
				if (shareTags.includes(true)) return true;
				return false;
			});
			location.actions = location.actions.filter((action) => {
				if (action.forTypes.includes('all')) return true;
				if (typeof location.type === 'object') {
					return action.forTypes.includes('win condition') || action.forTypes.includes('initial location');
				} else {
					return action.forTypes.includes(location.type);
				}
			});
			return location;
		});
		this.allLocations = locations;
	}

	removeLocationText() {
		if (this.currentLocation.location.text) {
			const currentLocationTitle = this.currentLocation.location.title;
			const locationToChange = this.allLocations.find((location) => location.title === currentLocationTitle);
			if (!locationToChange) throw new Error('incorrect find function in removeLocationText');
			locationToChange.text = '';
		}
	}

	moveTime(action: Action | DelayedAction) {
		if (action.type.includes('timing')) {
			this.advance();
		}
	}

	advance(n: number = 1) {
		if (n > 0) {
			const time = this.timeOfTheDay;
			switch (time) {
				case 'night':
					this.timeOfTheDay = 'morning';
					break;
				case 'morning':
					this.timeOfTheDay = 'afternoon';
					break;
				case 'afternoon':
					this.timeOfTheDay = 'evening';
					break;
				case 'evening':
					this.timeOfTheDay = 'night';
					break;
				default:
					throw new Error('invalid time of the day');
			}
			this.advance(n - 1);
		}
	}

	setWaitingList() {
		let { initialActions, waitingActions } = this.allActions;
		// turn into set, to remove repetitions
		const initialActionsSet = new Set([ ...initialActions, ...waitingActions ]);
		initialActions = [];
		initialActionsSet.forEach((action) => initialActions.push(action));

		this.allActions.waitingActions = initialActions.filter((action) => waitingFunel(action, this));

		this.allActions.initialActions = initialActions.filter((action) => initialFunel(action, this));

		// function, returns true for actions, which are meant to be inital
		function initialFunel(action: Action | DelayedAction, stage: Stage): boolean {
			let candidate: Action | DelayedAction | null = action;

			if (action.forTime.includes(stage.timeOfTheDay) || action.forTime.includes('all')) {
				candidate = action;
			} else {
				return false;
			}

			if (action.dailyLimit.current < 1) {
				return false;
			}

			return true;
		}
		// returns true for actions, which are meant to be waiting
		function waitingFunel(action: Action | DelayedAction, stage: Stage): boolean {
			if (
				(action.forTime.includes(stage.timeOfTheDay) || action.forTime.includes('all')) &&
				action.dailyLimit.current > 0
			) {
				return false;
			}
			return true;
		}
	}

	resetDailyActions() {
		if (this.timeOfTheDay !== 'morning') return;
		let { initialActions, waitingActions } = this.allActions;
		this.allActions.initialActions = initialActions.map(resetCurrent);
		this.allActions.waitingActions = waitingActions.map(resetCurrent);

		function resetCurrent(action: Action | DelayedAction) {
			action.dailyLimit.current += action.dailyLimit.initial;
			return action;
		}
	}



	static updateAllActions(action: Action | DelayedAction, stage: Stage) {
		if (!stage.dependencyMap) throw new Error();
		let deps = stage.dependencyMap.get(action.title);
		if (deps) {
			deps = deps.filter((action) => action.checker(stage));
			let { initialActions, delayedActions } = stage.allActions;
			stage.allActions.initialActions = [ ...initialActions.filter((action) => action.repeats > 0), ...deps ];

			//@ts-ignore
			stage.allActions.delayedActions = delayedActions.filter((action) => !deps.includes(action));
		}
	}

	static generate(props: Props) {
		const dependencyMap = buildDependencyMap(props.allActions);
		const stage = new Stage({ ...props, dependencyMap });
		stage.resetDailyActions();
		stage.setWaitingList();
		stage.locationGetAction();
		return stage;
	}
}

function buildDependencyMap(allActions: Stage['allActions']): Stage['dependencyMap'] {
	const provocativeActionsTitles = new Set(allActions.delayedActions.map((action) => action.waitFor).flat());
	const deps: Stage['dependencyMap'] = new Map();
	provocativeActionsTitles.forEach((title) => {
		const affected = allActions.delayedActions.filter((action) => action.waitFor.includes(title));
		deps.set(title, affected);
	});
	return deps;
}

export default Stage;

type Props = Omit<Stage, StageMethods>;
