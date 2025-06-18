export interface BaseEntity {
  name: string;
  icon: string;
}

export interface ItemEntity extends BaseEntity {
  description: string;
  plaintext: string;
  gold: { base: number };
  image: { full: string };
}

export interface RuneEntity extends BaseEntity {
  id: number;
  key: string;
  shortDesc?: string;
  longDesc?: string;
  slots?: Slot[];
}
export interface Slot {
  runes: RuneEntity[];
}
export interface SummonerSpellEntity extends BaseEntity {
  id: string;
  key: string;
  description: string;
  cooldown: number[];
  image: {
    full: string;
  };
}

export interface AugmentEntity extends BaseEntity {
  id: number;
  desc: string;
  iconLarge: string;
  iconSmall: string;
}

export type GameEntity =
  | ItemEntity
  | RuneEntity
  | SummonerSpellEntity
  | AugmentEntity;

export interface GameEntityProps {
  entity: GameEntity | null | undefined;
  gameVersion: string;
  type: "item" | "rune" | "summoner" | "augment";
}
