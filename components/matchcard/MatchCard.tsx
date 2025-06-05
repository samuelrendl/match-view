import { formatGameDuration, timeAgo } from "@/lib/utils";
import { Participant, MatchInfo } from "../../types/matchcard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  fetchAugments,
  fetchItems,
  fetchQueueId,
  fetchRunes,
  fetchSummonerSpells,
} from "@/utils/api";
import Teams from "./Teams";
import ChampSetup from "./ChampSetup";
import TeamsMatchDetails from "./matchcard_details/TeamsMatchDetails";
import Items from "./Items";
import Stats from "./Stats";

const findUserByPUUID = (
  userPuuid: string,
  participants: Participant[]
): Participant | undefined => {
  return participants.find((participant) => participant.puuid === userPuuid);
};

const MatchCard = async ({
  userPuuid,
  params,
}: {
  userPuuid: string;
  params: MatchInfo;
}) => {
  const {
    gameCreation,
    gameDuration,
    queueId,
    gameMode,
    gameVersion,
    participants,
    teams,
  } = params;
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

  const [
    fetchedItems,
    fetchedSummoners,
    fetchedRunes,
    gameType,
    fetchedAugments,
  ] = await Promise.all([
    fetchItems(shorterGameVersion),
    fetchSummonerSpells(shorterGameVersion),
    fetchRunes(shorterGameVersion),
    fetchQueueId(queueId, gameMode),
    fetchAugments(),
  ]);

  const howLongAgo = timeAgo(gameCreation);

  const items = [
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
    <Accordion type="single" collapsible>
      <AccordionItem
        value="item-1"
        className={`border-none rounded-md ${gameResult() === "WIN" ? "bg-matchCard-bg_win" : "bg-matchCard-bg_loss"}`}
      >
        <AccordionTrigger className={`py-2 hover:no-underline`}>
          <div className="w-full mx-2">
            <div className="flex w-full flex-col sm:flex-row sm:justify-between">
              {/* Match summary */}
              <div className="flex justify-between items-start mb-1 sm:flex-col sm:justify-center sm:items-center sm:gap-1">
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
                    {user?.placement! > 0 ? `${user?.placement!}th` : ""}
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
                  fetchedSummoners={fetchedSummoners}
                  fetchedRunes={fetchedRunes}
                  fetchedAugments={fetchedAugments}
                />

                {/* Right side - items & stats */}
                <div className="flex flex-col justify-between sm:flex-row-reverse sm:gap-6">
                  <Items
                    shorterGameVersion={shorterGameVersion}
                    items={items}
                    fetchedItems={fetchedItems}
                  />
                  <Stats player={user!} gameType={gameType} />
                </div>
              </div>
              <div className="max-sm:hidden flex gap-2 text-[8px] font-light leading-snug">
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
          <div className={`mt-1 mx-2`}>
            <TeamsMatchDetails
              shorterGameVersion={shorterGameVersion}
              gameType={gameType}
              participants={participants}
              userPuuid={userPuuid}
              fetchedSummoners={fetchedSummoners}
              fetchedAugments={fetchedAugments}
              fetchedRunes={fetchedRunes}
              fetchedItems={fetchedItems}
              teams={teams}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default MatchCard;
