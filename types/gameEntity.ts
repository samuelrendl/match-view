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
}

export interface Slot {
  runes: RuneEntity[];
}

export interface RuneTree extends BaseEntity {
  id: number;
  key: string;
  slots: Slot[];
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

export type GameEntity = ItemEntity | RuneEntity | SummonerSpellEntity;

export interface GameEntityProps {
  entity: GameEntity;
  gameVersion: string;
  type: "item" | "rune" | "summoner";
}
