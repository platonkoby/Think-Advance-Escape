import { MapLocations } from '../types/Maps';
import { AllAction } from '../types/Level';
import { LocationCollectionProps } from '../types/LocationTypes';
import { Action, DelayedAction } from './action';
import { StageMethods } from '../types/Stage';
import { Optional } from '../types/Utils';
import { Construction } from '../data/constructions';

class Stage {
	currentLocation: MapLocations;
	allLocations: LocationCollectionProps['all'];
	allActions: AllAction;

	dependencyMap?: Map<Action['title'], DelayedAction[]>;
	constructions?: Construction[];

	constructor({ currentLocation, allActions, allLocations, dependencyMap, constructions }: Props) {
		this.currentLocation = currentLocation;
		this.allLocations = allLocations;
		this.allActions = allActions;
		this.dependencyMap = dependencyMap;
		this.constructions = constructions;
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
