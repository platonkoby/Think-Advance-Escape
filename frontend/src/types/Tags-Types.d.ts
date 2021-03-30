

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

export type LocationType = 'large' | 'medium' | 'small' | 'win condition' | 'initial location' | 'all';
export type ConstructionType = 'shelter' | 'raft';
export type AllTypes = LocationType | ConstructionType;