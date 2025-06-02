import Image from "next/image";
import { Participant } from "../../types/matchcard";

const Team = ({
  shorterGameVersion,
  participant,
  userPuuid,
}: {
  shorterGameVersion: string;
  participant: Participant;
  userPuuid: string;
}) => {
  return (
    <div className="flex gap-0.5 w-20">
      <Image
        src={`https://ddragon.leagueoflegends.com/cdn/${shorterGameVersion}/img/champion/${participant.championName === "FiddleSticks" ? "Fiddlesticks" : participant.championName}.png`}
        alt={`${participant.championName}`}
        width={15}
        height={15}
      />
      <a
        href={`/search?username=${participant.riotIdGameName}%23${participant.riotIdTagline}`}
        target="_blank"
        className={`${participant.puuid === userPuuid ? "font-bold" : ""} truncate text-xs z-auto hover:underline hover:font-bold`}
      >
        {participant.riotIdGameName}
      </a>
    </div>
  );
};

export default Team;
