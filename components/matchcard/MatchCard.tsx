"use client";

import {
  formatGameDuration,
  getGameModeDescription,
  timeAgo,
} from "@/lib/utils";
import { Participant, MatchInfo } from "../../types/matchcard";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Teams from "./Teams";
import ChampSetup from "./ChampSetup";
import TeamsMatchDetails from "./matchcard_details/TeamsMatchDetails";
import Items from "./Items";
import Stats from "./Stats";
import { StaticData } from "@/types/matchList";

const MatchCard = ({
  itemIndex,
  userPuuid,
  params,
  staticData,
}: {
  itemIndex: number;
  userPuuid: string;
  params: MatchInfo;
  staticData: StaticData;
}) => {
  if (!params || !staticData || !userPuuid) return null;

  const {
    gameCreation,
    gameDuration,
    queueId,
    gameMode,
    gameVersion,
    participants,
    teams,
  } = params;

  const { items, runes, summoners, queues, gamemodes, augments } = staticData;

  const findUserByPUUID = (
    userPuuid: string,
    participants: Participant[]
  ): Participant => {
    const user = participants.find(
      (participant) => participant.puuid === userPuuid
    );
    if (!user) {
      throw new Error(`Participant with PUUID ${userPuuid} not found.`);
    }
    return user;
  };

  const user = findUserByPUUID(userPuuid, participants);

  const shortenGameVersion = (gameVersion: string): string => {
    const parts = gameVersion.split(".");

    if (parts.length < 2) {
      throw new Error("Invalid version format");
    }

    const [major, minor] = parts;
    return `${major}.${minor}.1`;
  };

  const shorterGameVersion = shortenGameVersion(gameVersion);
  const gameType = getGameModeDescription(queueId, gameMode, queues, gamemodes);
  const howLongAgo = timeAgo(gameCreation);

  const userItems = [
    user!.item0,
    user!.item1,
    user!.item2,
    user!.item3,
    user!.item4,
    user!.item5,
    user!.item6,
  ];

  const gameResult = () => {
    const result = user!.win ?? false;
    if (result === true) {
      return "WIN";
    } else {
      return "LOSS";
    }
  };

  const formatedGameDuration = formatGameDuration(gameDuration);

  return (
    <AccordionItem
      value={`item-${itemIndex}`}
      className={`rounded-md border-none ${gameResult() === "WIN" ? "bg-matchCard-bg_win" : "bg-matchCard-bg_loss"}`}
    >
      <AccordionTrigger className={`py-2 hover:no-underline`}>
        <div className="mx-2 w-full">
          <div className="flex w-full flex-col sm:flex-row sm:justify-between">
            {/* Match summary */}
            <div className="mb-1 flex items-start justify-between sm:flex-col sm:items-center sm:justify-center sm:gap-1">
              <p className="leading-none sm:flex sm:flex-col sm:gap-0.5">
                <span
                  className={`font-bold drop-shadow-md ${gameResult() === "WIN" ? "text-secondary" : "text-matchCard-death"}`}
                >
                  {gameResult()}
                </span>
                <span className="font-light sm:hidden"> - </span>
                <span className="font-light">{formatedGameDuration}</span>
              </p>
              <div className="flex items-center justify-center gap-2 text-xs sm:flex-col sm:gap-0.5">
                <p className="font-bold leading-none">{gameType}</p>
                <p className="">
                  {user && user.placement !== undefined && user.placement > 0
                    ? `${user.placement}th`
                    : ""}
                </p>
                <p className="text-[10px] font-light leading-none">
                  {howLongAgo}
                </p>
              </div>
            </div>

            {/* Champ & details row */}
            <div className="flex justify-between sm:items-center sm:gap-6">
              {/* Left side - champion, summoners, runes */}
              <ChampSetup
                shorterGameVersion={shorterGameVersion}
                gameType={gameType}
                player={user!}
                fetchedSummoners={summoners!}
                fetchedRunes={runes!}
                fetchedAugments={augments!}
              />

              {/* Right side - items & stats */}
              <div className="flex flex-col justify-between sm:flex-row-reverse sm:gap-6">
                <Items
                  shorterGameVersion={shorterGameVersion}
                  items={userItems}
                  fetchedItems={items!}
                />
                <Stats player={user!} gameType={gameType} />
              </div>
            </div>
            <div className="flex gap-2 text-[8px] font-light leading-snug max-sm:hidden">
              <Teams
                gameType={gameType}
                participants={participants}
                shorterGameVersion={shorterGameVersion}
                userPuuid={userPuuid}
              />
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className={`mx-2 mt-1`}>
          <TeamsMatchDetails
            shorterGameVersion={shorterGameVersion}
            gameType={gameType}
            participants={participants}
            userPuuid={userPuuid}
            fetchedSummoners={summoners!}
            fetchedAugments={augments!}
            fetchedRunes={runes!}
            fetchedItems={items!}
            teams={teams}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default MatchCard;
