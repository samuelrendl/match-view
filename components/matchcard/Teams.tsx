import React from "react";
import PlayerMatchDetail from "./matchcard_details/PlayerMatchDetail";
import {
  SummonerSpellEntity,
  RuneEntity,
  AugmentEntity,
  ItemEntity,
} from "@/types/gameEntity";
import { MatchInfo, Participant } from "@/types/matchcard";
import { getOrdinalSuffix, groupByPlacement } from "@/lib/utils";

// Define headers as const arrays with explicit string type
const header: string[] = ["KDA", "Damage", "Gold", "CS", "Vision", "Items"];
const arenaHeader: string[] = ["KDA", "Damage", "Taken", "Gold", "Items"];

// Define the group type for unified rendering
interface Group {
  coloredPart: string;
  rest: string;
  participants: Participant[];
  isWinner: boolean;
}

// Props for TeamsMatchDetails
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
}

const TeamsMatchDetails: React.FC<TeamsMatchDetailsProps> = ({
  shorterGameVersion,
  participants,
  userPuuid,
  gameType,
  fetchedSummoners,
  fetchedAugments,
  fetchedRunes,
  fetchedItems,
  teams,
}) => {
  const headers: string[] = gameType === "Arena" ? arenaHeader : header;

  // Initialize groups as an array of Group
  const groups: Group[] =
    gameType === "Arena"
      ? (() => {
          const winners = participants.filter(
            (p) => p.placement >= 1 && p.placement <= 4
          );
          const losers = participants.filter(
            (p) => p.placement >= 5 && p.placement <= 8
          );
          const winnerTeams = groupByPlacement(winners);
          const loserTeams = groupByPlacement(losers);
          const allTeams = [...winnerTeams, ...loserTeams];
          return allTeams.map((team) => ({
            coloredPart: getOrdinalSuffix(team[0].placement),
            rest: "",
            participants: team,
            isWinner: team[0].placement <= 4,
          }));
        })()
      : [
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

  return (
    <div className="flex flex-col gap-2">
      {groups.map((group, index) => (
        <GroupDetail
          key={index}
          group={group}
          headers={headers}
          shorterGameVersion={shorterGameVersion}
          gameType={gameType}
          userPuuid={userPuuid}
          fetchedSummoners={fetchedSummoners}
          fetchedAugments={fetchedAugments}
          fetchedRunes={fetchedRunes}
          fetchedItems={fetchedItems}
        />
      ))}
    </div>
  );
};

// Props for GroupDetail
interface GroupDetailProps
  extends Omit<TeamsMatchDetailsProps, "participants" | "teams"> {
  group: Group;
  headers: string[];
}

const GroupDetail: React.FC<GroupDetailProps> = ({
  group,
  headers,
  ...props
}) => {
  const gridColumns = `grid-cols-[2fr${headers.map(() => "_1fr").join("")}]`;
  return (
    <div className="mb-2">
      <div className={`grid w-full ${gridColumns}`}>
        <h2>
          <span
            className={`font-bold ${group.isWinner ? "text-secondary" : "text-matchCard-death"}`}
          >
            {group.coloredPart}
          </span>
          <span className="font-extralight">{group.rest}</span>
        </h2>
        {headers.map((item, index) => (
          <p
            key={index}
            className="text-center text-sm font-light max-sm:hidden"
          >
            {item}
          </p>
        ))}
      </div>
      <div
        className={`rounded-md shadow-md ${group.isWinner ? "bg-matchCard-bg_win_detail" : "bg-matchCard-bg_loss_detail"}`}
      >
        {group.participants.map((participant, i) => (
          <PlayerMatchDetail
            key={i}
            shorterGameVersion={props.shorterGameVersion}
            gameType={props.gameType}
            participant={participant}
            userPuuid={props.userPuuid}
            fetchedSummoners={props.fetchedSummoners}
            fetchedAugments={props.fetchedAugments}
            fetchedRunes={props.fetchedRunes}
            fetchedItems={props.fetchedItems}
          />
        ))}
      </div>
    </div>
  );
};

export default TeamsMatchDetails;
