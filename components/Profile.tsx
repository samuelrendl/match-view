"use client";

import { useSearchParams } from "next/navigation";
import MatchCard from "./MatchCard";
import Image from "next/image";
import { useEffect, useState } from "react";

const splitUsername = (username: string) => {
  if (!username.includes("#")) {
    throw new Error(
      "Invalid username format. Expected format: gameName#tagLine"
    );
  }
  const [gameName, tagLine] = username.split("#");
  return { gameName, tagLine };
};

const Profile = () => {
  const searchParams = useSearchParams();
  const username = searchParams.get("username");
  const [version, setVersion] = useState("");

  if (!username) {
    console.log("Username is required");
  }

  let gameName = "";
  let tagLine = "";
  if (username) {
    ({ gameName, tagLine } = splitUsername(username));
  }

  const championName = "Aatrox";

  useEffect(() => {
    const fetchGameVersion = async () => {
      try {
        const response = await fetch(
          "https://ddragon.leagueoflegends.com/api/versions.json"
        );
        if (!response.ok) throw new Error("Error fetching game version");
        const versions = await response.json();
        setVersion(versions[0]);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchGameVersion();
  }, []);

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
