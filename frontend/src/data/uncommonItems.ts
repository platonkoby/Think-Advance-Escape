import { ItemUses, UncommonItemName } from '../types/Items';

export class UncommonItem {
	title: string;
	type: 'uncommon';
	uses: ItemUses;
	constructor(title: UncommonItem['title'], uses: UncommonItem['uses']) {
		this.title = title;
		this.type = 'uncommon';
		this.uses = uses;
	}
}

const vine = new UncommonItem('vine', [ 'build', 'tool part' ]);

const plasticScrap = new UncommonItem('plastic scrap', [ 'tool part', 'build' ]);

const brokenStalagmite = new UncommonItem('broken stalagmite', [ 'throw', 'tool part', 'weapon' ]);

const jungle: UncommonItem[] = [ vine ];
const beach: UncommonItem[] = [ plasticScrap ];
const cave: UncommonItem[] = [ brokenStalagmite ];
const rockyHills: UncommonItem[] = [];
const whiteSands: UncommonItem[] = [];

const uncommonItems = {
	jungle,
	beach,
	cave,
	rockyHills,
	whiteSands
};

export default uncommonItems;
