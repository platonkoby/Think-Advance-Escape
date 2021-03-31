

export type Tag = LocationTag;
export type LocationTag =
| 'explore'
| 'rough terrain'
| 'enclosed'
| 'dark'
| 'high'
| 'high vegetation'
| 'humid'
| 'coastal'
| 'all';

export type LocationType = 'large' | 'medium' | 'small' | 'win condition' | 'initial location'| 'has construction' | 'all';
export type ConstructionType = 'shelter' | 'raft' | 'construction';
export type AllTypes = LocationType | ConstructionType;