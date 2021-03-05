export class CommonItem {
	title: string;
	type: 'common';
	constructor(title: string) {
		this.title = title;
		this.type = 'common';
	}
}

const flexibleBranch = new CommonItem('flexible branch');
const wideLeaf = new CommonItem('wide leaf');

const jungleCommonItems: CommonItem[] = [ flexibleBranch, wideLeaf ];
const beachCommonItems: CommonItem[] = [];
const caveCommonItems: CommonItem[] = [];
const rockyHillsCommonItems: CommonItem[] = [];
const whiteSandsCommonItems: CommonItem[] = [];

export default { jungleCommonItems, beachCommonItems, caveCommonItems, rockyHillsCommonItems, whiteSandsCommonItems };
