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
    this.analysisOrchestrator.analyzePgnGame(this.currentPgn);
  }
  public goBackwards(){
    this.gotoMove(this.currentMove-1);
  }
  public goForwards(){
    this.gotoMove(this.currentMove+1);
  }

  public gotoMove(index : number){
    
    if(index<0)index=0; // finxing bug with index=-1
    if (index>=this.currentMoveArray.length)index=this.currentMoveArray.length-1
    this.currentMove=index;
    console.log(`tryna go to move ${index}`)
    console.log(this.currentFenArray[index]);
    console.log(this.currentMoveArray[index]);
    
    this.guiHandler.setBoardAndMove(this.currentFenArray[index], this.currentMoveArray[index].substring(0, 2), this.currentMoveArray[index].substring(2, 4), index)
  }
}
export {PlayerController};