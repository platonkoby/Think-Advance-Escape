import { ItemUses } from '../types/Items';

export class CommonItem {
	title: string;
	type: 'common';
	uses: ItemUses;
	constructor(title: string, uses: ItemUses) {
		this.title = title;
		this.type = 'common';
		this.uses = uses;
	}
}

const flexibleBranch = new CommonItem('flexible branch', [ 'build', 'tool part' ]);
const wideLeaf = new CommonItem('wide leaf', [ 'build' ]);

const pebble = new CommonItem('pebble', [ 'tool part', 'throw' ]);
const shell = new CommonItem('shell', [ 'tool part' ]);

const rock = new CommonItem('rock', [ 'build', 'tool part', 'weapon', 'throw' ]);

const deadCoral = new CommonItem('dead coral', []);

const jungle: CommonItem[] = [ flexibleBranch, wideLeaf ];
const beach: CommonItem[] = [ pebble, shell ];
const cave: CommonItem[] = [];
const rockyHills: CommonItem[] = [ rock ];
const whiteSands: CommonItem[] = [ deadCoral ];

const commonItems = { jungle, beach, cave, rockyHills, whiteSands };

export default commonItems;
