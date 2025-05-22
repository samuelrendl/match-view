import Image from "next/image";
import { Participant } from "../../../types/matchcard";
import ChampSetup from "../ChampSetup";
import {
  SummonerSpellEntity,
  RuneEntity,
  AugmentEntity,
  ItemEntity,
} from "@/types/gameEntity";
import Stats from "../Stats";
import Items from "../Items";

const PlayerMatchDetail = ({
  shorterGameVersion,
  participant,
  gameType,
  userPuuid,
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

  return (
    <div className="flex">
      <ChampSetup
        shorterGameVersion={shorterGameVersion}
        player={participant}
        gameType={gameType}
        fetchedAugments={fetchedAugments}
        fetchedRunes={fetchedRunes}
        fetchedSummoners={fetchedSummoners}
      />
      <div>
        <p>{participant.riotIdGameName}</p>
        <Stats player={participant} gameType={gameType} />
      </div>
      <div>
        <Items
          shorterGameVersion={shorterGameVersion}
          gameType={gameType}
          items={items}
          fetchedItems={fetchedItems}
        />
        <p>{participant.totalDamageDealtToChampions}</p>
      </div>
    </div>
  );
};

export default PlayerMatchDetail;
