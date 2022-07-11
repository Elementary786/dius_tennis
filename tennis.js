// match.pointWonBy("player 3") should be a type error now
// helper functions for scoring conditions
var winByTwo = function (a, b) { return (a - b) >= 2; };
var deuce = function (a, b) { return a >= 3 && b >= 3 && a === b; };
var advantage = function (a, b) { return a >= 3 && b >= 3 && a > b; };
var wonGame = function (a, b) { return a >= 4 && winByTwo(a, b); };
var wonTiebreak = function (a, b) { return a >= 7 && winByTwo(a, b); };
var wonSet = function (a, b) { return a >= 6 && winByTwo(a, b); };
var Match = /** @class */ (function () {
    function Match(player1Name, player2Name) {
        this.player1Name = player1Name;
        this.player2Name = player2Name;
        this.player1 = { sets: 0, games: 0, points: 0 };
        this.player2 = { sets: 0, games: 0, points: 0 };
    }
    Match.prototype.pointWonBy = function (name) {
        this.getPlayerState(name).points += 1;
        // I don't **really** like creating references to class properties but will here for brevity
        var p1 = this.player1.points;
        var p2 = this.player2.points;
        var tiebreak = this.player1.games === 6 && this.player2.games === 6;
        if (tiebreak) {
            if (wonTiebreak(p1, p2)) {
                this.player1.sets += 1;
                this.resetScore();
                console.log("congratulations on winning the set, ".concat(this.player1Name));
                // we would reset games to 0 here too but it's not part of the brief.
            }
            else if (wonTiebreak(p2, p1)) {
                this.player2.sets += 1;
                this.resetScore();
                console.log("congratulations on winning the set, ".concat(this.player2Name));
            }
        }
        else { // check regular game winning conditions
            if (wonGame(p1, p2)) {
                this.player1.games += 1;
                this.resetScore();
            }
            else if (wonGame(p2, p1)) {
                this.player2.games += 1;
                this.resetScore();
            }
            // check set winning conditions
            if (wonSet(p1, p2)) {
                this.player1.sets += 1;
                console.log("congratulations on winning the set, ".concat(this.player1Name));
            }
            else if (wonSet(p2, p1)) {
                this.player2.sets += 1;
                console.log("congratulations on winning the set, ".concat(this.player2Name));
            }
        }
    };
    Match.prototype.score = function () {
        return "".concat(this.player1.games, "-").concat(this.player2.games, ", ").concat(this.currentGameScore());
    };
    Match.prototype.currentGameScore = function () {
        var p1 = this.player1.points; // brevity
        var p2 = this.player2.points;
        var tiebreak = this.player1.games === 6 && this.player2.games === 6;
        if (tiebreak)
            return "".concat(p1, "-").concat(p2);
        if (deuce(p1, p2))
            return "Deuce";
        if (advantage(p1, p2))
            return "Advantage ".concat(this.player1Name);
        if (advantage(p2, p1))
            return "Advantage ".concat(this.player2Name);
        return "".concat(this.getPrettyPointName(p1), "-").concat(this.getPrettyPointName(p2));
    };
    Match.prototype.getPrettyPointName = function (p) {
        var POINTS = ['0', '15', '30', '40'];
        return POINTS[p];
    };
    Match.prototype.resetScore = function () {
        this.player1.points = 0;
        this.player2.points = 0;
    };
    Match.prototype.getPlayerState = function (name) {
        if (name === this.player1Name) {
            return this.player1;
        }
        else {
            return this.player2;
        }
    };
    return Match;
}());
/* From dius_tennis README */
var match = new Match('player 1', 'player 2');
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
var tiebreakMatch = new Match('Josh', 'James');
for (var games = 0; games < 12; games++) {
    if (games % 2 === 0) {
        tiebreakMatch.pointWonBy('Josh');
        tiebreakMatch.pointWonBy('Josh');
        tiebreakMatch.pointWonBy('Josh');
        tiebreakMatch.pointWonBy('Josh');
    }
    else {
        tiebreakMatch.pointWonBy('James');
        tiebreakMatch.pointWonBy('James');
        tiebreakMatch.pointWonBy('James');
        tiebreakMatch.pointWonBy('James');
    }
}
console.log(tiebreakMatch.score());
// Now we get to the fun stuff. Let's take it to 6-6 and then I'll win by two :)
for (var p = 0; p < 12; p++) {
    if (p % 2 === 0) {
        tiebreakMatch.pointWonBy('Josh');
    }
    else {
        tiebreakMatch.pointWonBy('James');
    }
    console.log(tiebreakMatch.score());
}
tiebreakMatch.pointWonBy('Josh');
console.log(tiebreakMatch.score());
tiebreakMatch.pointWonBy('Josh');
// expecting to see a congratulatory message here
