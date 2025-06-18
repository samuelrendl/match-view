import { kdaRatioCal } from "@/lib/utils";
import { Participant } from "@/types/matchcard";

const Stats = ({
  player,
  gameType,
}: {
  player: Participant;
  gameType: string;
}) => {
  const kdaRatio = kdaRatioCal(
    player.kills ?? 0,
    player.assists ?? 0,
    player.deaths ?? 0
  );

  return (
    <div className="ml-auto mr-0 flex gap-3 text-xs sm:ml-0 sm:flex-col sm:gap-0.5">
      <p className="font-semibold">
        {player.kills} <span className="font-light text-neutral-500">/</span>{" "}
        <span className="text-matchCard-death">{player.deaths}</span>{" "}
        <span className="font-light text-neutral-500">/</span> {player.assists}
      </p>
      <div className="flex items-center gap-3 sm:flex-col sm:gap-0.5">
        <p className="font-semibold">
          {kdaRatio} <span className="font-light">KDA</span>
        </p>
        <p className={`${gameType === "Arena" ? "hidden" : ""}`}>
          {player.totalMinionsKilled} <span className="font-light">CS</span>
        </p>
        <p className={`max-sm:hidden ${gameType === "Arena" ? "hidden" : ""}`}>
          {player.visionScore} <span className="font-light">vision</span>
        </p>
      </div>
    </div>
  );
};

export default Stats;
