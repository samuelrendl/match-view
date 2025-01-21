"use client";

import { useSearchParams } from "next/navigation";
import MatchCard from "./MatchCard";
import Image from "next/image";

const splitUsername = (username: string) => {
  if (!username.includes("#")) {
    throw new Error(
      "Invalid username format. Expected format: gameName#tagLine"
    );
  }
  const [gameName, tagLine] = username.split("#");
  return { gameName, tagLine };
};

// gameName a tagLine musim mi pro ziskal puuid
// puuid potrebuju pro fetchnuti Match-V5
// To mi vrati array
// Pak budu muset mapnout over ty matchID jsou budou v tom array a zobrazim je

const Profile = () => {
  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  if (!username) {
    console.log("Username is required");
  }

  let gameName = "";
  let tagLine = "";
  if (username) {
    ({ gameName, tagLine } = splitUsername(username));
  }

  const championName = "Aatrox";
  const version = "15.1.1";

  return (
    <div className="mx-4">
      <div className="flex items-center gap-4">
        <Image
          src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championName}.png`}
          alt={`${championName} image`}
          width={50}
          height={50}
        />
        <h2>
          {gameName} #{tagLine}
        </h2>
      </div>
      <MatchCard />
    </div>
  );
};

export default Profile;
