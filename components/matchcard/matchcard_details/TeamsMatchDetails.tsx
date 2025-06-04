import React from "react";
import PlayerMatchDetail from "./PlayerMatchDetail";
import {
  SummonerSpellEntity,
  RuneEntity,
  AugmentEntity,
  ItemEntity,
} from "@/types/gameEntity";
import { MatchInfo, Participant } from "@/types/matchcard";
import { groupByPlacement } from "@/lib/utils";

const header = ["KDA", "Damage", "Gold", "CS", "Vision", "Items"];

const TeamsMatchDetails = ({
  shorterGameVersion,
  participants,
  userPuuid,
  gameType,
  fetchedSummoners,
  fetchedAugments,
  fetchedRunes,
  fetchedItems,
  teams,
}: {
  shorterGameVersion: string;
  participants: Participant[];
  userPuuid: string;
  gameType: string;
  fetchedSummoners: { data: Record<string, SummonerSpellEntity> };
  fetchedRunes: RuneEntity[];
  fetchedAugments: { augments: AugmentEntity[] };
  fetchedItems: Record<number, ItemEntity>;
  teams: MatchInfo["teams"];
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
        <div className="flex flex-col gap-2">
          <div>
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] w-full max-sm:hidden">
              <h2 className="">
                <span
                  className={`font-bold ${teams[0].win ? "text-secondary" : "text-matchCard-death"}`}
                >
                  {teams[0].win ? "Victory" : "Defeat"}{" "}
                </span>
                <span className="font-extralight">(Blue Team)</span>
              </h2>
              {header.map((item, index) => (
                <p key={index} className="text-sm font-light text-center">
                  {item}
                </p>
              ))}
            </div>

            <div className="flex flex-col gap-0.5">
              {participants
                .filter((participant) => participant.teamId === 100)
                .map((participant, index) => (
                  <div
                    key={index}
                    className={`rounded-md shadow-md ${teams[0].win ? "bg-matchCard-bg_win_detail" : "bg-matchCard-bg_loss_detail"}`}
                  >
                    <PlayerMatchDetail
                      shorterGameVersion={shorterGameVersion}
                      gameType={gameType}
                      participant={participant}
                      userPuuid={userPuuid}
                      fetchedSummoners={fetchedSummoners}
                      fetchedAugments={fetchedAugments}
                      fetchedRunes={fetchedRunes}
                      fetchedItems={fetchedItems}
                    />
                  </div>
                ))}
            </div>
          </div>
          <div className="">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] w-full max-sm:hidden">
              <h2 className="min-w-36">
                <span
                  className={`font-bold ${teams[1].win ? "text-secondary" : "text-matchCard-death"}`}
                >
                  {teams[1].win ? "Victory" : "Defeat"}{" "}
                </span>
                <span className="font-light">(Red Team)</span>
              </h2>

              {header.map((item, index) => (
                <p key={index} className="text-sm font-light text-center">
                  {item}
                </p>
              ))}
            </div>
            <div className="flex flex-col gap-0.5">
              {participants
                .filter((participant) => participant.teamId === 200)
                .map((participant, index) => (
                  <div
                    key={index}
                    className={`rounded-md shadow-md ${teams[1].win ? "bg-matchCard-bg_win_detail" : "bg-matchCard-bg_loss_detail"}`}
                  >
                    <PlayerMatchDetail
                      shorterGameVersion={shorterGameVersion}
                      gameType={gameType}
                      participant={participant}
                      userPuuid={userPuuid}
                      fetchedSummoners={fetchedSummoners}
                      fetchedAugments={fetchedAugments}
                      fetchedRunes={fetchedRunes}
                      fetchedItems={fetchedItems}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TeamsMatchDetails;
