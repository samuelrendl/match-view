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
        headers: { "X-Riot-Token": (() => {
          if (!process.env.RIOT_API_KEY) throw new Error("RIOT_API_KEY is not set");
          return process.env.RIOT_API_KEY;
        })() },
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
    `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=1`,
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

export const fetchQueueId = async (
  queueId: string,
  gamemode: string
): Promise<string> => {
  const [queueRes, gamemodeRes] = await Promise.all([
    fetch("https://static.developer.riotgames.com/docs/lol/queues.json"),
    fetch("https://static.developer.riotgames.com/docs/lol/gameModes.json"),
  ]);

  if (!queueRes.ok) throw new Error("Failed to fetch queue data");
  if (!gamemodeRes.ok) throw new Error("Failed to fetch gamemode data");

  const queues = await queueRes.json();
  const gamemodes = await gamemodeRes.json();

  const customGameModes: Record<number, string> = {
    0: "Custom",
    400: "Normal Draft",
    420: "Ranked Solo",
    440: "Ranked Flex",
    450: "ARAM",
    700: "Clash",
    720: "ARAM Clash",
    900: "ARURF",
    1020: "One for All",
    1400: "Ultimate Spellbook",
    1700: "Arena",
    1710: "Arena",
    2000: "Tutorial",
  };

  const numericQueueId = Number(queueId);
  if (customGameModes[numericQueueId]) {
    return customGameModes[numericQueueId];
  }

  if (gamemode !== "CLASSIC") {
    const foundGamemode = gamemodes.find(
      (g: { gamemode: string }) => g.gamemode === gamemode
    );
    if (!foundGamemode) throw new Error("Gamemode not found");
    return foundGamemode.description;
  }

  const foundQueue = queues.find(
    (q: { queueId: number }) => q.queueId === numericQueueId
  );
  if (!foundQueue) throw new Error("Queue ID not found");

  return foundQueue.description;
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

export const fetchAugments = async () => {
  const response = await fetch(
    `https://raw.communitydragon.org/latest/cdragon/arena/en_us.json`
  );
  if (!response.ok) throw new Error("Failed to fetch runes");
  return await response.json();
};
