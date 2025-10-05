import React from "react";
import Player from "@/components/matchcard/Player";
import { groupByPlacement } from "@/lib/utils";
import { Participant } from "@/types/matchcard";

// Props interface for Teams component
interface TeamsProps {
  gameType: string;
  participants: Participant[];
  shorterGameVersion: string;
  userPuuid: string;
  region?: string;
}

const Teams: React.FC<TeamsProps> = ({
  gameType,
  participants,
  shorterGameVersion,
  userPuuid,
  region,
}) => {
  const playerProps = { shorterGameVersion, userPuuid, region };

  return (
    <>
      {gameType === "Arena" ? (
        <>
          <div className="flex flex-col">
            <h2 className="text-sm font-semibold text-secondary">Win</h2>
            <div className="grid grid-flow-col grid-rows-2 gap-1.5">
              {groupByPlacement(
                participants.filter((p) => p.placement >= 1 && p.placement <= 4)
              ).map((team, index) => (
                <div key={`winner-${index}`} className="flex w-20 flex-col">
                  {team.map((participant, i) => (
                    <Player
                      key={i}
                      participant={participant}
                      {...playerProps}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-bold text-matchCard-death">Loss</h2>
            <div className="grid grid-flow-col grid-rows-2 gap-1.5">
              {groupByPlacement(
                participants.filter((p) => p.placement >= 5 && p.placement <= 8)
              ).map((team, index) => (
                <div key={`loser-${index}`} className="flex w-20 flex-col">
                  {team.map((participant, i) => (
                    <Player
                      key={i}
                      participant={participant}
                      {...playerProps}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {[
            participants.filter((p) => p.teamId === 100),
            participants.filter((p) => p.teamId === 200),
          ].map((team, teamIndex) => (
            <div key={teamIndex} className="flex flex-col gap-0.5">
              {team.map((participant, index) => (
                <div key={index} className="w-24">
                  <Player participant={participant} {...playerProps} />
                </div>
              ))}
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default Teams;
