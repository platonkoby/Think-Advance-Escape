// not yet implemented, ignore

import { ItemInterface, Stats, Status } from '../types/Player';

class Player {
	stats: Stats;
	status: Status;
	items: ItemInterface[];

	constructor(stats: Stats, items: ItemInterface[], status: Status) {
		this.stats = stats;
		this.items = items;
		this.status = status;
	}

	equip(item: ItemInterface) {
		this.items.push(item);
	}

	static generate(): Player {
		return new Player({ str: 20, agil: 20, int: 20 }, [ { title: 'test' }, { title: 'test2' } ], {
			illness: null,
			injuries: null,
			hunger: 0,
			thirst: 0
		});
	}
}

export default Player;
