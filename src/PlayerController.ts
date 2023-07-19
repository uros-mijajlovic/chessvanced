import { AnalysisOrchestrator } from "./AnalysisOrchestrator";
import { GuiHandler } from "./GuiHandler";
import { PgnToFenArr, PgnToMoveArr } from "./sacrifice.js";
import { Chess } from "../dependencies/chess.js";
import { Config } from "./config/config.js";
import { LiveBoardEvaluation } from "./LiveBoardEvaluation";
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
  private inAlternativePath:boolean;
  private liveBoardEvaluation:LiveBoardEvaluation;
  constructor(guiHandler:GuiHandler, analysisOrchestratorInst:AnalysisOrchestrator, liveBoardEvaluationInst:LiveBoardEvaluation){
    this.liveBoardEvaluation=liveBoardEvaluationInst;
    this.currentPgn=null;
    this.analysisOrchestrator=analysisOrchestratorInst;
    this.guiHandler=guiHandler;
    this.currentMove=0;
    this.mainChessObject=Chess();
    this.alternativeChessObject=Chess();
    this.alternativePathArray=[];
    this.inAlternativePath=false;
    this.liveBoardEvaluation=liveBoardEvaluationInst;

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
    if(this.inAlternativePath){
      return this.alternativeChessObject;
    }else{
      return this.mainChessObject;
    }
  }
  public getAlternativeChessObject(){
    return this.alternativeChessObject;
  }
  public getInAlternative(){
    return this.inAlternativePath;
  }
  public startAnalysis(){
    this.analysisOrchestrator.analyzePgnGame(this.currentFenArray, this.currentMoveArray);
  }
  private updateBoardGUI(newFen, from, to, currentMove, MOVE_TYPE){

    this.guiHandler.setBoardAndMove(newFen, from, to, currentMove, MOVE_TYPE);
    this.liveBoardEvaluation.evaulateNewBoard(newFen);

  }
  public makeAlternativeMove(moveString:string, promotionPiece:string){
    this.guiHandler.getChessboard().clearCircles();
    const lastMainMoveString=this.currentMoveArray[this.currentMove].from+this.currentMoveArray[this.currentMove].to;
    console.log(moveString, promotionPiece)
    console.log("K");
    
    if(this.inAlternativePath==true){
      const from=moveString.substring(0, 2);
      const to = moveString.substring(2, 4);
      const moveCheck = this.alternativeChessObject.move({
          from: from,
          to: to,
          promotion: promotionPiece
      });

      console.log(moveCheck, moveString, this.alternativeChessObject.fen());
      if(moveCheck){
        const currentFen = this.alternativeChessObject.fen();
        
        this.inAlternativePath=true;
        this.updateBoardGUI(currentFen, from, to, this.currentMove, Config.MOVE_TYPE.MOVE_REGULAR);
        this.alternativePathArray.push(moveString);
      }else{
        return "snapback";
      }


    }else{
      if(moveString==lastMainMoveString){
        this.gotoMove(this.currentMove+1);
      }else{
        const from=moveString.substring(0, 2);
        const to = moveString.substring(2, 4);
        const moveCheck = this.alternativeChessObject.move({
            from: from,
            to: to,
            promotion: promotionPiece
        });
        console.log(moveCheck, moveString, this.alternativeChessObject.fen());
        if(moveCheck){
          const currentFen = this.alternativeChessObject.fen();
          this.inAlternativePath=true;
          this.updateBoardGUI(currentFen, from, to, this.currentMove, Config.MOVE_TYPE.MOVE_REGULAR);
          this.alternativePathArray.push(moveString);
        }else{
          return "snapback";
        }


        //idemo alternativnim putem
        
      }
    }
  }
  public goBackwards(){
    //todo: ubaci proveru da li je alternative == main
    if(this.inAlternativePath){
      const lastMoveString=this.alternativePathArray.pop();

      const from=lastMoveString.substring(0, 2);
      const to = lastMoveString.substring(2, 4);

      this.alternativeChessObject.undo();
      this.guiHandler.setBoardAndMove(this.alternativeChessObject.fen(), from, to, this.currentMove, Config.MOVE_TYPE.MOVE_REGULAR);
      if(this.alternativeChessObject.fen() == this.mainChessObject.fen()){
        this.inAlternativePath=false;
      }
    }else{
      this.gotoMove(this.currentMove-1);
    }
  }
  public goForwards(){
    //todo: ubaci proveru da li je alternative == main
    this.gotoMove(this.currentMove+1);
  }

  public gotoMove(index : number){
    
    this.inAlternativePath=false;
    if(index<0)index=0; // finxing bug with index=-1
    if (index>this.currentMoveArray.length)index=this.currentMoveArray.length
    this.currentMove=index;
    this.mainChessObject.load(this.currentFenArray[index]);
    this.alternativeChessObject.load(this.currentFenArray[index]);
    if(index>0){
      console.log(this.currentFenArray[index]);
      const moveFlag=this.currentMoveArray[index-1].flags;
      const moveType=this.getMoveType(moveFlag);

      this.updateBoardGUI(this.currentFenArray[index], this.currentMoveArray[index-1].fromto.substring(0, 2), this.currentMoveArray[index-1].fromto.substring(2, 4), index, moveType);
    }else{
      this.updateBoardGUI(this.currentFenArray[index], "", "", index, Config.MOVE_TYPE.MOVE_REGULAR);
    }
  }
}
export {PlayerController};