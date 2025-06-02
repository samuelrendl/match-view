import Navbar from "@/components/Navbar";
// import MatchCard from "./MatchCard";
import Image from "next/image";
import { splitUsername } from "@/lib/utils";
import {
  fetchGameVersion,
  fetchMatchHistory,
  fetchAccount,
  fetchSummoner,
  fetchMatchDetails,
} from "@/utils/api";
import MatchCard from "@/components/matchcard/MatchCard";

interface PageProps {
  searchParams: { username?: string };
}

const page = async ({ searchParams }: PageProps) => {
  const { username } = await searchParams;

  const gameVersion = await fetchGameVersion();

  let gameName = "";
  let tagLine = "";

  if (username) {
    ({ gameName, tagLine } = splitUsername(username));
  }

  const account = await fetchAccount(gameName, tagLine);
  const summoner = await fetchSummoner(account.puuid);
  const matchIds = await fetchMatchHistory(account.puuid);
  
  const matches = await Promise.all(
    matchIds.map((matchId: string) => fetchMatchDetails(matchId))
  );

  return (
    <>
      <Navbar />
      <div className="font-poppins max-w-2xl  mx-2 sm:mx-auto content-center">
        <div className="flex items-center gap-2 mb-2">
          <div className="relative">
            <Image
              src={`https://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/profileicon/
${summoner.profileIconId}.png`}
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
            {gameName} #{tagLine}
          </h2>
        </div>

        <div className="flex flex-col gap-2 rounded-sm">
          {matches.map((match, index) => (
            <MatchCard key={index} userPuuid={account.puuid} params={match} />
          ))}
        </div>
      </div>
    </>
  );
};

export default page;
