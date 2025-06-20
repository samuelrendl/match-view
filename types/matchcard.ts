export interface Participant {
  puuid: string;
  riotIdGameName: string;
  riotIdTagline: string;
  win: boolean;
  teamId: number;
  placement: number;
  teamPosition: string;
  championName: string;
  champLevel: number;
  summoner1Id: number;
  summoner2Id: number;
  kills: number;
  assists: number;
  deaths: number;
  totalDamageDealtToChampions: number;
  totalDamageTaken: number;
  totalMinionsKilled: number;
  visionScore: number;
  goldEarned: number;
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
  playerAugment1: number;
  playerAugment2: number;
  playerAugment3: number;
  playerAugment4: number;
  playerAugment5: number;
  playerAugment6: number;
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
  teams: {
    teamId: number;
    win: boolean;
  }[];
}

export interface Match {
  metadata: {
    dataVersion: string;
    matchId: string;
    participants: string[];
  };
  info: MatchInfo;
}
