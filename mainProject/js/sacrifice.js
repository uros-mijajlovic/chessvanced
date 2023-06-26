
import {Chess} from './chess.js';
import {pgn_string_1, fen_string_1} from './constGames.js';
import {stockfish, analysisWorker} from './connectStockfish.js'
const globalAnalysisDepth=10;

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

async function analyze (pgnString){
  const fenMoves=PgnToFenArr(pgnString);
  fenMoves.forEach(async (fenMove, index) => {
    
    console.log(fenMove);
    stockfish.postMessage('position fen '+ fenMove);
    stockfish.postMessage('go depth 10');
    //analysisWorker.postMessage()
    //console.log(item+'k');
    
    
    //console.log(`Move ${index + 1}: ${fenMove},eval`);
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




await analyze(pgn_string_1);


