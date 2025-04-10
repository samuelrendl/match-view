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
  try {
    const encodedGameName = encodeURIComponent(gameName);
    const encodedTagLine = encodeURIComponent(tagLine);

    const response = await fetch(
      `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodedGameName}/${encodedTagLine}`,
      {
        headers: { "X-Riot-Token": process.env.RIOT_API_KEY! },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `API Error ${response.status}: ${errorData?.status?.message || "Unknown error"}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw new Error(
      `Failed to fetch account: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
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

export const fetchQueueId = async (queueId: string) => {
  const response = await fetch(
    `https://static.developer.riotgames.com/docs/lol/queues.json`
  );
  if (!response.ok) throw new Error("Failed to fetch queueId");

  const queues = await response.json();
  const queue = queues.find(
    (q: { queueId: number }) => q.queueId === Number(queueId)
  );
  if (!queue) throw new Error("Queue ID not found");

  return queue;
};

export const fetchItems = async (gameVersion: string) => {
  const response = await fetch(
    `https://ddragon.leagueoflegends.com/cdn/${gameVersion}/data/en_US/item.json`
  );
  if (!response.ok) throw new Error("Failed to fetch items");
  const { data } = await response.json();
  return data;
};

export const fetchSummonerSpells = async (gameVersion: string) => {
  const response = await fetch(
    `https://ddragon.leagueoflegends.com/cdn/${gameVersion}/data/en_US/summoner.json`
  );
  if (!response.ok) throw new Error("Failed to fetch summoners");
  return await response.json();
  
};

export const fetchRunes = async (gameVersion: string) => {
  const response = await fetch(
    `https://ddragon.leagueoflegends.com/cdn/${gameVersion}/data/en_US/runesReforged.json`
  );
  if (!response.ok) throw new Error("Failed to fetch runes");
  return await response.json();
};
