export class UncommonItem {
	title: string;
	type: 'uncommon';
	constructor(title: string) {
		this.title = title;
		this.type = 'uncommon';
	}
}

const vine = new UncommonItem('vine');

const plasticScrap = new UncommonItem('plastic scrap');

const brokenStalagmite = new UncommonItem('broken stalagmite');

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
