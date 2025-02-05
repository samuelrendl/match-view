export const fetchGameVersion = async () => {
  try {
    const response = await fetch(
      "https://ddragon.leagueoflegends.com/api/versions.json"
    );
    const versions = await response.json();
    return versions[0];
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("An unknown error occurred");
    }
  }
};

export const fetchAccount = async (
  gameName: string,
  tagLine: string,
  region = "europe"
) => {
  const response = await fetch(
    `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`,
    {
      headers: { "X-Riot-Token": process.env.RIOT_API_KEY! },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch PUUID");
  return await response.json();
};

export const fetchSummoner = async (puuid: string, region = "eun1") => {
  const response = await fetch(
    `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`,
    {
      headers: { "X-Riot-Token": process.env.RIOT_API_KEY! },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch Summoner");
  return await response.json();
};

export const fetchMatchHistory = async (puuid: string, region = "europe") => {
  const response = await fetch(
    `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20`,
    {
      headers: { "X-Riot-Token": process.env.RIOT_API_KEY! },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch match history");
  return await response.json();
};

export const fetchMatchDetails = async (matchId: string, region = "europe") => {
  const response = await fetch(
    `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchId}`,
    {
      headers: { "X-Riot-Token": process.env.RIOT_API_KEY! },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch match details");
  return await response.json();
};
