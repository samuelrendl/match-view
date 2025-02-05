import { timeAgo } from "@/lib/utils";

interface Participant {
  puuid: string;
  win: boolean;
  championName: string;
  champLevel: number;
  summoner1Id: number;
  summoner2Id: number;
  kills: number;
  assists: number;
  deaths: number;
  totalMinionsKilled: number;
  visionScore: number;
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
  // You can add other properties as needed (e.g. win, championName, champLevel, etc.)
}

interface MatchInfo {
  gameCreation: number;
  gameDuration: number;
  queueId: string;
  participants: Participant[];
}

interface MatchCardProps {
  params: {
    info: MatchInfo;
    gameResult: string;
  };
}

const findUserByPUUID = (
  userPuuid: string,
  participants: Participant[]
): Participant | undefined => {
  return participants.find((participant) => participant.puuid === userPuuid);
};

const MatchCard = ({
  userPuuid,
  params,
}: {
  userPuuid: string;
  params: MatchCardProps["params"];
}) => {
  const {
    info: { gameCreation, gameDuration, queueId, participants },
  } = params;

  const howLongAgo = timeAgo(gameCreation);

  // Find the matching user in the participants array
  const user = findUserByPUUID(userPuuid, participants);

  return (
    <div>
      {/* Match details */}

      <p>{queueId}</p>
      <p>{howLongAgo}</p>
      <p>LP Gain</p>
      <p>
        {user?.win} - {gameDuration}
      </p>
      {/* User champ & setup details */}
      <div>
        <div>
          <p>{user?.championName}</p>
          <p>{user?.champLevel}</p>
        </div>
        <div>
          <p>SumSpell1</p>
          <p>SumSpell2</p>
        </div>
        <div>
          <p>PrimaryRune</p>
          <p>SecondaryRune</p>
        </div>
      </div>
      {/* Post Stats */}
      <div>
        <p>
          {user?.kills} / {user?.assists} / {user?.deaths}
        </p>
        <p>KDA Ratio</p>
        <p>{user?.totalMinionsKilled}</p>
        <p>{user?.visionScore}</p>
      </div>
      <div>
        <p>{user?.item0}</p>
        <p>{user?.item1}</p>
        <p>{user?.item2}</p>
        <p>{user?.item3}</p>
        <p>{user?.item4}</p>
        <p>{user?.item5}</p>
        <p>{user?.item6}</p>
      </div>
      <div>
        <div>Team 1</div>
        <div>Team 2</div>
      </div>
    </div>
  );
};

export default MatchCard;
