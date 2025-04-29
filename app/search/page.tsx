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
  const match1 = await fetchMatchDetails("EUN1_3769864828");
  const match2 = await fetchMatchDetails("EUN1_3769858454");
  // const match3 = await fetchMatchDetails("EUN1_3769716638");

  return (
    <>
      <Navbar />
      <div className="mx-4">
        <div className="flex items-center gap-4">
          <Image
            src={`https://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/profileicon/
${summoner.profileIconId}.png`}
            alt={`Profile Image`}
            width={50}
            height={50}
          />
          <h2>
            {gameName} #{tagLine}
          </h2>
          <p>{summoner.summonerLevel}</p>
        </div>

        <div className="flex flex-col gap-2">
          {/* {matches.map((match, index) => (
            <MatchCard key={index} userPuuid={account.puuid} params={match} />
          ))} */}
          <MatchCard userPuuid={account.puuid} params={match1} />
          <MatchCard userPuuid={account.puuid} params={match2} />
          {/* <MatchCard userPuuid={account.puuid} params={match3} /> */}
        </div>
      </div>
    </>
  );
};

export default page;
