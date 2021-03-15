import { CommonItem } from '../data/commonItems';
import { UncommonItem } from '../data/uncommonItems';
import { CommonItemName, UncommonItemName } from './Items';
import { PlayerItems } from './Player';

export type ConstructionType = 'shelter' | 'raft';

export type ConstructionMethods = 'getMaterials';

export type ConstructionReqs = PlayerItems[]

