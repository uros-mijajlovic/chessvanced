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
  private moveArray:any[];
  private fenArray:string[];
  constructor(stockfishOrchestratorInst, guiHandler){
      this.stockfishOrchestrator=stockfishOrchestratorInst;
      this.gameAnalysis=[]
      this.guiHandler=guiHandler;
    }


  sendEval(dataForFen:Record<number, number>, FENstring:string, regularMove:string){
    const moveAnalysis={}
    const evalScore=dataForFen[0]["CP"]/100;
    moveAnalysis["evaluation"]=evalScore;
    
    console.log(`player played ${regularMove}, but the best move was ${dataForFen[0]["move"]}`);
    console.log(dataForFen);
    if (dataForFen[0]["move"]==regularMove && 1 in dataForFen && dataForFen[1]["CP"]-300>dataForFen[0]["CP"]){
      
      moveAnalysis["moveRating"]="brilliant";
    }else{
      moveAnalysis["moveRating"]="grey";
    }

    this.gameAnalysis.push(moveAnalysis);
    this.guiHandler.updateGraph(this.gameAnalysis);
  }
  
  async analyzePgnGame(fenMoves, moveArray){
      this.gameAnalysis=[]
      this.moveArray=moveArray;
      this.gameAnalysis.push({"evaluation":0,"moveRating":"grey"})
      this.fenArray=fenMoves;
      for (let i=1; i<fenMoves.length; i++) {
        const fenMove=fenMoves[i];

        await this.stockfishOrchestrator.waitForRun(fenMove, moveArray[i].fromto);
        console.log(fenMove);
      }
  }
}
export {AnalysisOrchestrator};