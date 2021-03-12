import { AllItemTypes, Items } from '../types/Items';
import { PlayerMethods, PlayerItems } from '../types/Player';
import { getUtilRandomNumberProps, utilRandomNumber } from './utils';

const PLAYER_DEFAULT: Props = {
	HP: 100,
	hunger: 0,
	items: []
};

class Player {
	HP: number;
	hunger: number;
	items: PlayerItems[];

	constructor(props: Props) {
		const { HP, hunger, items } = props;
		this.HP = HP;
		this.hunger = hunger;
		this.items = items;
	}

	updateItem(itemTitle: string) {
		const item = this.items.filter((one) => one.title === itemTitle)[0];
		this.items = this.items.filter((one) => one.title !== itemTitle);
		const [ to, from ] = getUtilRandomNumberProps(item.type);
		item.amount += utilRandomNumber(to, from);
		this.items.push(item);
	}

	increaseHunger() {
		this.hunger = this.hunger + 10;
	}

	collectItems(props: AllItemTypes[][]) {
		props.forEach((items) => {
			const existingItems = this.items.map((one) => one.title);
			items.forEach((item) => {
				if (existingItems.includes(item.title)) {
					this.updateItem(item.title);
				} else {
					const { title, type } = item;
					const [ to, from ] = getUtilRandomNumberProps(item.type);
					this.items.push({ title, type, amount: utilRandomNumber(to, from) });
				}
			});
		});
	}

	static generate(props: Props = PLAYER_DEFAULT) {
		return new Player(props);
	}
}

export default Player;

type Props = Omit<Player, PlayerMethods>;
