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

const pebble = new CommonItem('pebble');
const shell = new CommonItem('shell');

const rock = new CommonItem('rock');

const deadCoral = new CommonItem('dead coral');

const jungle: CommonItem[] = [ flexibleBranch, wideLeaf ];
const beach: CommonItem[] = [ pebble, shell ];
const cave: CommonItem[] = [];
const rockyHills: CommonItem[] = [ rock ];
const whiteSands: CommonItem[] = [ deadCoral ];

const commonItems = { jungle, beach, cave, rockyHills, whiteSands };

export default commonItems;
