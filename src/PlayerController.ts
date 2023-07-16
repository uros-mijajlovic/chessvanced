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
  private mainChessObject: any;
  private alternativeChessObject:any;
  private alternativePathArray:string[];

  constructor(guiHandler:GuiHandler, analysisOrchestratorInst:AnalysisOrchestrator){
    this.currentPgn=null;
    this.analysisOrchestrator=analysisOrchestratorInst;
    this.guiHandler=guiHandler;
    this.currentMove=0;
    this.mainChessObject=Chess();
    this.alternativeChessObject=Chess();
    this.alternativePathArray=[]
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
    return this.mainChessObject;
  }
  public startAnalysis(){
    this.analysisOrchestrator.analyzePgnGame(this.currentFenArray, this.currentMoveArray);
  }
  public makeAlternativeMove(moveString:string){
    this.guiHandler.getChessboard().clearCircles();
    const lastMainMoveString=this.currentMoveArray[this.currentMove].from+this.currentMoveArray[this.currentMove].to;
    if(moveString==lastMainMoveString){
      this.gotoMove(this.currentMove+1);
    }else{
      return "snapback";
    }
  }
  public goBackwards(){
    //todo: ubaci proveru da li je alternative == main
    this.gotoMove(this.currentMove-1);
  }
  public goForwards(){
    //todo: ubaci proveru da li je alternative == main
    this.gotoMove(this.currentMove+1);
  }

  public gotoMove(index : number){
    
    
    if(index<0)index=0; // finxing bug with index=-1
    if (index>this.currentMoveArray.length)index=this.currentMoveArray.length
    this.currentMove=index;
    this.mainChessObject.load(this.currentFenArray[index]);
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