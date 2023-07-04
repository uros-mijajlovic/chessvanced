
import {Chess} from '../dependencies/chess.js';
import {pgn_string_1, fen_string_1} from './const/constGames.js';
import {stockfish, stockfishOrchestratorInst} from './connectStockfish.js'

const globalAnalysisDepth=10;

const figureValues = {
    'Q': 9,     // Queen
    'R': 5,     // Rook
    'B': 3,     // Bishop
    'N': 3,     // Knight
    'P': 1      // Pawn
  };
export function PgnToFenArr(pgnString: string){
  const chessjs=Chess();
  chessjs.load_pgn(pgnString);
  const moves = chessjs.history();
  var fenMoves=[];

  const newChessjs=Chess()
  moves.forEach((move, index) => {
    newChessjs.move(move);
    fenMoves.push(newChessjs.fen());
  });
  return fenMoves;
}
export function PgnToMoveArr(pgnString:string){

  const chessjs=Chess();
  chessjs.load_pgn(pgnString);
  const moves = chessjs.history();
  var strMoves=[];

  moves.forEach((move, index) => {
    strMoves.push(move);
  });

  return strMoves;

}

function isMoveEinstein(fenBefore, fenAfter){
  return findMaxAdvantage(fenBefore)<findMaxAdvantage(fenAfter);
}

function findMaxAdvantage(fen) {
    var maxAdvantage=0
    var bestMove=null
    const chess = Chess();
    chess.load(fen);
    const moves=chess.moves()

    console.log(chess.ascii())
    
    for (let i = 0; i < moves.length; i++) {
        const checkMove=chess.move(moves[i])
        if(checkMove.captured!=undefined){
            var piece=checkMove.captured.toUpperCase()
            
            if(figureValues[piece]>maxAdvantage){
                maxAdvantage=figureValues[piece]
                bestMove= moves[i]
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




