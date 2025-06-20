import Player from "@/components/matchcard/Player";
import { groupByPlacement } from "@/lib/utils";
import { Participant } from "@/types/matchcard";

const Teams = ({
  gameType,
  participants,
  shorterGameVersion,
  userPuuid,
}: {
  gameType: string;
  participants: Participant[];
  shorterGameVersion: string;
  userPuuid: string;
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
          <div className="flex flex-col">
            <h2 className="text-sm font-semibold text-secondary">Win</h2>
            <div className="grid grid-flow-col grid-rows-2 gap-1.5">
              {winnerTeams.map((team, index) => (
                <div key={`winner-${index}`} className="flex w-20 flex-col">
                  {team.map((participant, i) => (
                    <Player
                      key={i}
                      participant={participant}
                      userPuuid={userPuuid}
                      shorterGameVersion={shorterGameVersion}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-bold text-matchCard-death">Loss</h2>
            <div className="grid grid-flow-col grid-rows-2 gap-1.5">
              {loserTeams.map((team, index) => (
                <div key={`loser-${index}`} className="flex w-20 flex-col">
                  {team.map((participant, i) => (
                    <Player
                      key={i}
                      participant={participant}
                      userPuuid={userPuuid}
                      shorterGameVersion={shorterGameVersion}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-0.5">
            {participants
              .filter((participant) => participant.teamId === 100)
              .map((participant, index) => (
                <div key={index} className="w-24">
                  <Player
                    shorterGameVersion={shorterGameVersion}
                    participant={participant}
                    userPuuid={userPuuid}
                  />
                </div>
              ))}
          </div>
          <div className="flex flex-col gap-0.5">
            {participants
              .filter((participant) => participant.teamId === 200)
              .map((participant, index) => (
                <div key={index} className="w-24">
                  <Player
                    shorterGameVersion={shorterGameVersion}
                    participant={participant}
                    userPuuid={userPuuid}
                  />
                </div>
              ))}
          </div>
        </>
      )}
    </>
  );
};

export default Teams;
