import {Chess} from '../dependencies/chess.js';
import { GuiHandler } from './GuiHandler.js';
import { EvaluationGraph } from './EvaluationGraph.js';
import { stockfishOrchestrator } from './stockfishOrchestator.js';
import * as sacrifice from './sacrifice.js';
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
  private analysisArray:Record<number, any>[];

  constructor(stockfishOrchestratorInst, guiHandler){
      this.stockfishOrchestrator=stockfishOrchestratorInst;
      this.gameAnalysis=[];
      this.guiHandler=guiHandler;
      this.analysisArray=[];
      //var myself=this;
      this.stockfishOrchestrator.setCallback((data) => {this.sendEval(data)});

    }
  private calculateMoveBrilliance(playersMove, moveIndex){
      if(moveIndex==0){
        return "gray"
      }
      
      const isWhiteMove=moveIndex%2;

      const beforeMoveAnalysis=this.analysisArray[this.analysisArray.length-2];

      const afterMoveAnalysis=this.analysisArray[this.analysisArray.length-1];

      if (!(1 in beforeMoveAnalysis)){
        return "gray";
      }

      //console.log("CALCULATING BRILLIANCE", beforeMoveAnalysis, playersMove);
      //console.log(`i think the move ${this.moveArray[moveIndex-1].fromto}, ${moveIndex-1}`)
      //console.log(dataForFen);
      if (playersMove==beforeMoveAnalysis[0]["move"]){
        if(Math.abs((Math.abs(beforeMoveAnalysis[0]["CP"])-Math.abs(beforeMoveAnalysis[1]["CP"]))) > 100){
          if(sacrifice.didSacrificeIncrease(this.analysisArray[this.analysisArray.length-2][0]["FEN"], this.analysisArray[this.analysisArray.length-1][0]["FEN"])){
            return "brilliant";
          }else{
            return "great"
          }
        }else{
          return "best"
        }
      }
      
      const afterMoveCpDiscrepancy = (afterMoveAnalysis[0]["CP"] - beforeMoveAnalysis[0]["CP"]) * (isWhiteMove?1:-1);

      if (playersMove == beforeMoveAnalysis[1]["move"] && Math.abs((Math.abs(beforeMoveAnalysis[0]["CP"])-Math.abs(beforeMoveAnalysis[1]["CP"]))) < 100){
        return "good"
      }

      if (afterMoveCpDiscrepancy < -200 ){
        return "mistake";
      }  
      

      
      // if(afterMoveCpDiscrepancy)
      





      return "gray";
  }


  sendEval(dataFromStockfish){
    
    var dataForFen=dataFromStockfish["positionEvaluation"];
    var FENstring=dataFromStockfish["FENstring"];
    var regularMove = dataFromStockfish["regularMove"];
    var moveIndex = dataFromStockfish["moveIndex"];
    this.analysisArray.push(dataForFen);
    const moveAnalysis={}
    const centipawns=dataForFen[0]["CP"];

    if (dataForFen[0]["cpOrMate"]=="mate"){
      
      moveAnalysis["CP"]="M"+centipawns.toString();
      moveAnalysis["evaluation"]=49*(dataForFen[0]["isWhiteMove"]==true ? 1:-1);

    }else{
      var evalScoreForGraph = 50 * (2 / (1 + Math.exp(-0.004 * centipawns)) - 1)
      moveAnalysis["evaluation"]=evalScoreForGraph;
      moveAnalysis["CP"]=centipawns;
      
    }

    moveAnalysis["moveRating"]=this.calculateMoveBrilliance(regularMove, moveIndex);

    this.gameAnalysis.push(moveAnalysis);
    
    this.guiHandler.updateGraph(this.gameAnalysis);
  }
  
  async analyzePgnGame(fenMoves, moveArray, fromPerspective="black"){
      this.gameAnalysis=[]
      this.moveArray=moveArray;
      this.fromPerspective=fromPerspective;
      
      this.fenArray=fenMoves;
      
      for (let i=0; i<fenMoves.length; i++) {
        const fenMove=fenMoves[i];
        
        if(i==0){
          await this.stockfishOrchestrator.waitForRun(fenMove, "", i);
        }else{
          await this.stockfishOrchestrator.waitForRun(fenMove, moveArray[i-1].fromto, i);
        }
        //console.log(fenMove);
      }
  }
}
export {AnalysisOrchestrator};