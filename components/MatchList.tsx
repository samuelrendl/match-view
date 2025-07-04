"use client";

import { splitUsername } from "@/lib/utils";
import { MatchInfo } from "@/types/matchcard";
import { Account, Summoner } from "@/types/matchList";
import { useEffect, useState, useCallback, memo } from "react";
import MatchCard from "./matchcard/MatchCard";
import { Button } from "./ui/button";
import {
  fetchAccount,
  fetchMatchDetails,
  fetchMatchHistory,
  fetchSummoner,
} from "@/utils/api";
import Image from "next/image";
import { Accordion } from "@radix-ui/react-accordion";

interface MatchListProps {
  username: string;
  region: string;
}

interface StoredMatch {
  id: string;
  info: MatchInfo;
}

const MATCHES_PER_BATCH = 10;

const MemoizedMatchCard = memo(
  ({
    index,
    matchId,
    userPuuid,
    params,
  }: {
    index: number;
    matchId: string;
    userPuuid: string;
    params: MatchInfo;
  }) => (
    <MatchCard
      itemIndex={index}
      key={matchId}
      userPuuid={userPuuid}
      params={params}
    />
  ),
  (prev, next) => {
    return prev.matchId === next.matchId && prev.userPuuid === next.userPuuid;
  }
);

MemoizedMatchCard.displayName = "MemoizedMatchCard";

const whatRegion = (region: string) => {
  switch (region) {
    case "EUW1":
      return "europe";
    case "EUN1":
      return "europe";
    case "NA1":
      return "americas";
    default:
      throw new Error(`Unsupported region: ${region}`);
  }
};

const MatchList = ({ username, region }: MatchListProps) => {
  const [staticDataVersion] = useState<string | null>("15.12.1");
  const [matches, setMatches] = useState<StoredMatch[]>([]);
  const [matchIds, setMatchIds] = useState<string[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [account, setAccount] = useState<Account | null>(null);
  const [summoner, setSummoner] = useState<Summoner | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const init = useCallback(async () => {
    setIsInitialLoading(true);
    setError(null);
    try {
      const { gameName, tagLine } = splitUsername(username);
      const accountData = await fetchAccount(
        gameName,
        tagLine,
        whatRegion(region)
      );
      const summonerData = await fetchSummoner(accountData.puuid, region);
      const matchIdList = await fetchMatchHistory(
        accountData.puuid,
        whatRegion(region)
      );

      const firstBatch = await Promise.all(
        matchIdList.slice(0, MATCHES_PER_BATCH).map(async (id: string) => {
          try {
            const match = await fetchMatchDetails(id, whatRegion(region));
            return { id, info: match.info };
          } catch (e) {
            console.error(`Failed to fetch match ${id}:`, e);
            return undefined;
          }
        })
      );

      const filteredMatches = firstBatch.filter(
        (m): m is StoredMatch => m !== undefined && m !== null
      );

      setMatches(filteredMatches);
      setAccount(accountData);
      setSummoner(summonerData);
      setMatchIds(matchIdList);
      setLoadedCount(filteredMatches.length);
    } catch (e) {
      setError("Failed to load data. Please try again.");
      console.error("Initialization error:", e);
    } finally {
      setIsInitialLoading(false);
    }
  }, [username]);

  useEffect(() => {
    init();
  }, [init]);

  const loadMore = useCallback(async () => {
    setIsLoadingMore(true);
    setError(null);
    try {
      const nextIds = matchIds.slice(
        loadedCount,
        loadedCount + MATCHES_PER_BATCH
      );
      const nextMatches = await Promise.all(
        nextIds.map(async (id) => {
          try {
            const match = await fetchMatchDetails(id, whatRegion(region));
            return { id, info: match.info };
          } catch (e) {
            console.error(`Failed to fetch match ${id}:`, e);
            return undefined;
          }
        })
      );

      const filteredNextMatches = nextMatches.filter(
        (m): m is StoredMatch => m !== undefined
      );

      if (filteredNextMatches.length > 0) {
        setMatches((prev) => [...prev, ...filteredNextMatches]);
        setLoadedCount((prev) => prev + filteredNextMatches.length);
      }
    } catch (e) {
      setError(
        `Could not load more matches. ${e instanceof Error ? e.message : "Unknown error"}`
      );
    } finally {
      setIsLoadingMore(false);
    }
  }, [loadedCount, matchIds]);

  if (isInitialLoading) {
    return (
      <p className="mt-10 text-center text-muted-foreground">
        Loading matches...
      </p>
    );
  }

  if (!account || !summoner) {
    return (
      <p className="mt-10 text-center text-red-500">
        Error: Missing account or summoner.
      </p>
    );
  }

  if (matches.length === 0) {
    return <p className="mt-10 text-center">No matches found.</p>;
  }

  return (
    <div className="mx-2 max-w-2xl content-center font-poppins sm:mx-auto">
      <div className="mb-2 flex items-center gap-2">
        <div className="relative">
          <Image
            src={`https://ddragon.leagueoflegends.com/cdn/${staticDataVersion}/img/profileicon/${summoner.profileIconId}.png`}
            alt="Profile Image"
            width={50}
            height={50}
            className="rounded-md"
            priority
          />
          <p className="absolute -top-2 left-4 rounded-sm bg-black/70 text-center text-[12px] font-light leading-tight text-white">
            {summoner.summonerLevel}
          </p>
        </div>
        <h2>
          {account.gameName} #{account.tagLine}
        </h2>
      </div>

      <div className="flex flex-col gap-2 rounded-sm">
        <Accordion type="single" collapsible className="flex flex-col gap-2">
          {matches.map((storedMatch, index) => {
            if (!storedMatch) {
              console.warn(`Skipping undefined match at index ${index}`);
              return null;
            }
            try {
              return (
                <MemoizedMatchCard
                  key={storedMatch.id || index}
                  index={index}
                  matchId={storedMatch.id}
                  userPuuid={account.puuid}
                  params={storedMatch.info}
                />
              );
            } catch (e) {
              console.error(
                `Error rendering MatchCard at index ${storedMatch.id || index}:`,
                e
              );
              return <p key={index}>Failed to render match.</p>;
            }
          })}
        </Accordion>
      </div>
      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      {loadedCount < matchIds.length && (
        <div className="mt-4 flex justify-center">
          <Button onClick={loadMore} disabled={isLoadingMore}>
            {isLoadingMore ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default MatchList;
