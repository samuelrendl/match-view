import { Participant } from "../../../types/matchcard";
import ChampSetup from "../ChampSetup";
import {
  SummonerSpellEntity,
  RuneEntity,
  AugmentEntity,
  ItemEntity,
} from "@/types/gameEntity";
import Items from "../Items";
import { kdaRatioCal } from "@/lib/utils";

const PlayerMatchDetail = ({
  shorterGameVersion,
  participant,
  gameType,
  fetchedSummoners,
  fetchedAugments,
  fetchedRunes,
  fetchedItems,
}: {
  shorterGameVersion: string;
  participant: Participant;
  gameType: string;
  userPuuid: string;
  fetchedSummoners: { data: Record<string, SummonerSpellEntity> };
  fetchedRunes: RuneEntity[];
  fetchedAugments: { augments: AugmentEntity[] };
  fetchedItems: Record<number, ItemEntity>;
}) => {
  const items = [
    participant?.item0,
    participant?.item1,
    participant?.item2,
    participant?.item3,
    participant?.item4,
    participant?.item5,
    participant?.item6,
  ];

  const kdaRatio = kdaRatioCal(
    participant.kills ?? 0,
    participant.assists ?? 0,
    participant.deaths ?? 0
  );

  return (
    <div
      className={`grid grid-cols-[75px_80px_1fr] p-1 text-[10px] ${gameType === "Arena" ? "sm:grid-cols-7" : "sm:grid-cols-8"} sm:justify-items-center sm:self-center sm:p-0 sm:py-1`}
    >
      <div className="row-span-2 self-center sm:row-span-1 sm:justify-self-center">
        <ChampSetup
          shorterGameVersion={shorterGameVersion}
          player={participant}
          gameType={gameType}
          fetchedAugments={fetchedAugments}
          fetchedRunes={fetchedRunes}
          fetchedSummoners={fetchedSummoners}
          size="sm"
        />
      </div>
      <a
        href={`/search?username=${participant.riotIdGameName}%23${participant.riotIdTagline}`}
        target="_blank"
        className={`max-w-14 truncate sm:max-w-none sm:justify-self-start sm:font-semibold`}
      >
        {participant.riotIdGameName}
      </a>
      <div className="order-2 flex w-32 gap-4 sm:order-none sm:w-auto sm:flex-col sm:justify-center sm:gap-0">
        <p className="font-semibold">
          {participant.kills}{" "}
          <span className="font-light text-neutral-500">/</span>{" "}
          <span className="text-matchCard-death">{participant.deaths}</span>{" "}
          <span className="font-light text-neutral-500">/</span>{" "}
          {participant.assists}
        </p>
        <p className="font-semibold">
          {kdaRatio} <span className="font-light">KDA</span>
        </p>
      </div>
      <p className="order-6 self-center justify-self-end sm:order-none sm:justify-self-center">
        {participant.totalDamageDealtToChampions}{" "}
        <span className="sm:hidden">DMG</span>
      </p>
      <p
        className={`${gameType === "Arena" ? "self-center justify-self-end sm:order-none sm:justify-self-center" : "hidden"}`}
      >
        {participant.totalDamageTaken} <span className="sm:hidden">DMG</span>
      </p>
      <p className="max-sm:hidden sm:self-center sm:justify-self-center">
        {participant.goldEarned}
      </p>
      <p
        className={`${gameType === "Arena" ? "hidden" : "hidden sm:block sm:self-center sm:justify-self-center"}`}
      >
        {participant.totalMinionsKilled}{" "}
        <span className="font-light sm:hidden">CS</span>
      </p>
      <p
        className={`max-sm:hidden ${gameType === "Arena" ? "hidden" : "sm:self-center sm:justify-self-center"}`}
      >
        {participant.visionScore}{" "}
        <span className="font-light sm:hidden">vision</span>
      </p>
      <div className="self-center justify-self-end sm:justify-self-center">
        <Items
          shorterGameVersion={shorterGameVersion}
          size="sm"
          items={items}
          fetchedItems={fetchedItems}
        />
      </div>
    </div>
  );
};

export default PlayerMatchDetail;
