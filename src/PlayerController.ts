import { AnalysisOrchestrator } from "./AnalysisOrchestrator";
import { GuiHandler } from "./GuiHandler";
import { PgnToFenArr, PgnToMoveArr } from "./sacrifice.js";
import { Chess } from "../dependencies/chess.js";
import { Config } from "./config/config.js";
//import { PgnToFenArr, PgnToMoveArr } from "./sacrifice";

class PlayerController {
  private guiHandler:GuiHandler;
  private currentMove:number;
  private currentPgn:string;
  private currentFenArray:string[];
  private analysisOrchestrator:AnalysisOrchestrator;
  private currentMoveArray:any[];
  private chessObject: any;
  constructor(guiHandler:GuiHandler, analysisOrchestratorInst:AnalysisOrchestrator){
    this.currentPgn=null;
    this.analysisOrchestrator=analysisOrchestratorInst;
    this.guiHandler=guiHandler;
    this.currentMove=0;
    this.chessObject=Chess();
    //console.log(this.currentMoveArray);
    //console.log(this.currentFenArray);
  }

  private getMoveType(flag){

    if(flag=="c"){
      return Config.MOVE_TYPE.MOVE_CAPTURE
    }else{
      return Config.MOVE_TYPE.MOVE_REGULAR
    }

  }

  public setPgn(pgnString){
    this.currentPgn=pgnString;
    this.currentFenArray=PgnToFenArr(this.currentPgn);
    this.currentMoveArray=PgnToMoveArr(this.currentPgn);
    this.guiHandler.updateSidebar(pgnString);
    
    this.startAnalysis();
  }
  public getChessObject(){
    return this.chessObject;
  }
  public startAnalysis(){
    this.analysisOrchestrator.analyzePgnGame(this.currentFenArray, this.currentMoveArray);
  }
  public goBackwards(){
    this.gotoMove(this.currentMove-1);
  }
  public goForwards(){
    this.gotoMove(this.currentMove+1);
  }

  public gotoMove(index : number){
    
    
    if(index<0)index=0; // finxing bug with index=-1
    if (index>this.currentMoveArray.length)index=this.currentMoveArray.length
    this.currentMove=index;
    this.chessObject.load(this.currentFenArray[index]);
    if(index>0){
      console.log(this.currentFenArray[index]);
      const moveFlag=this.currentMoveArray[index-1].flags;
      const moveType=this.getMoveType(moveFlag);
      this.guiHandler.setBoardAndMove(this.currentFenArray[index], this.currentMoveArray[index-1].fromto.substring(0, 2), this.currentMoveArray[index-1].fromto.substring(2, 4), index, moveType)
    }else{
      this.guiHandler.setBoardAndMove(this.currentFenArray[index], "", "", index, Config.MOVE_TYPE.MOVE_REGULAR);
    }
  }
}
export {PlayerController};