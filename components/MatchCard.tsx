import {
  findRuneOrTreeById,
  findSummonerByKey,
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
import { fetchItems, fetchRunes, fetchSummonerSpells } from "@/utils/api";
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
    info: { gameCreation, gameDuration, queueId, gameVersion, participants },
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

  // const checkQueueId = fetchQueueId(queueId);

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

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex gap-3">
            {/* Match details */}
            <div>
              <p>{queueId}</p>
              <p>{howLongAgo}</p>
              <p>LP Gain</p>
              <p>
                {user?.win} - {gameDuration}
              </p>
            </div>

            {/* User champ & setup details */}
            <div className="flex gap-2">
              <div className="relative size-10">
                <Image
                  src={`https://ddragon.leagueoflegends.com/cdn/${shorterGameVersion}/img/champion/${user?.championName}.png`}
                  alt={`${user?.championName}`}
                  width={40}
                  height={40}
                />
                <p className="absolute bottom-0 left-0 rounded-bl-lg bg-black/70 px-1 text-xs text-white">
                  {user?.champLevel}
                </p>
              </div>
              <div>
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
              <div>
                <div>
                  {primaryRune && "longDesc" in primaryRune && (
                    <GameEntity
                      entity={primaryRune}
                      type="rune"
                      gameVersion={shorterGameVersion}
                    />
                  )}
                </div>
                <div>
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
            {/* Post Stats */}
            <div>
              <div className="grid grid-flow-col gap-1">
                {items.map((item, index) => (
                  <GameEntity
                    key={`item-${index}`}
                    entity={fetchedItems[item!]}
                    gameVersion={shorterGameVersion}
                    type="item"
                  />
                ))}
              </div>
              <div className="flex">
                <div>
                  <p>
                    {user?.kills} / {user?.assists} / {user?.deaths}
                  </p>
                </div>
                <p>{kdaRatio}</p>
                <p>{user?.totalMinionsKilled}</p>
                <p>{user?.visionScore}</p>
              </div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div>
            <div>Team 1</div>
            <div>Team 2</div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default MatchCard;
