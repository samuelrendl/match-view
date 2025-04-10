import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { RuneEntity, RuneTree, SummonerSpellEntity } from "../types/gameEntity";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const timeAgo = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`;
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;
  return `${years} year${years !== 1 ? "s" : ""} ago`;
};

// Example usage:
// const timestamp = 1737051353154; // Replace with your timestamp
// console.log(timeAgo(timestamp));

export const splitUsername = (username: string) => {
  if (!username.includes("#")) {
    throw new Error(
      "Invalid username format. Expected format: gameName#tagLine"
    );
  }
  const [gameName, tagLine] = username.split("#");
  return { gameName, tagLine };
};

export const kdaRatioCal = (kills: number, assists: number, deaths: number) => {
  return (kills + assists) / deaths;
};

export const findRuneOrTreeById = (
  id: string | number,
  runeTrees: RuneTree[]
): RuneTree | RuneEntity => {
  const searchId = typeof id === "string" ? parseInt(id, 10) : id;

  const tree = runeTrees.find((tree) => tree.id === searchId);
  if (tree) return tree;

  const allRunes = runeTrees.flatMap((tree) =>
    tree.slots.flatMap((slot) => slot.runes)
  );

  const rune = allRunes.find((rune) => rune.id === searchId);

  if (!rune) {
    throw new Error(`No rune or tree found with ID ${id}`);
  }

  return rune;
};

export const findSummonerByKey = (
  key: string | number,
  spellsData: { data: Record<string, SummonerSpellEntity> }
): SummonerSpellEntity => {
  const searchKey = typeof key === "number" ? key.toString() : key;

  const spell = Object.values(spellsData.data).find(
    (spell) => spell.key === searchKey
  );

  if (!spell) {
    throw new Error(`No summoner spell found with key ${key}`);
  }

  return spell;
};
