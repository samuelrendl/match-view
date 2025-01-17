"use client";

import { useSearchParams } from "next/navigation";

const splitUsername = (username: string) => {
  if (!username.includes("#")) {
    throw new Error(
      "Invalid username format. Expected format: gameName#tagLine"
    );
  }
  const [gameName, tagLine] = username.split("#");
  return { gameName, tagLine };
};

const MatchHistory = () => {
  const searchParams = useSearchParams();
  const username = searchParams.get("username");
  if (!username) {
    throw new Error("Username is required");
  }

  
  const { gameName, tagLine } = splitUsername(username);

  return (
    <div>
      <h2>{gameName}</h2>
      <h2>{tagLine}</h2>
    </div>
  );
};

export default MatchHistory;
