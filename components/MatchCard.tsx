

// queueId
// gameCreation
// gameResult - gameDuration

// Musim matchnout vyhledany puuid s participants puuid a zjistit co hral

// championName / pic - champLevel
//
//
// "item0": 3161,
// "item1": 6692,
// "item2": 3071,
// "item3": 3173,
// "item4": 3053,
// "item5": 1011,
// "item6": 3340,

const MatchCard = () => {

  return (
    <div>
      {/* Match details */}

      <p>queueId</p>
      <p>gameCreation</p>
      <p>LP Gain</p>
      <p>gameResult - gameDuration</p>
      {/* User champ & setup details */}
      <div>
        <div>
          <p>Img</p>
          <p>level</p>
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
        <p>KDA</p>
        <p>KDA Ratio</p>
        <p>CS</p>
        <p>Vision</p>
      </div>
      <div>
        <p>Items</p>
      </div>
      <div>
        <div>Team 1</div>
        <div>Team 2</div>
      </div>
    </div>
  );
};

export default MatchCard;
