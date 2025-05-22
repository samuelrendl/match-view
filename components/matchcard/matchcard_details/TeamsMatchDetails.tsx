import React from "react";
import PlayerMatchDetail from "./PlayerMatchDetail";
import {
  SummonerSpellEntity,
  RuneEntity,
  AugmentEntity,
  ItemEntity,
} from "@/types/gameEntity";
import { Participant } from "@/types/matchcard";
import { groupByPlacement } from "@/lib/utils";

const TeamsMatchDetails = ({
  shorterGameVersion,
  participants,
  userPuuid,
  gameType,
  fetchedSummoners,
  fetchedAugments,
  fetchedRunes,
  fetchedItems,
}: {
  shorterGameVersion: string;
  participants: Participant[];
  userPuuid: string;
  gameType: string;
  fetchedSummoners: { data: Record<string, SummonerSpellEntity> };
  fetchedRunes: RuneEntity[];
  fetchedAugments: { augments: AugmentEntity[] };
  fetchedItems: Record<number, ItemEntity>;
}) => {
  const winners = participants.filter(
    (p) => p.placement >= 1 && p.placement <= 4
  );
  const losers = participants.filter(
    (p) => p.placement >= 5 && p.placement <= 8
  );

  const winnerTeams = groupByPlacement(winners);
  const loserTeams = groupByPlacement(losers);

  return (
    <>
      {gameType === "Arena" ? (
        <>
          <div className="">
            <h2 className="text-sm font-semibold text-secondary">Win</h2>
            <div className="">
              <div className="">
                {winnerTeams.map((team, index) => (
                  <div key={`winner-${index}`} className="">
                    {team.map((participant, i) => (
                      <PlayerMatchDetail
                        key={i}
                        shorterGameVersion={shorterGameVersion}
                        gameType={gameType}
                        participant={participant}
                        userPuuid={userPuuid}
                        fetchedSummoners={fetchedSummoners}
                        fetchedAugments={fetchedAugments}
                        fetchedRunes={fetchedRunes}
                        fetchedItems={fetchedItems}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-bold text-matchCard-death">Loss</h2>
            <div className="">
              <div className="">
                {loserTeams.map((team, index) => (
                  <div key={`loser-${index}`} className="">
                    {team.map((participant, i) => (
                      <PlayerMatchDetail
                        key={i}
                        shorterGameVersion={shorterGameVersion}
                        gameType={gameType}
                        participant={participant}
                        userPuuid={userPuuid}
                        fetchedSummoners={fetchedSummoners}
                        fetchedAugments={fetchedAugments}
                        fetchedRunes={fetchedRunes}
                        fetchedItems={fetchedItems}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="">
            {participants
              .filter((participant) => participant.teamId === 100)
              .map((participant, index) => (
                <PlayerMatchDetail
                  key={index}
                  shorterGameVersion={shorterGameVersion}
                  gameType={gameType}
                  participant={participant}
                  userPuuid={userPuuid}
                  fetchedSummoners={fetchedSummoners}
                  fetchedAugments={fetchedAugments}
                  fetchedRunes={fetchedRunes}
                  fetchedItems={fetchedItems}
                />
              ))}
          </div>
          <div className="">
            {participants
              .filter((participant) => participant.teamId === 200)
              .map((participant, index) => (
                <PlayerMatchDetail
                  key={index}
                  shorterGameVersion={shorterGameVersion}
                  gameType={gameType}
                  participant={participant}
                  userPuuid={userPuuid}
                  fetchedSummoners={fetchedSummoners}
                  fetchedAugments={fetchedAugments}
                  fetchedRunes={fetchedRunes}
                  fetchedItems={fetchedItems}
                />
              ))}
          </div>
        </>
      )}
    </>
  );
};

export default TeamsMatchDetails;
