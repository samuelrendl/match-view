import React from "react";
import PlayerMatchDetail from "./PlayerMatchDetail";
import {
  SummonerSpellEntity,
  RuneEntity,
  AugmentEntity,
  ItemEntity,
} from "@/types/gameEntity";
import { MatchInfo, Participant } from "@/types/matchcard";
import { getOrdinalSuffix, groupByPlacement } from "@/lib/utils";

const header = ["KDA", "Damage", "Gold", "CS", "Vision", "Items"];
const arenaHeader = ["KDA", "Damage", "Taken", "Gold", "Items"];

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
          {winnerTeams.map((team, index) => (
            <div key={`winner-${index}`} className="mb-2">
              <div className="grid w-full grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr]">
                <h2>
                  <span className={`text-secondary`}>
                    {getOrdinalSuffix(team[0]?.placement)}{" "}
                  </span>
                  <span className="font-extralight"></span>
                </h2>
                {arenaHeader.map((item, index) => (
                  <p
                    key={index}
                    className="text-center text-sm font-light max-sm:hidden"
                  >
                    {item}
                  </p>
                ))}
              </div>
              <div
                className={`rounded-md shadow-md ${"bg-matchCard-bg_win_detail"}`}
              >
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
            </div>
          ))}

          {loserTeams.map((team, index) => (
            <div key={`loser-${index}`} className="mb-2">
              <div className="grid w-full grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr]">
                <h2>
                  <span className={`text-matchCard-death`}>
                    {getOrdinalSuffix(team[0]?.placement)}{" "}
                  </span>
                  <span className="font-extralight"></span>
                </h2>
                {arenaHeader.map((item, index) => (
                  <p
                    key={index}
                    className="text-center text-sm font-light max-sm:hidden"
                  >
                    {item}
                  </p>
                ))}
              </div>
              <div
                className={`rounded-md shadow-md ${"bg-matchCard-bg_loss_detail"}`}
              >
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
            </div>
          ))}
        </>
      ) : (
        <div className="flex flex-col gap-2">
          <div>
            <div className="grid w-full grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] max-sm:hidden">
              <h2 className="">
                <span
                  className={`font-bold ${teams[0].win ? "text-secondary" : "text-matchCard-death"}`}
                >
                  {teams[0].win ? "Victory" : "Defeat"}{" "}
                </span>
                <span className="font-extralight">(Blue Team)</span>
              </h2>
              {header.map((item, index) => (
                <p key={index} className="text-center text-sm font-light">
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
          <div>
            <div className="grid w-full grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] max-sm:hidden">
              <h2 className="min-w-36">
                <span
                  className={`font-bold ${teams[1].win ? "text-secondary" : "text-matchCard-death"}`}
                >
                  {teams[1].win ? "Victory" : "Defeat"}{" "}
                </span>
                <span className="font-light">(Red Team)</span>
              </h2>

              {header.map((item, index) => (
                <p key={index} className="text-center text-sm font-light">
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
