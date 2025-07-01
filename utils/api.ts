export const fetchVersions = async () => {
  try {
    const response = await fetch("/api/fetch-version");
    return await response.json();
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
  region: string
) => {
  const res = await fetch(
    `/api/fetch-account?gameName=${gameName}&tagLine=${tagLine}&region=${region}`
  );
  if (!res.ok) throw new Error(`Failed to fetch account: ${res.status}`);
  return await res.json();
};

export const fetchSummoner = async (puuid: string, region = "eun1") => {
  const res = await fetch(
    `/api/fetch-summoner?puuid=${puuid}&region=${region}`
  );
  if (!res.ok) throw new Error(`Failed to fetch summoner: ${res.status}`);
  return await res.json();
};

export const fetchMatchHistory = async (
  puuid: string,
  region = "europe",
  start = 0,
  count = 5
) => {
  const res = await fetch(
    `/api/fetch-matchHistory?puuid=${puuid}&region=${region}&start=${start}&count=${count}`
  );
  if (!res.ok) throw new Error("Failed to fetch match history");
  return await res.json();
};

export const fetchMatchDetails = async (matchId: string, region = "europe") => {
  const res = await fetch(
    `/api/fetch-matchDetails?matchId=${matchId}&region=${region}`
  );
  if (!res.ok) throw new Error(`Failed to fetch summoner: ${res.status}`);
  return await res.json();
};

export const fetchQueueAndGamemodes = async () => {
  const [queueRes, gamemodeRes] = await Promise.all([
    fetch("/api/fetch-queue"),
    fetch("/api/fetch-gameModes"),
  ]);

  if (!queueRes.ok) throw new Error("Failed to fetch queue data");
  if (!gamemodeRes.ok) throw new Error("Failed to fetch gamemode data");

  const queues = await queueRes.json();
  const gamemodes = await gamemodeRes.json();

  return { queues, gamemodes };
};

export const fetchItems = async (gameVersion: string) => {
  const response = await fetch(`/api/fetch-items?gameVersion=${gameVersion}`);
  if (!response.ok) throw new Error("Failed to fetch items");
  const { data } = await response.json();
  return data;
};

export const fetchSummonerSpells = async (gameVersion: string) => {
  const response = await fetch(
    `/api/fetch-summonerSpells?gameVersion=${gameVersion}`
  );
  if (!response.ok) throw new Error("Failed to fetch summoners");
  return await response.json();
};

export const fetchRunes = async (gameVersion: string) => {
  const response = await fetch(`/api/fetch-runes?gameVersion=${gameVersion}`);
  if (!response.ok) throw new Error("Failed to fetch runes");
  return await response.json();
};

export const fetchAugments = async (gameVersion = "latest") => {
  const response = await fetch(
    `/api/fetch-augments?gameVersion=${gameVersion}`
  );
  if (!response.ok) throw new Error("Failed to fetch runes");
  return await response.json();
};
