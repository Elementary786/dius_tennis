type PlayerState = {
    sets: number;
    games: number;
    points: number;
  }
  
  // type alias for clarity
  type PlayerName = string
  
  interface DiUSTennis<P1, P2> {
    pointWonBy(name: P1 | P2)
    score(): string
  }
  
  class Match<P1 extends PlayerName, P2 extends string> implements DiUSTennis<P1, P2> {
    private player1: PlayerState = { sets: 0, games: 0, points: 0 };
    private player2: PlayerState = { sets: 0, games: 0, points: 0 }
  
    constructor(private readonly player1Name: P1, private readonly player2Name: P2) {}
  
    pointWonBy(name: P1 | P2) {
      
    }
  
    score(): string {
      return ''
    }
  }
  
  /* From dius_tennis README */
  const match = new Match("player 1", "player 2");
  match.pointWonBy("player 1");
  match.pointWonBy("player 2");
  // this will return "0-0, 15-15"
  match.score();
  
  match.pointWonBy("player 1");
  match.pointWonBy("player 1");
  // this will return "0-0, 40-15"
  match.score();
  
  match.pointWonBy("player 2");
  match.pointWonBy("player 2");
  // this will return "0-0, Deuce"
  match.score();
  
  match.pointWonBy("player 1");
  // this will return "0-0, Advantage player 1"
  match.score();
  
  match.pointWonBy("player 1");
  // this will return "1-0"
  match.score();
  
  // match.poingWonBy("player 3") should be a type error now
  // match.pointWonBy("player 3");