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
    <div className="flex w-20 gap-0.5">
      <Image
        src={`https://ddragon.leagueoflegends.com/cdn/${shorterGameVersion}/img/champion/${participant.championName === "FiddleSticks" ? "Fiddlesticks" : participant.championName}.png`}
        alt={`${participant.championName}`}
        width={15}
        height={15}
      />
      <a
        href={`/search?username=${participant.riotIdGameName}%23${participant.riotIdTagline}`}
        target="_blank"
        className={`${participant.puuid === userPuuid ? "font-bold" : ""} z-auto truncate text-xs hover:font-bold hover:underline`}
      >
        {participant.riotIdGameName}
      </a>
    </div>
  );
};

export default Team;
