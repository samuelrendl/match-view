import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  AugmentEntity,
  RuneEntity,
  RuneTree,
  SummonerSpellEntity,
} from "../types/gameEntity";
import { Participant } from "@/types/matchcard";

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
  return Number((kills + assists) / deaths).toFixed(2);
};

export const findRuneOrTreeById = (
  id: string | number | undefined | null,
  runeTrees: RuneTree[]
): RuneTree | RuneEntity | null => {
  if (id === 0 || id === undefined || id === null) {
    return null;
  }
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

export const findAugmentById = (
  id: number | undefined | null,
  augmentsData: { augments: AugmentEntity[] }
): AugmentEntity | null => {
  if (!id) return null;

  const augment = augmentsData.augments.find((augment) => augment.id === id);

  if (!augment) {
    throw new Error(`No augment found with ID ${id}`);
  }

  return augment;
};

export const formatGameDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const groupAndSortTeams = ({
  participants,
}: {
  participants: Participant[];
}) => {
  const placementMap: Record<number, Participant[]> = {};

  for (const player of participants) {
    if (!placementMap[player.placement]) {
      placementMap[player.placement] = [];
    }
    placementMap[player.placement].push(player);
  }

  const sortedTeams: Participant[][] = Object.keys(placementMap)
    .map(Number)
    .sort((a, b) => a - b)
    .map((placement) => placementMap[placement]);

  return sortedTeams;
};
