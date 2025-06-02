import Image from "next/image";
import GameEntity from "../GameEntity";
import {
  findAugmentById,
  findRuneOrTreeById,
  findSummonerByKey,
} from "@/lib/utils";
import { Participant } from "@/types/matchcard";
import {
  AugmentEntity,
  SummonerSpellEntity,
  RuneEntity,
} from "@/types/gameEntity";

const ChampSetup = ({
  shorterGameVersion,
  player,
  gameType,
  fetchedSummoners,
  fetchedRunes,
  fetchedAugments,
  size = "lg",
}: {
  size?: "sm" | "lg";
  shorterGameVersion: string;
  player: Participant;
  gameType: string;
  fetchedSummoners: { data: Record<string, SummonerSpellEntity> };
  fetchedRunes: RuneEntity[];
  fetchedAugments: { augments: AugmentEntity[] };
}) => {
  const getSummoner = (id?: string | number) =>
    findSummonerByKey(id ?? 0, fetchedSummoners);

  const summonerOne = getSummoner(player?.summoner1Id);
  const summonerTwo = getSummoner(player?.summoner2Id);

  const getAugment = (id?: number) => findAugmentById(id ?? 0, fetchedAugments);

  const playerAugment1 = getAugment(player?.playerAugment1);
  const playerAugment2 = getAugment(player?.playerAugment2);
  const playerAugment3 = getAugment(player?.playerAugment3);
  const playerAugment4 = getAugment(player?.playerAugment4);

  const primaryRune = findRuneOrTreeById(
    player?.perks.styles[0].selections[0].perk ?? 0,
    fetchedRunes
  );
  const secondaryRune = findRuneOrTreeById(
    player?.perks.styles[1].style ?? 0,
    fetchedRunes
  );

  const isArena = gameType === "Arena";

  const getEntity = (
    summoner: SummonerSpellEntity | null,
    augment: AugmentEntity | null
  ) => (isArena ? augment : summoner);

  const getRune = (rune: RuneEntity | null, augment: AugmentEntity | null) =>
    isArena ? augment : rune;

  const renderEntityBlock = (
    entity: SummonerSpellEntity | RuneEntity | AugmentEntity | null,
    type: "summoner" | "rune" | "augment"
  ) => (
    <div
      className={`rounded-sm bg-black/50 ${size === "lg" ? "size-5 sm:size-6" : "size-4"}`}
    >
      <GameEntity
        entity={entity}
        type={type}
        gameVersion={shorterGameVersion}
      />
    </div>
  );

  return (
    <div className="flex items-center gap-0.5">
      {/* Champion Image with Level */}
      <div
        className={`relative drop-shadow-lg ${size === "lg" ? "size-[42px] sm:size-[50px]" : "size-[36px]"}`}
      >
        <Image
          src={`https://ddragon.leagueoflegends.com/cdn/${shorterGameVersion}/img/champion/${player?.championName}.png`}
          alt={`${player?.championName}`}
          width={64}
          height={64}
          loading="lazy"
          quality={70}
          className="rounded object-contain"
        />
        <div
          className={`absolute bottom-0 left-0 w-4 rounded-sm bg-black/50 text-center font-bold leading-snug text-white ${size === "lg" ? "text-[10px] sm:text-[14px]" : "text-[8px]"}`}
        >
          {player?.champLevel}
        </div>
      </div>

      {/* Summoners or Augments + Runes or Augments */}
      <div className="flex gap-0.5">
        {/* Left column (Summoners or first 2 augments) */}
        <div className="flex flex-col gap-0.5 justify-center items-center">
          {renderEntityBlock(
            getEntity(summonerOne, playerAugment1),
            isArena ? "augment" : "summoner"
          )}

          {renderEntityBlock(
            getEntity(summonerTwo, playerAugment2),
            isArena ? "augment" : "summoner"
          )}
        </div>

        {/* Right column (Runes or second 2 augments) */}
        <div className="flex flex-col gap-0.5 justify-center items-center">
          {renderEntityBlock(
            getRune(primaryRune, playerAugment3),
            isArena ? "augment" : "rune"
          )}
          {renderEntityBlock(
            getRune(
              secondaryRune && "slots" in secondaryRune
                ? { ...secondaryRune, icon: secondaryRune.icon }
                : null,
              playerAugment4
            ),
            isArena ? "augment" : "rune"
          )}
        </div>
      </div>
    </div>
  );
};

export default ChampSetup;
