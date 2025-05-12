import {
  findAugmentById,
  findRuneOrTreeById,
  findSummonerByKey,
  formatGameDuration,
  kdaRatioCal,
  timeAgo,
} from "@/lib/utils";
import { Participant, MatchCardProps } from "../types/matchcard";
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
import Image from "next/image";
import GameEntity from "./GameEntity";

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

  const howLongAgo = timeAgo(gameCreation);

  // Find the matching user in the participants array
  const user = findUserByPUUID(userPuuid, participants);
  const kdaRatio = kdaRatioCal(
    user?.kills ?? 0,
    user?.assists ?? 0,
    user?.deaths ?? 0
  );

  const shortenGameVersion = (gameVersion: string): string => {
    const parts = gameVersion.split(".");

    // Make sure we at least have major and minor version parts
    if (parts.length < 2) {
      throw new Error("Invalid version format");
    }

    const [major, minor] = parts;
    // Here we set the patch number to "1" regardless of the build or revision.
    return `${major}.${minor}.1`;
  };

  const shorterGameVersion = shortenGameVersion(gameVersion);

  const fetchedItems = await fetchItems(shorterGameVersion);
  const fetchedSummoners = await fetchSummonerSpells(shorterGameVersion);
  const fetchedRunes = await fetchRunes(shorterGameVersion);
  const gameType = await fetchQueueId(queueId, gameMode);
  const fetchedAugments = await fetchAugments();

  const items = [
    user?.item0,
    user?.item1,
    user?.item2,
    user?.item3,
    user?.item4,
    user?.item5,
    user?.item6,
  ];

  const playerAugment1 = findAugmentById(
    user?.playerAugment1 ?? 0,
    fetchedAugments
  );
  const playerAugment2 = findAugmentById(
    user?.playerAugment2 ?? 0,
    fetchedAugments
  );
  const playerAugment3 = findAugmentById(
    user?.playerAugment3 ?? 0,
    fetchedAugments
  );
  const playerAugment4 = findAugmentById(
    user?.playerAugment4 ?? 0,
    fetchedAugments
  );

  const primaryRune = findRuneOrTreeById(
    user?.perks.styles[0].selections[0].perk ?? 0,
    fetchedRunes
  );
  const secondaryRune = findRuneOrTreeById(
    user?.perks.styles[1].style ?? 0,
    fetchedRunes
  );

  const summonerOne = findSummonerByKey(
    user?.summoner1Id ?? 0,
    fetchedSummoners
  );
  const summonerTwo = findSummonerByKey(
    user?.summoner2Id ?? 0,
    fetchedSummoners
  );

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
              <div className="flex justify-between sm:flex-col">
                <p>
                  <span
                    className={`font-bold drop-shadow-md ${gameResult() === "WIN" ? "text-secondary" : "text-matchCard-death"}`}
                  >
                    {gameResult()}
                  </span>
                  <span className="font-light"> - {formatedGameDuration}</span>
                </p>
                <div className="flex items-center justify-center gap-2 text-xs sm:flex-col sm:gap-0">
                  <p className="font-bold">{gameType}</p>
                  <p className="text-[10px] font-light">{howLongAgo}</p>
                  <p className="">25 LP</p>
                </div>
              </div>

              {/* Champ & details row */}
              <div className="flex justify-between items-center sm:gap-6">
                {/* Left side - champion, summoners, runes */}
                <div className=" flex justify-between gap-0.5">
                  {/* Champion */}
                  <div className="relative drop-shadow-lg">
                    <Image
                      src={`https://ddragon.leagueoflegends.com/cdn/${shorterGameVersion}/img/champion/${user?.championName}.png`}
                      alt={`${user?.championName}`}
                      width={42}
                      height={42}
                      className="rounded object-contain"
                    />
                    <div className="absolute bottom-0 left-0 w-4 rounded-sm bg-black/50 text-center text-[10px] font-bold leading-snug text-white">
                      {user?.champLevel}
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {/* Summoners */}
                    <div className="flex flex-col gap-0.5">
                      <div className="size-5 rounded-sm bg-black/50">
                        <GameEntity
                          entity={
                            gameType === "Arena" ? playerAugment1 : summonerOne
                          }
                          type={gameType === "Arena" ? "augment" : "summoner"}
                          gameVersion={shorterGameVersion}
                        />
                      </div>
                      <div className="size-5 rounded-sm bg-black/50">
                        <GameEntity
                          entity={
                            gameType === "Arena" ? playerAugment2 : summonerTwo
                          }
                          type={gameType === "Arena" ? "augment" : "summoner"}
                          gameVersion={shorterGameVersion}
                        />
                      </div>
                    </div>
                    {/* Runes */}
                    <div className="flex flex-col gap-0.5">
                      <div className="size-5 rounded-sm bg-black/50">
                        <GameEntity
                          entity={
                            gameType === "Arena" ? playerAugment3 : primaryRune
                          }
                          type={gameType === "Arena" ? "augment" : "rune"}
                          gameVersion={shorterGameVersion}
                        />
                      </div>
                      <div className="size-5 rounded-sm bg-black/50">
                        <GameEntity
                          entity={
                            gameType === "Arena"
                              ? playerAugment4
                              : secondaryRune
                                ? { ...secondaryRune, icon: secondaryRune.icon }
                                : null // Fallback to null if secondaryRune is undefined
                          }
                          type={gameType === "Arena" ? "augment" : "rune"}
                          gameVersion={shorterGameVersion}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - items & stats */}
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
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
                          className="relative size-5 rounded-sm bg-black/50"
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
                          className="relative size-5 rounded-sm bg-black/50"
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
                  <div className="ml-auto mr-0 flex gap-3 text-xs sm:flex-col sm:gap-0.5">
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
                      <p className="">
                        {user?.totalMinionsKilled}{" "}
                        <span className="font-light">CS</span>
                      </p>
                      <p className="max-sm:hidden">
                        {user?.visionScore}{" "}
                        <span className="font-light">vision</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="max-sm:hidden flex gap-2 text-[8px] font-light leading-snug">
                <div className="flex flex-col gap-0.5">
                  {participants
                    .filter((participant) => participant.teamId === 100)
                    .map((participant, index) => (
                      <div key={index} className="flex gap-0.5 w-16">
                        <Image
                          src={`https://ddragon.leagueoflegends.com/cdn/${shorterGameVersion}/img/champion/${participant.championName}.png`}
                          alt={`${participant.championName}`}
                          width={15}
                          height={15}
                        />
                        <a
                          href={`/search?username=${participant.riotIdGameName}%23${participant.riotIdTagline}`}
                          target="_blank"
                          className={`${participant.puuid === userPuuid ? "font-bold" : ""} truncate z-auto hover:underline hover:font-bold`}
                        >
                          {participant.riotIdGameName}
                        </a>
                      </div>
                    ))}
                </div>
                <div className="flex flex-col gap-0.5">
                  {participants
                    .filter((participant) => participant.teamId === 200)
                    .map((participant, index) => (
                      <div key={index} className="flex gap-0.5 w-16">
                        <Image
                          src={`https://ddragon.leagueoflegends.com/cdn/${shorterGameVersion}/img/champion/${participant.championName}.png`}
                          alt={`${participant.championName}`}
                          width={15}
                          height={15}
                        />
                        <a
                          href={`/search?username=${participant.riotIdGameName}%23${participant.riotIdTagline}`}
                          target="_blank"
                          className={`${participant.puuid === userPuuid ? "font-bold" : ""} truncate z-auto hover:underline hover:font-bold`}
                        >
                          {participant.riotIdGameName}
                        </a>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent
          className={`${gameResult() === "WIN" ? "bg-matchCard-bg_win_detail" : "bg-matchCard-bg_loss_detail"}`}
        >
          <div className="flex gap-4">
            <div>Team 1</div>
            <div>Team 2</div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default MatchCard;
