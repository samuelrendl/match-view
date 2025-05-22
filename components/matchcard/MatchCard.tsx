import { formatGameDuration, kdaRatioCal, timeAgo } from "@/lib/utils";
import { Participant, MatchCardProps } from "../../types/matchcard";
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
import GameEntity from "../GameEntity";
import Teams from "./Teams";
import ChampSetup from "./ChampSetup";
import TeamsMatchDetails from "./matchcard_details/TeamsMatchDetails";

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
  params: MatchCardProps["params"];
}) => {
  const {
    info: {
      gameCreation,
      gameDuration,
      queueId,
      gameMode,
      gameVersion,
      participants,
    },
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

  const fetchedItems = await fetchItems(shorterGameVersion);
  const fetchedSummoners = await fetchSummonerSpells(shorterGameVersion);
  const fetchedRunes = await fetchRunes(shorterGameVersion);
  const gameType = await fetchQueueId(queueId, gameMode);
  const fetchedAugments = await fetchAugments();
  const howLongAgo = timeAgo(gameCreation);

  const kdaRatio = kdaRatioCal(
    user?.kills ?? 0,
    user?.assists ?? 0,
    user?.deaths ?? 0
  );

  const items = [
    user?.item0,
    user?.item1,
    user?.item2,
    user?.item3,
    user?.item4,
    user?.item5,
    user?.item6,
  ];

  const gameResult = () => {
    const result = user?.win ?? false;
    if (result === true) {
      return "WIN";
    } else {
      return "LOSS";
    }
  };

  const formatedGameDuration = formatGameDuration(gameDuration);

  return (
    <Accordion
      type="single"
      collapsible
      className={`rounded-md ${gameResult() === "WIN" ? "bg-matchCard-bg_win" : "bg-matchCard-bg_loss "}`}
    >
      <AccordionItem value="item-1" className="mx-2 border-none">
        <AccordionTrigger className="py-2 hover:no-underline">
          <div className="w-full">
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-between">
              {/* Match summary */}
              <div className="flex justify-between sm:flex-col sm:justify-center sm:items-center">
                <p className="sm:flex sm:flex-col">
                  <span
                    className={`font-bold drop-shadow-md ${gameResult() === "WIN" ? "text-secondary" : "text-matchCard-death"}`}
                  >
                    {gameResult()}
                  </span>
                  <span className="font-light sm:hidden"> - </span>
                  <span className="font-light">{formatedGameDuration}</span>
                </p>
                <div className="flex items-center justify-center gap-2 text-xs sm:flex-col sm:gap-0">
                  <p className="font-bold">{gameType}</p>
                  <p className="">
                    {user?.placement! > 0 ? `${user?.placement}th` : ""}
                  </p>
                  <p className="text-[10px] font-light">{howLongAgo}</p>
                </div>
              </div>

              {/* Champ & details row */}
              <div className="flex justify-between items-center sm:gap-6">
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
                <div
                  className={`flex flex-col gap-2 ${gameType === "Arena" ? "sm:flex-col-reverse sm:gap-2 sm:justify-center sm:items-center" : "sm:flex-row sm:gap-6"}`}
                >
                  {/* Items */}
                  {/* Mobile */}
                  <div className="grid grid-flow-col gap-0.5 sm:hidden">
                    {items.map((item, index) => (
                      <div
                        key={`item-${index}`}
                        className="relative size-5 rounded-sm bg-black/50"
                      >
                        <GameEntity
                          entity={fetchedItems[item!]}
                          gameVersion={shorterGameVersion}
                          type="item"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Tablet and bigger */}
                  <div className="hidden sm:flex sm:flex-col sm:justify-center sm:gap-0.5 sm:w-fit">
                    {/* top row: items 1,2,3 and then 7 */}
                    <div className="flex gap-0.5">
                      {[0, 1, 2, 6].map((i) => (
                        <div
                          key={`item-${i}`}
                          className="relative rounded-sm bg-black/50 size-5 sm:size-6"
                        >
                          <GameEntity
                            entity={fetchedItems[items[i]!]}
                            gameVersion={shorterGameVersion}
                            type="item"
                          />
                        </div>
                      ))}
                    </div>

                    {/* bottom row: items 4,5,6 */}
                    <div className="flex gap-0.5">
                      {[3, 4, 5].map((i) => (
                        <div
                          key={`item-${i}`}
                          className="relative rounded-sm bg-black/50 size-5 sm:size-6"
                        >
                          <GameEntity
                            entity={fetchedItems[items[i]!]}
                            gameVersion={shorterGameVersion}
                            type="item"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* KDA + CS */}
                  <div className="ml-auto mr-0 flex gap-3 text-xs sm:flex-col sm:ml-0 sm:gap-0.5">
                    <p className="font-semibold">
                      {user?.kills}{" "}
                      <span className="font-light text-neutral-500">/</span>{" "}
                      <span className="text-matchCard-death">
                        {user?.deaths}
                      </span>{" "}
                      <span className="font-light text-neutral-500">/</span>{" "}
                      {user?.assists}
                    </p>
                    <div className="flex items-center gap-3 sm:flex-col sm:gap-0.5">
                      <p className="font-semibold">
                        {kdaRatio} <span className="font-light">KDA</span>
                      </p>
                      <p className={`${gameType === "Arena" ? "hidden" : ""}`}>
                        {user?.totalMinionsKilled}{" "}
                        <span className="font-light">CS</span>
                      </p>
                      <p
                        className={`max-sm:hidden ${gameType === "Arena" ? "hidden" : ""}`}
                      >
                        {user?.visionScore}{" "}
                        <span className="font-light">vision</span>
                      </p>
                    </div>
                  </div>
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
        <AccordionContent
          className={`${gameResult() === "WIN" ? "bg-matchCard-bg_win_detail" : "bg-matchCard-bg_loss_detail"}`}
        >
          <div className="">
            <TeamsMatchDetails
              shorterGameVersion={shorterGameVersion}
              gameType={gameType}
              participants={participants}
              userPuuid={userPuuid}
              fetchedSummoners={fetchedSummoners}
              fetchedAugments={fetchedAugments}
              fetchedRunes={fetchedRunes}
              fetchedItems={fetchedItems}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default MatchCard;
