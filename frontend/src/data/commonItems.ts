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

//lists of items for different locations
const jungle: CommonItem[] = [ flexibleBranch, wideLeaf ];
const beach: CommonItem[] = [];
const cave: CommonItem[] = [];
const rockyHills: CommonItem[] = [];
const whiteSands: CommonItem[] = [];
const test: CommonItem[] = [];

const commonItems = { jungle, beach, cave, rockyHills, whiteSands, test };

export default commonItems;
