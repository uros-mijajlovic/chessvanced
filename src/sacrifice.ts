
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
  fenMoves.push(newChessjs.fen());
  moves.forEach((move, index) => {
    newChessjs.move(move);
    fenMoves.push(newChessjs.fen());
  });
  return fenMoves;
}
export function PgnToMoveArr(pgnString:string){

  const chessjs=Chess();
  chessjs.load_pgn(pgnString);
  const moves = chessjs.history({ verbose: true });

  moves.forEach((move, index) => {
    move.fromto=move.from + move.to;
  });

  return moves;

}

export function didSacrificeIncrease(fenBefore, fenAfter){
  const maxAdvantageBefore = findMaxAdvantage(fenBefore, true);
  const maxAdvantageAfter = findMaxAdvantage(fenAfter, false)
  console.log(`COMPARE ADVANTAGES ${maxAdvantageBefore}, ${maxAdvantageAfter}`);
  return maxAdvantageBefore<maxAdvantageAfter;
}



function findMaxAdvantage(fen:string, swapSide:boolean) {


    var maxAdvantage=0
    var bestMove=null
    const chess = Chess();

    if(swapSide==true){
      console.log(`i took da string${fen}`)
      var splittedString=fen.split(" ");
      if (splittedString[1]=="w"){
        splittedString[1]="b";
      }else{
        splittedString[1]="w";
      }
      fen=splittedString.join(" ");
      console.log(`and transformed it into${fen}`)
    }
    chess.load(fen);
    
    const moves=chess.moves()

    console.log(chess.ascii())
    
    for (let i = 0; i < moves.length; i++) {
        const checkMove=chess.move(moves[i])
        if(checkMove.captured!=undefined){
            var piece=checkMove.captured.toUpperCase()

            //Static exchange evaluation might be needed here
            


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

    return maxAdvantage;
    
  }
const playerColor='w'




