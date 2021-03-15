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

	updateItem(allItems: PlayerItems[]) {
		allItems.forEach((newItem) => {
			const item = this.items.find((one) => one.title === newItem.title);
		//remove the updating item from the player items
		this.items = this.items.filter((one) => one.title !== newItem.title);
		if (item){
			item.amount += newItem.amount;
			this.items.push(item);
		}
		})
	}

	increaseHunger(n: number = 10) {
			this.hunger += n;
	}

	collectItems(props: AllItemTypes[][]) {
		props.forEach((items) => {
			
			const existingItems = this.items.map((one) => one.title);
			items.forEach((item) => {
				const { title, type } = item;
				const [ to, from ] = getUtilRandomNumberProps(item.type);
				const newItem = { title, type, amount: utilRandomNumber(to, from) };
				if (existingItems.includes(item.title)) {
					this.updateItem([newItem]);
				} else {
					
					this.items.push(newItem);
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
