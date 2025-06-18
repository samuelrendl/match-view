import {
  ItemEntity,
  RuneEntity,
  SummonerSpellEntity,
  AugmentEntity,
} from "./gameEntity";

export interface Account {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export interface Summoner {
  profileIconId: number;
  summonerLevel: number;
}

export interface Queues {
  queueId: number;
  description: string;
}

export interface Gamemodes {
  gameMode: string;
  description: string;
}

export interface StaticData {
  items?: Record<string, ItemEntity>;
  runes?: RuneEntity[];
  summoners?: {
    data: Record<string, SummonerSpellEntity>;
  };
  queues: Queues[];
  gamemodes: Gamemodes[];
  augments?: {
    augments: AugmentEntity[];
  };
}
