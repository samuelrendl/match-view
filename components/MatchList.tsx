"use client";

import { splitUsername } from "@/lib/utils";
import { MatchInfo } from "@/types/matchcard";
import { Account, Summoner } from "@/types/matchList";
import { useEffect, useState } from "react";
import MatchCard from "./matchcard/MatchCard";
import { Button } from "./ui/button";
import {
  fetchAccount,
  fetchMatchDetails,
  fetchMatchHistory,
  fetchSummoner,
} from "@/utils/api";
import { useStaticData } from "@/hooks/useFetchStaticData";
import Image from "next/image";

interface MatchListProps {
  username: string;
}

const MATCHES_PER_BATCH = 5;

const MatchList = ({ username }: MatchListProps) => {
  const [staticDataVersion] = useState<string | null>("15.12.1");
  const [matches, setMatches] = useState<MatchInfo[]>([]);
  const [matchIds, setMatchIds] = useState<string[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [account, setAccount] = useState<Account | null>(null);
  const [summoner, setSummoner] = useState<Summoner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError(null);
      try {
        const { gameName, tagLine } = splitUsername(username);
        const accountData = await fetchAccount(gameName, tagLine);
        const summonerData = await fetchSummoner(accountData.puuid);
        const matchIdList = await fetchMatchHistory(accountData.puuid);
       

        const firstBatch = await Promise.all(
          matchIdList.slice(0, MATCHES_PER_BATCH).map(async (id: string) => {
            try {
              const match = await fetchMatchDetails(id);
              console.log(`Match ${id}:`, match);
              return match.info;
            } catch (e) {
              console.error(`Failed to fetch match ${id}:`, e);
              return undefined;
            }
          })
        );

        const filteredMatches = firstBatch.filter(
          (m): m is MatchInfo => m !== undefined && m !== null
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
        setLoading(false);
      }
    };

    init();
  }, [username]);

  const loadMore = async () => {
    setLoading(true);
    setError(null);
    try {
      const nextIds = matchIds.slice(
        loadedCount,
        loadedCount + MATCHES_PER_BATCH
      );
      const nextMatches = await Promise.all(
        nextIds.map(async (id) => {
          try {
            const match = await fetchMatchDetails(id);
            return match.info;
          } catch (e) {
            console.error(`Failed to fetch match ${id}:`, e);
            return undefined;
          }
        })
      );

      const filteredNextMatches = nextMatches.filter(
        (m): m is MatchInfo => m !== undefined && m !== null
      );

      setMatches((prev) => {
        const newMatches = [...prev, ...filteredNextMatches];
        return newMatches;
      });
      setLoadedCount((prev) => prev + nextIds.length);
    } catch (e) {
      setError(
        `Could not load more matches. ${e instanceof Error ? e.message : "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };

  const { data: staticData, loading: staticLoading } = useStaticData(
    staticDataVersion || ""
  );

  if (loading || staticLoading) {
    return <p className="mt-10 text-center">Loading...</p>;
  }

  if (!account || !summoner || !staticData) {
    return (
      <p className="mt-10 text-center text-red-500">
        Error: Missing account, summoner, or static data.
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
        {matches.map((match, index) => {
          if (!match) {
            console.warn(`Skipping undefined match at index ${index}`);
            return null;
          }
          try {
            return (
              <MatchCard
                key={index}
                userPuuid={account.puuid}
                params={match}
                staticData={staticData}
              />
            );
          } catch (e) {
            console.error(`Error rendering MatchCard at index ${index}:`, e);
            return <p key={index}>Failed to render match.</p>;
          }
        })}
      </div>
      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      {loadedCount < matchIds.length && (
        <Button onClick={loadMore} disabled={loading}>
          {loading ? "Loading..." : "Load More"}
        </Button>
      )}
    </div>
  );
};

export default MatchList;
