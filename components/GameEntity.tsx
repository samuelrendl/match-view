// components/GameEntity.tsx
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Image from "next/image";
import {
  type GameEntity,
  GameEntityProps,
  ItemEntity,
  RuneEntity,
  SummonerSpellEntity,
  AugmentEntity,
} from "../types/gameEntity";

function GameEntity({ entity, gameVersion, type }: GameEntityProps) {
  if (!entity) {
    return null;
  }

  // Type guard helpers
  const isItem = (e: GameEntity): e is ItemEntity =>
    "gold" in e && "plaintext" in e;
  const isRune = (e: GameEntity): e is RuneEntity =>
    "shortDesc" in e && "longDesc" in e;
  const isSummonerSpell = (e: GameEntity): e is SummonerSpellEntity =>
    "cooldown" in e;
  const isAugment = (e: GameEntity): e is AugmentEntity =>
    "id" in e && "desc" in e;

  // Get image path based on type
  const getImagePath = () => {
    switch (type) {
      case "item":
        return `${gameVersion}/img/item/${(entity as ItemEntity).image.full}`;
      case "rune":
        return `img/${(entity as RuneEntity).icon}`;
      case "summoner":
        return `${gameVersion}/img/spell/${(entity as SummonerSpellEntity).image.full}`;
      case "augment":
        return `${(entity as AugmentEntity).iconLarge}`;
      default:
        return "";
    }
  };

  return (
    <HoverCard>
      <HoverCardTrigger>
        <div className="rounded-sm drop-shadow-lg">
          <Image
            src={
              type === "augment"
                ? `https://raw.communitydragon.org/latest/game/${getImagePath()}`
                : `https://ddragon.leagueoflegends.com/cdn/${getImagePath()}`
            }
            width={42}
            height={42}
            alt={entity.name}
            className="rounded-sm object-contain"
          />
        </div>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="space-y-2">
          <h4 className="font-semibold">{entity.name}</h4>

          {isItem(entity) && (
            <>
              <p className="text-sm">{entity.plaintext}</p>
              <p dangerouslySetInnerHTML={{ __html: entity.description }} />
              <p>Cost: {entity.gold.base}</p>
            </>
          )}

          {isRune(entity) && (
            <>
              <p dangerouslySetInnerHTML={{ __html: entity.longDesc || "" }} />
            </>
          )}

          {isSummonerSpell(entity) && (
            <>
              <p dangerouslySetInnerHTML={{ __html: entity.description }} />
              <p>Cooldown: {entity.cooldown.join("/")}s</p>
            </>
          )}
          {isAugment(entity) && (
            <>
              <p dangerouslySetInnerHTML={{ __html: entity.desc }} />
            </>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export default GameEntity;
