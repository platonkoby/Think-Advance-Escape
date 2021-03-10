import { MapLocations } from '../types/Maps';
import { AllAction } from './level';
import { AllLoc, AllLocations, LocationCollectionProps, OneLoc } from '../types/locationTypes';
import actionList, { Action, DelayedAction } from './action';
import { useLocation } from 'react-router';

type StageMethods = 'move' | 'actionChecker' | 'locationGetAction' | 'updateAllActions';
type StageProps = Omit<Stage, StageMethods>;
type Optional<T> = { [P in keyof T]?: T[P] };
class Stage {
	currentLocation: MapLocations;
	allLocations: LocationCollectionProps['all'];
	allActions: AllAction;
	dependencyMap?: Map<Action['title'], DelayedAction[]>;

	constructor({ currentLocation, allActions, allLocations, dependencyMap }: StageProps) {
		this.currentLocation = currentLocation;
		this.allLocations = allLocations;
		this.allActions = allActions;
		this.dependencyMap = dependencyMap;
	}

	move(props: Optional<StageProps>) {
		this.locationGetAction();
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
		console.log(locations);
		return locations;
	}

	actionChecker(action: Action | DelayedAction) {
		if (this.dependencyMap) {
			const checkActions = this.dependencyMap.get(action.title);
			if (checkActions && checkActions.length > 0) {
				const checkers: DelayedAction[] = checkActions.filter((action) => action.checker(this.allActions));
				if (checkers.length < 1) return;
				this.allActions.initialActions = [ ...this.allActions.initialActions, ...checkers ].filter(
					(action) => action.repeats > 0
				);
				this.allActions.delayedActions = this.allActions.delayedActions.filter(
					(action) => !checkers.includes(action)
				);
			}
		}
	}

	updateAllActions(action: Action | DelayedAction) {
		if (!this.dependencyMap) throw new Error();
		let deps = this.dependencyMap.get(action.title);
		if (deps) {
			deps = deps.filter((action) => action.checker(this));
			const { initialActions, delayedActions } = this.allActions;
			this.allActions.initialActions = [ ...initialActions.filter((action) => action.repeats > 0), ...deps ];
			//@ts-ignore
			this.allActions.delayedActions = delayedActions.filter((action) => !deps.includes(action));
			console.log(this);
		}
	}

	static generate(props: StageProps) {
		const dependencyMap = buildDependencyMap(props.allActions);
		const stage = new Stage({ ...props, dependencyMap });
		stage.locationGetAction();

		console.log(stage);
		return stage;
	}
}

function assignActionsToLocations(
	allLocations: LocationCollectionProps['all'],
	actionList: (Action | DelayedAction)[]
) {
	allLocations.forEach((location) => {
		const candidateActions: (Action | DelayedAction)[] = [];
		actionList.forEach((action) => {
			if (!location.actions.find((action) => action.title)) {
				console.log(action);
				action.forTags.forEach((tag) => {
					if (tag === 'all') {
						candidateActions.push(action);
					} else if (location.tags.includes(tag)) {
						candidateActions.push(action);
					}
				});
			}
		});
		candidateActions.forEach((action) => {
			action.forTypes.forEach((type) => {
				if (type === 'all') {
					location.actions.push(action);
				} else if (typeof location.type === 'object') {
					if (location.type.includes(<'win condition' | 'initial location'>type)) {
						location.actions.push(action);
					}
				} else if (location.type === type) {
					location.actions.push(action);
				}
			});
		});
	});
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
