type PlayerState = {
  sets: number;
  games: number;
  points: number;
}

// type alias for clarity. probably overkill
type PlayerName = string

interface DiUSTennis<P1, P2> {
  pointWonBy(name: P1 | P2): void
  score(): string
}
// match.pointWonBy("player 3") should be a type error now

// helper functions for scoring conditions
const winByTwo = (a: number, b: number) => (a - b) >= 2;
const deuce = (a: number, b: number) => a >= 3 && b >= 3 && a === b;
const advantage = (a: number, b: number) => a >= 3 && b >= 3 && a > b;
const wonGame = (a: number, b: number) => a >= 4 && winByTwo(a, b);
const wonTiebreak = (a: number, b: number) => a >= 7 && winByTwo(a, b);
const wonSet = (a: number, b: number) => a >= 6 && winByTwo(a, b);

class Match<P1 extends PlayerName, P2 extends PlayerName> implements DiUSTennis<P1, P2> {
  private player1: PlayerState = { sets: 0, games: 0, points: 0 };
  private player2: PlayerState = { sets: 0, games: 0, points: 0 };

  constructor(private readonly player1Name: P1, private readonly player2Name: P2) { }

  pointWonBy(name: P1 | P2) {
    this.getPlayerState(name).points += 1;

    // I don't **really** like creating references to class properties but will here for brevity
    const p1 = this.player1.points;
    const p2 = this.player2.points;

    const tiebreak = this.player1.games === 6 && this.player2.games === 6;

    if (tiebreak) {
      if (wonTiebreak(p1, p2)) {
        this.player1.sets += 1;
        this.resetScore();
        console.log(`congratulations on winning the set, ${this.player1Name}`);
        // we would reset games to 0 here too but it's not part of the brief.
      } else if (wonTiebreak(p2, p1)) {
        this.player2.sets += 1;
        this.resetScore();
        console.log(`congratulations on winning the set, ${this.player2Name}`);
      }
    } else { // check regular game winning conditions
      if (wonGame(p1, p2)) {
        this.player1.games += 1;
        this.resetScore();
      } else if (wonGame(p2, p1)) {
        this.player2.games += 1;
        this.resetScore();
      }

      // check set winning conditions
      if (wonSet(p1, p2)) {
        this.player1.sets += 1;
        console.log(`congratulations on winning the set, ${this.player1Name}`);
      } else if (wonSet(p2, p1)) {
        this.player2.sets += 1;
        console.log(`congratulations on winning the set, ${this.player2Name}`);
      }
    }
  }

  score(): string {
    return `${this.player1.games}-${this.player2.games}, ${this.currentGameScore()}`;
  }

  private currentGameScore(): string {
    const p1 = this.player1.points; // brevity
    const p2 = this.player2.points;

    const tiebreak = this.player1.games === 6 && this.player2.games === 6;
    if (tiebreak) return `${p1}-${p2}`;

    if (deuce(p1, p2)) return `Deuce`;
    if (advantage(p1, p2)) return `Advantage ${this.player1Name}`;
    if (advantage(p2, p1)) return `Advantage ${this.player2Name}`;

    return `${this.getPrettyPointName(p1)}-${this.getPrettyPointName(p2)}`;
  }

  private getPrettyPointName(p: number): string {
    const POINTS = ['0', '15', '30', '40'];
    return POINTS[p];
  }

  private resetScore(): void {
    this.player1.points = 0;
    this.player2.points = 0;
  }

  private getPlayerState(name: string) {
    if (name === this.player1Name) {
      return this.player1;
    } else {
      return this.player2;
    }
  }
}

/* From dius_tennis README */
const match = new Match('player 1', 'player 2');
match.pointWonBy('player 1');
match.pointWonBy('player 2');
// this will return "0-0, 15-15"
console.log(match.score()); // I prefer to return strings rather than do the printing inside a method

match.pointWonBy('player 1');
match.pointWonBy('player 1');
// this will return "0-0, 40-15"
console.log(match.score());

match.pointWonBy('player 2');
match.pointWonBy('player 2');
// this will return "0-0, Deuce"
console.log(match.score());

match.pointWonBy('player 1');
// this will return "0-0, Advantage player 1"
console.log(match.score());

match.pointWonBy('player 1');
// this will return "1-0"
console.log(match.score());


console.log('--------- tiebreak match');
// play to a tiebreak (6 games for each player of 4 points (love game) = 6 * 2 * 4)
const tiebreakMatch = new Match('Josh', 'James');
for (let games = 0; games < 12; games++) {
  if (games % 2 === 0) {
    tiebreakMatch.pointWonBy('Josh');
    tiebreakMatch.pointWonBy('Josh');
    tiebreakMatch.pointWonBy('Josh');
    tiebreakMatch.pointWonBy('Josh');
  } else {
    tiebreakMatch.pointWonBy('James');
    tiebreakMatch.pointWonBy('James');
    tiebreakMatch.pointWonBy('James');
    tiebreakMatch.pointWonBy('James');
  }
}
console.log(tiebreakMatch.score());
// Now we get to the fun stuff. Let's take it to 6-6 and then I'll win by two :)
for (let p = 0; p < 12; p++) {
  if (p % 2 === 0) {
    tiebreakMatch.pointWonBy('Josh');
  } else {
    tiebreakMatch.pointWonBy('James');
  }
  console.log(tiebreakMatch.score());
}

tiebreakMatch.pointWonBy('Josh');
console.log(tiebreakMatch.score());
tiebreakMatch.pointWonBy('Josh');

// expecting to see a congratulatory message here