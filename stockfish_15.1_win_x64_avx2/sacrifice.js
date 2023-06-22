const Chess = require('chess.js').Chess;

const figureValues = {
    'Q': 9,     // Queen
    'R': 5,     // Rook
    'B': 3,     // Bishop
    'N': 3,     // Knight
    'P': 1      // Pawn
  };


function printPossibleMoves(fen) {
    var maxAdvantage=0
    var bestMove=0
    const chess = new Chess();
    chess.load(fen);
    const moves=chess.moves()

    console.log(chess.ascii())
    
    for (let i = 0; i < moves.length; i++) {
        const checkMove=chess.move(moves[i])
        if(checkMove.captured!=undefined){
            piece=checkMove.captured.toUpperCase()
            
            if(figureValues[piece]>maxAdvantage){
                maxAdvantage=figureValues[piece]
                bestMove=moves[i]
            }
        }
        chess.undo();
      }
    if (maxAdvantage>0){
        console.log(maxAdvantage)
        console.log(bestMove)
    }
    
  }
const playerColor='w'
const fen = "r1bqkbnr/1p1p1ppp/p1N1p3/8/4P3/2N5/PPP2PPP/R1BQKB1R w";
printPossibleMoves(fen);