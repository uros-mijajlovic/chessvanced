import {Chess} from '../dependencies/chess.js';
import { GuiHandler } from './GuiHandler.js';
import { EvaluationGraph } from './EvaluationGraph.js';
import { stockfishOrchestrator } from './stockfishOrchestator.js';

// ti za potez treba da gledas info od prethodnog, a ne od trenutnog !!!


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
  private fromPerspective:string;
  constructor(stockfishOrchestratorInst, guiHandler){
      this.stockfishOrchestrator=stockfishOrchestratorInst;
      this.gameAnalysis=[]
      this.guiHandler=guiHandler;
    }
  private calculateMoveBrilliance(dataForFen, regularMove, moveIndex){
      if(moveIndex%2==0 && this.fromPerspective=="black"){
        return "gray";
      }else if(moveIndex%2==1 && this.fromPerspective=="white"){
        return "gray";
      }
      console.log(`i think the move ${this.moveArray[moveIndex-1].fromto}, ${moveIndex-1}`)
      console.log(dataForFen);
      if (1 in dataForFen && (Math.abs(dataForFen[0]["CP"])-Math.abs(dataForFen[1]["CP"])) > 200 ){
        return "brilliant";
      }




      return "gray";
  }


  sendEval(dataForFen:Record<number, number>, FENstring:string, regularMove:string, moveIndex:number){
    const moveAnalysis={}
    const evalScore=dataForFen[0]["CP"]/100;
    moveAnalysis["evaluation"]=evalScore;
    
    //console.log(`player played ${regularMove}, but the best move was ${dataForFen[0]["move"]}`);
    //console.log(dataForFen);
    moveAnalysis["moveRating"]=this.calculateMoveBrilliance(dataForFen, regularMove, moveIndex);

    // if (dataForFen[0]["move"]==regularMove && 1 in dataForFen && dataForFen[1]["CP"]-300>dataForFen[0]["CP"]){
      
    //   moveAnalysis["moveRating"]="brilliant";
    // }else{
    //   moveAnalysis["moveRating"]="grey";
    // }

    this.gameAnalysis.push(moveAnalysis);
    this.guiHandler.updateGraph(this.gameAnalysis);
  }
  
  async analyzePgnGame(fenMoves, moveArray, fromPerspective="black"){
      this.gameAnalysis=[]
      this.moveArray=moveArray;
      this.fromPerspective=fromPerspective;
      this.gameAnalysis.push({"evaluation":0,"moveRating":"grey"})
      this.fenArray=fenMoves;
      
      for (let i=0; i<fenMoves.length; i++) {
        const fenMove=fenMoves[i];
        
        console.log(`BABOVIC RETARD ${moveArray[i].fromto}, ${fenMove}`);
        await this.stockfishOrchestrator.waitForRun(fenMove, moveArray[i].fromto, i);
        console.log(fenMove);
      }
  }
}
export {AnalysisOrchestrator};