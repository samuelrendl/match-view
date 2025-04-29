import {
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

  const items = [
    user?.item0,
    user?.item1,
    user?.item2,
    user?.item3,
    user?.item4,
    user?.item5,
    user?.item6,
  ];

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
          <div className="flex w-full flex-col gap-2">
            {/* Match summary */}
            <div className="flex justify-between">
              <p>
                {gameResult()}
                <span className="hidden">- {formatedGameDuration}</span>
              </p>
              <div className="flex gap-2 text-xs">
                <p>{gameType}</p>
                <p>{howLongAgo}</p>
                <p className="hidden">25 LP</p>
              </div>
            </div>

            {/* Champ & details row */}
            <div className="flex justify-between">
              {/* Left side - champion, summoners, runes */}
              <div className="flex justify-between gap-0.5">
                {/* Champion */}
                <div className="relative">
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
                  <div className="flex flex-col justify-between">
                    <GameEntity
                      entity={summonerOne}
                      type="summoner"
                      gameVersion={shorterGameVersion}
                    />
                    <GameEntity
                      entity={summonerTwo}
                      type="summoner"
                      gameVersion={shorterGameVersion}
                    />
                  </div>
                  {/* Runes */}
                  <div className="flex flex-col justify-between">
                    {primaryRune && "longDesc" in primaryRune ? (
                      <GameEntity
                        entity={primaryRune}
                        type="rune"
                        gameVersion={shorterGameVersion}
                      />
                    ) : (
                      <div /> // fallback empty cell if no rune
                    )}

                    <GameEntity
                      entity={{
                        ...secondaryRune,
                        icon: secondaryRune.icon,
                      }}
                      type="rune"
                      gameVersion={shorterGameVersion}
                    />
                  </div>
                </div>
              </div>

              {/* Right side - items & stats */}
              <div className="flex flex-col justify-between">
                {/* Items */}
                <div className="grid grid-flow-col gap-0.5">
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

                {/* KDA + CS */}
                <div className="ml-auto mr-0 flex gap-4 text-xs">
                  <p>
                    {user?.kills} / {user?.assists} / {user?.deaths}
                  </p>
                  <div className="flex items-center gap-1">
                    <p>{kdaRatio} KDA</p>
                    <p className="hidden">{user?.totalMinionsKilled} CS</p>
                    <p className="hidden">{user?.visionScore} Vision</p>
                  </div>
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
