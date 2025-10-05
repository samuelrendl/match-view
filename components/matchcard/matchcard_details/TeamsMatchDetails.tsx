import { useMemo } from "react";
import PlayerMatchDetail from "./PlayerMatchDetail";
import {
  SummonerSpellEntity,
  RuneEntity,
  AugmentEntity,
  ItemEntity,
} from "@/types/gameEntity";
import { MatchInfo, Participant } from "@/types/matchcard";
import { getOrdinalSuffix, groupByPlacement } from "@/lib/utils";

const classicHeaders = ["KDA", "Damage", "Gold", "CS", "Vision", "Items"];
const arenaHeaders = ["KDA", "Damage", "Taken", "Gold", "Items"];

interface Group {
  coloredPart: string;
  rest: string;
  participants: Participant[];
  isWinner: boolean;
}

interface TeamsMatchDetailsProps {
  shorterGameVersion: string;
  participants: Participant[];
  userPuuid: string;
  gameType: string;
  fetchedSummoners: { data: Record<string, SummonerSpellEntity> };
  fetchedRunes: RuneEntity[];
  fetchedAugments: { augments: AugmentEntity[] };
  fetchedItems: Record<number, ItemEntity>;
  teams: MatchInfo["teams"];
  region?: string;
}

const getArenaGroups = (participants: Participant[]): Group[] => {
  const winners = participants.filter(
    (p) => p.placement >= 1 && p.placement <= 4
  );
  const losers = participants.filter(
    (p) => p.placement >= 5 && p.placement <= 8
  );

  return [...groupByPlacement(winners), ...groupByPlacement(losers)].map(
    (team) => ({
      coloredPart: getOrdinalSuffix(team[0].placement),
      rest: "",
      participants: team,
      isWinner: team[0].placement <= 4,
    })
  );
};

const getClassicGroups = (
  participants: Participant[],
  teams: MatchInfo["teams"]
): Group[] => [
  {
    coloredPart: teams[0].win ? "Victory" : "Defeat",
    rest: " (Blue Team)",
    participants: participants.filter((p) => p.teamId === 100),
    isWinner: teams[0].win,
  },
  {
    coloredPart: teams[1].win ? "Victory" : "Defeat",
    rest: " (Red Team)",
    participants: participants.filter((p) => p.teamId === 200),
    isWinner: teams[1].win,
  },
];

const TeamsMatchDetails: React.FC<TeamsMatchDetailsProps> = (props) => {
  const {
    shorterGameVersion,
    participants,
    userPuuid,
    gameType,
    fetchedSummoners,
    fetchedRunes,
    fetchedAugments,
    fetchedItems,
    teams,
    region,
  } = props;

  const headers = gameType === "Arena" ? arenaHeaders : classicHeaders;

  const groups = useMemo(() => {
    return gameType === "Arena"
      ? getArenaGroups(participants)
      : getClassicGroups(participants, teams);
  }, [gameType, participants, teams]);

  const sharedProps = {
    shorterGameVersion,
    gameType,
    userPuuid,
    fetchedSummoners,
    fetchedRunes,
    fetchedAugments,
    fetchedItems,
    region,
  };

  return (
    <div className="flex flex-col gap-2">
      {groups.map((group) => (
        <GroupDetail
          key={group.coloredPart + group.rest}
          group={group}
          headers={headers}
          {...sharedProps}
        />
      ))}
    </div>
  );
};

interface GroupDetailProps
  extends Omit<TeamsMatchDetailsProps, "participants" | "teams"> {
  group: Group;
  headers: string[];
}

const GroupDetail: React.FC<GroupDetailProps> = ({
  group,
  headers,
  gameType,
  ...props
}) => {
  const gridCols =
    gameType === "Arena"
      ? "grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr]"
      : "grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr]";

  return (
    <div className="mb-2">
      <div className={`grid w-full ${gridCols}`}>
        <h2>
          <span
            className={`font-bold ${group.isWinner ? "text-secondary" : "text-matchCard-death"}`}
          >
            {group.coloredPart}
          </span>
          <span className="font-extralight">{group.rest}</span>
        </h2>
        {headers.map((item) => (
          <p
            key={item}
            className="text-center text-sm font-light max-sm:hidden"
          >
            {item}
          </p>
        ))}
      </div>
      <div
        className={`rounded-md shadow-md ${
          group.isWinner
            ? "bg-matchCard-bg_win_detail"
            : "bg-matchCard-bg_loss_detail"
        }`}
      >
        {group.participants.map((participant) => (
          <PlayerMatchDetail
            key={participant.puuid}
            participant={participant}
            gameType={gameType}
            {...props}
          />
        ))}
      </div>
    </div>
  );
};

export default TeamsMatchDetails;
