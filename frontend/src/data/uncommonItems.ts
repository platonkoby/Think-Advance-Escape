export class UncommonItem {
	title: string;
	type: 'uncommon';
	constructor(title: string) {
		this.title = title;
		this.type = 'uncommon';
	}
}

const vine = new UncommonItem('vine');

const jungleUncommonItems: UncommonItem[] = [ vine ];
const beachUncommonItems: UncommonItem[] = [];
const caveUncommonItems: UncommonItem[] = [];
const rockyHillsUncommonItems: UncommonItem[] = [];
const whiteSandsUncommonItems: UncommonItem[] = [];

export default {
	jungleUncommonItems,
	beachUncommonItems,
	caveUncommonItems,
	rockyHillsUncommonItems,
	whiteSandsUncommonItems
};
