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
import MatchCard from "@/components/MatchCard";

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
  // const matches = await Promise.all(
  //   matchIds.map((matchId: string) => fetchMatchDetails(matchId))
  // );
  const match = await fetchMatchDetails("EUN1_3735624700");

  return (
    <>
      <Navbar />
      <div className="mx-4">
        <div className="flex items-center gap-4">
          <Image
            src={`https://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/profileicon/
${summoner.profileIconId}.png`}
            alt={`Profile image`}
            width={50}
            height={50}
          />
          <h2>
            {gameName} #{tagLine}
          </h2>
          <p>{summoner.summonerLevel}</p>
        </div>

        <div>
          {/* {matches.map((match, index) => (
            <MatchCard key={index} userPuuid={account.puuid} params={match} />
          ))} */}
          <MatchCard userPuuid={account.puuid} params={match} />
        </div>
      </div>
    </>
  );
};

export default page;
