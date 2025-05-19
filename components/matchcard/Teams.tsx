import Player from "@/components/matchcard/Player";
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
  // Step 1: Filter winners and losers
  const winners = participants.filter(
    (p) => p.placement >= 1 && p.placement <= 4
  );
  const losers = participants.filter(
    (p) => p.placement >= 5 && p.placement <= 8
  );

  // Step 2: Group by placement
  const groupByPlacement = (group: Participant[]) => {
    const map: Record<number, Participant[]> = {};
    for (const player of group) {
      if (!map[player.placement]) {
        map[player.placement] = [];
      }
      map[player.placement].push(player);
    }

    return Object.keys(map)
      .map(Number)
      .sort((a, b) => a - b)
      .map((placement) => map[placement]);
  };

  const winnerTeams = groupByPlacement(winners);
  const loserTeams = groupByPlacement(losers);

  return (
    <>
      {gameType === "Arena" ? (
        <>
          <div className="flex flex-col">
            <h2 className="text-sm font-semibold text-secondary">Win</h2>
            <div className="flex flex-col justify-center gap-2">
              <div className="flex flex-col flex-wrap w-32 h-16 gap-1">
                {winnerTeams.map((team, index) => (
                  <div key={`winner-${index}`} className="flex flex-col w-16">
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
          </div>
          <div>
            <h2 className="text-sm font-bold text-matchCard-death">Loss</h2>
            <div className="flex flex-col justify-center gap-2">
              <div className="flex flex-col flex-wrap w-32 h-16 gap-1">
                {loserTeams.map((team, index) => (
                  <div key={`loser-${index}`} className="flex flex-col w-16">
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
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-0.5">
            {participants
              .filter((participant) => participant.teamId === 100)
              .map((participant, index) => (
                <Player
                  key={index}
                  shorterGameVersion={shorterGameVersion}
                  participant={participant}
                  userPuuid={userPuuid}
                />
              ))}
          </div>
          <div className="flex flex-col gap-0.5">
            {participants
              .filter((participant) => participant.teamId === 200)
              .map((participant, index) => (
                <Player
                  key={index}
                  shorterGameVersion={shorterGameVersion}
                  participant={participant}
                  userPuuid={userPuuid}
                />
              ))}
          </div>
        </>
      )}
    </>
  );
};

export default Teams;
