import {Chess} from '../dependencies/chess.js';
import { GuiHandler } from './GuiHandler.js';
import { EvaluationGraph } from './EvaluationGraph.js';
import { stockfishOrchestrator } from './stockfishOrchestator.js';
function pgnToFenArr(pgnString){
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

class AnalysisOrchestrator {
  private stockfishOrchestrator:stockfishOrchestrator;
  private gameAnalysis:Record<string, any>;
  private guiHandler:GuiHandler;
  constructor(stockfishOrchestratorInst, guiHandler){
      this.stockfishOrchestrator=stockfishOrchestratorInst;
      this.gameAnalysis=[]
      this.guiHandler=guiHandler;
    }
  sendEval(cpScore, FENstring){
    this.gameAnalysis.push({"evaluation":cpScore/100,"moveRating":"grey"})
    this.guiHandler.updateGraph(this.gameAnalysis);
  }
  
  async analyzePgnGame(pgnString){
      const fenMoves=pgnToFenArr(pgnString);
      this.gameAnalysis=[]
      this.gameAnalysis.push({"evaluation":0,"moveRating":"grey"})
      for (const fenMove of fenMoves) {
        await this.stockfishOrchestrator.waitForRun(fenMove);
        console.log(fenMove);
      }
  }
}
export {AnalysisOrchestrator};