export interface Participant {
  puuid: string;
  win: boolean;
  championName: string;
  champLevel: number;
  summoner1Id: number;
  summoner2Id: number;
  kills: number;
  assists: number;
  deaths: number;
  totalMinionsKilled: number;
  visionScore: number;
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
  perks: {
    styles: {
      selections: {
        perk: number;
      }[];
      style: number;
    }[];
  };
  // You can add other properties as needed (e.g. win, championName, champLevel, etc.)
}

export interface MatchInfo {
  gameCreation: number;
  gameDuration: number;
  queueId: string;
  gameMode: string;
  gameVersion: string;
  participants: Participant[];
}

export interface MatchCardProps {
  params: {
    info: MatchInfo;
    gameResult: string;
  };
}
