export class UncommonItem {
	title: string;
	type: 'uncommon';
	constructor(title: string) {
		this.title = title;
		this.type = 'uncommon';
	}
}

const vine = new UncommonItem('vine');

const jungle: UncommonItem[] = [ vine ];
const beach: UncommonItem[] = [];
const cave: UncommonItem[] = [];
const rockyHills: UncommonItem[] = [];
const whiteSands: UncommonItem[] = [];
const test: UncommonItem[] = [];

const uncommonItems = {
	jungle,
	beach,
	cave,
	rockyHills,
	whiteSands,
	test
};

export default uncommonItems;
