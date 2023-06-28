import {Chess} from './dependencies/chess.js';


function pgnToFenArr(pgnString){
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

class analysisOrchestrator {
  constructor(stockfishOrchestratorInst){
      this.stockfishOrchestrator=stockfishOrchestratorInst;
    }
  async analyzePgnGame(pgnString){
      const fenMoves=pgnToFenArr(pgnString);
      for (const fenMove of fenMoves) {
        await this.stockfishOrchestrator.waitForRun(fenMove);
        console.log(fenMove);
      }
  }
}
export {analysisOrchestrator};