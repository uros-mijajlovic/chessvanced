import { AnalysisOrchestrator } from "./AnalysisOrchestrator";
import { GuiHandler } from "./GuiHandler";
import { PgnToFenArr, PgnToMoveArr } from "./sacrifice.js";
//import { PgnToFenArr, PgnToMoveArr } from "./sacrifice";

class PlayerController {
  private guiHandler:GuiHandler;
  private currentMove:number;
  private currentPgn:string;
  private currentFenArray:string[];
  private analysisOrchestrator:AnalysisOrchestrator;
  private currentMoveArray:string[];
  constructor(guiHandler:GuiHandler, analysisOrchestratorInst:AnalysisOrchestrator){
    this.currentPgn=null;
    this.analysisOrchestrator=analysisOrchestratorInst;
    this.guiHandler=guiHandler;
    this.currentMove=0;
    
    //console.log(this.currentMoveArray);
    //console.log(this.currentFenArray);
  }

  public setPgn(pgnString){
    this.currentPgn=pgnString;
    this.currentFenArray=PgnToFenArr(this.currentPgn);
    this.currentMoveArray=PgnToMoveArr(this.currentPgn);
    this.guiHandler.updateSidebar(pgnString);
    this.startAnalysis();
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
    if(index>0){
      this.guiHandler.setBoardAndMove(this.currentFenArray[index], this.currentMoveArray[index-1].substring(0, 2), this.currentMoveArray[index-1].substring(2, 4), index)
    }else{
      this.guiHandler.setBoardAndMove(this.currentFenArray[index], "", "", index)
    }
  }
}
export {PlayerController};