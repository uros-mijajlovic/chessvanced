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
  sendEval(dataForFen:Record<number, number>, FENstring:string, regularMove:string){
    const moveAnalysis={}
    const evalScore=dataForFen[0]/100;
    moveAnalysis["evaluation"]=evalScore;
    
    if (1 in dataForFen && dataForFen[1]+200<dataForFen[0]){
      console.log(dataForFen);
      moveAnalysis["moveRating"]="brilliant";
    }else{
      moveAnalysis["moveRating"]="grey";
    }
    this.gameAnalysis.push(moveAnalysis);
    this.guiHandler.updateGraph(this.gameAnalysis);
  }
  
  async analyzePgnGame(fenMoves, regularMoves){
      this.gameAnalysis=[]
      this.gameAnalysis.push({"evaluation":0,"moveRating":"grey"})
      for (let i=1; i<fenMoves.length; i++) {
        const fenMove=fenMoves[i];
        await this.stockfishOrchestrator.waitForRun(fenMove, regularMoves[i-1]);
        console.log(fenMove);
      }
  }
}
export {AnalysisOrchestrator};