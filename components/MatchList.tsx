"use client";

import { splitUsername } from "@/lib/utils";
import { MatchInfo } from "@/types/matchcard";
import { Account, Summoner } from "@/types/matchList";
import { useEffect, useState } from "react";
import MatchCard from "./matchcard/MatchCard";
import { Button } from "./ui/button";
import {
  fetchAccount,
  fetchGameVersion,
  fetchMatchDetails,
  fetchMatchHistory,
  fetchSummoner,
} from "@/utils/api";
import Image from "next/image";

interface MatchListProps {
  username: string;
}

const MATCHES_PER_BATCH = 5;

const MatchList = ({ username }: MatchListProps) => {
  const [matches, setMatches] = useState<MatchInfo[]>([]);
  const [matchIds, setMatchIds] = useState<string[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [account, setAccount] = useState<Account | null>(null);
  const [summoner, setSummoner] = useState<Summoner | null>(null);
  const [gameVersion, setGameVersion] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const { gameName, tagLine } = splitUsername(username);
        console.log("Fetching data for:", gameName, tagLine);
        const [version, accountData] = await Promise.all([
          fetchGameVersion(),
          fetchAccount(gameName, tagLine),
        ]);
        const summonerData = await fetchSummoner(accountData.puuid);
        const matchIdList = await fetchMatchHistory(accountData.puuid);

        const firstBatch = await Promise.all(
          matchIdList.slice(0, MATCHES_PER_BATCH).map(fetchMatchDetails)
        );

        setGameVersion(version);
        setAccount(accountData);
        setSummoner(summonerData);
        setMatchIds(matchIdList);
        setMatches(firstBatch);
        setLoadedCount(firstBatch.length);
      } catch (e) {
        setError("Failed to load data. Please try again.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [username]);

  const loadMore = async () => {
    setLoading(true);
    try {
      const nextIds = matchIds.slice(
        loadedCount,
        loadedCount + MATCHES_PER_BATCH
      );
      const nextMatches = await Promise.all(
        nextIds.map((id) => fetchMatchDetails(id))
      );
      setMatches((prev) => [...prev, ...nextMatches]);
      setLoadedCount((prev) => prev + nextIds.length);
    } catch (e) {
      setError("Could not load more matches.");
    } finally {
      setLoading(false);
    }
  };

  if (!account || !summoner)
    return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="font-poppins max-w-2xl  mx-2 sm:mx-auto content-center">
      <div className="flex items-center gap-2 mb-2">
        <div className="relative">
          <Image
            src={`https://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/profileicon/${summoner.profileIconId}.png`}
            alt={`Profile Image`}
            width={50}
            height={50}
            className="rounded-md"
          />
          <p className="absolute text-[12px] bg-black/70 rounded-sm text-white font-light leading-tight -top-2 left-4 text-center">
            {summoner.summonerLevel}
          </p>
        </div>
        <h2>
          {account.gameName} #{account.tagLine}
        </h2>
      </div>

      <div className="flex flex-col gap-2 rounded-sm">
        {matches.map((match, index) => (
          <MatchCard key={index} userPuuid={account.puuid} params={match} />
        ))}
      </div>
      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      {loadedCount < matchIds.length && (
        <Button onClick={loadMore} disabled={loading}>
          {loading ? "Loading..." : "Load More"}
        </Button>
      )}
    </div>
  );
};

export default MatchList;
