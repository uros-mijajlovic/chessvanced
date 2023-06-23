
import {Chess} from './chess.js';
import {pgn_string_1, fen_string_1} from './constGames.js';
import {stockfish} from './connectStockfish.js'

const globalAnalysisDepth=10;
stockfish.addEventListener('message', function (e) {
  
  const pattern = new RegExp(`^info depth ${globalAnalysisDepth}\\b.*`);
  const message=e.data;
  if (pattern.test(message)){
    console.log(message);
  }


  // var match = message.match(pattern);
  // if (match && match.length > 1) {
    
  //   var bestMove = match[1];
  //   var h2Element = document.getElementById('bestMoveSpot');
  //   h2Element.textContent = bestMove;
  // }
});


const figureValues = {
    'Q': 9,     // Queen
    'R': 5,     // Rook
    'B': 3,     // Bishop
    'N': 3,     // Knight
    'P': 1      // Pawn
  };
function PgnToFenArr(pgnString){
  const chessjs=new Chess();
  chessjs.load_pgn(pgnString);
  const moves = chessjs.history();
  var fenMoves=[];

  const newChessjs=new Chess()
  moves.forEach((move, index) => {
    newChessjs.move(move);
    fenMoves.push(newChessjs.fen());
  });
  return fenMoves;
}

function analyze(pgnString){
  const fenMoves=PgnToFenArr(pgnString);
  fenMoves.forEach((fenMove, index) => {
    console.log(`Move ${index + 1}: ${fenMove}`);
  });
}

function isMoveEinstein(fenBefore, fenAfter){
  return findMaxAdvantage(fenBefore)<findMaxAdvantage(fenAfter);
}

function findMaxAdvantage(fen) {
    var maxAdvantage=0
    var bestMove=0
    const chess = new Chess();
    chess.load(fen);
    const moves=chess.moves()

    console.log(chess.ascii())
    
    for (let i = 0; i < moves.length; i++) {
        const checkMove=chess.move(moves[i])
        if(checkMove.captured!=undefined){
            var piece=checkMove.captured.toUpperCase()
            
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




findMaxAdvantage(fen_string_1);
analyze(pgn_string_1);

stockfish.postMessage('position fen '+ fen_string_1);
stockfish.postMessage('go depth 16');
