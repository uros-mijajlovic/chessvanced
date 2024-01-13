import { Chess } from '../dependencies/chess.js';
import { GuiHandler } from './GuiHandler.js';
import { getWinPercentFromCP, parseFenDataFromStockfish } from './utils/ChessboardUtils.js';
import { EvaluationGraph } from './EvaluationGraph.js';
import { stockfishOrchestrator } from './stockfishOrchestator.js';
import { createStockfishOrchestrator } from './stockfishOrchestator.js';
import * as sacrifice from './sacrifice.js';
import { OpeningsBase } from './OpeningsBase.js';
// ti za potez treba da gledas info od prethodnog, a ne od trenutnog !!!


function pgnToFenArr(pgnString) {
  const chessjs = Chess();
  chessjs.load_pgn(pgnString);
  const moves = chessjs.history();
  var fenMoves = [];

  const newChessjs = Chess()
  moves.forEach((move, index) => {
    newChessjs.move(move);
    fenMoves.push(newChessjs.fen());
  });
  return fenMoves;
}

class AnalysisOrchestrator {
  private stockfishOrchestrator: stockfishOrchestrator;
  private gameAnalysis: Record<string, any>;
  private guiHandler: GuiHandler;
  private moveArray: any[];
  private fenArray: string[];
  private fromPerspective: string;
  private allDataAnalysisArray: Record<number, any>[];
  private stopped: boolean;
  private running: boolean;
  private playerElos:number[];
  private openingsBase: OpeningsBase

  constructor(guiHandler) {
    this.stockfishOrchestrator = null;
    this.gameAnalysis = [];
    this.guiHandler = guiHandler;
    this.allDataAnalysisArray = [];
    this.stopped = false;
    this.running = false;
    this.openingsBase = new OpeningsBase()
    
  }

  public clearData() {
    this.gameAnalysis = []
    this.allDataAnalysisArray = []
  }

  //moveIndex 0 is actually the board before anyone has played a move
  public async loadOpeningsBase(){
    await this.openingsBase.loadOpenings()
  }
  private calculateMoveBrilliance(playersMove, moveIndex) {
    if (moveIndex == 0) {
      return "gray"
    }

    var movesString=""
    for(let i = 0; i < moveIndex; i++){
      
      try{
        movesString+=this.moveArray[i]["san"]
      }catch(error){
        alert("Alou fejl "+this.moveArray[i])
      }
    }
    if(this.openingsBase.isBookMove(movesString)){
      return "book move"
    }
    

    const isWhiteMove = (moveIndex) % 2;

    const beforeMoveAnalysis = this.allDataAnalysisArray[moveIndex-1];

    const afterMoveAnalysis = this.allDataAnalysisArray[moveIndex];

    const beforeMoveWinPercent = getWinPercentFromCP(afterMoveAnalysis[0]["CPreal"])
    const afterMoveWinPercent = getWinPercentFromCP(beforeMoveAnalysis[0]["CPreal"])

    const winPercentForThePlayer = ( (isWhiteMove? 0:100) - (afterMoveWinPercent)*(isWhiteMove?-1:1))
    if (!(1 in beforeMoveAnalysis)) {
      return "gray";
    }

    

    //console.log(`i think the move ${this.moveArray[moveIndex-1].fromto}, ${moveIndex-1}`)
    //console.log(dataForFen);
    const afterMoveCpDiscrepancy = (afterMoveAnalysis[0]["CPreal"] - beforeMoveAnalysis[0]["CPreal"]) * (isWhiteMove ? 1 : -1);
    //console.log("After move cp discrepancy", afterMoveCpDiscrepancy)
    if (moveIndex >= 2) {
      const afterLastMoveAnalysis = this.allDataAnalysisArray[moveIndex-2];
      console.log("WP FOR PLAYER", winPercentForThePlayer, afterMoveWinPercent, isWhiteMove)
      if (afterMoveCpDiscrepancy > -75) {
        if (Math.abs(afterMoveAnalysis[0]["CPreal"]) < 75 || (isWhiteMove == 1 && afterMoveAnalysis[0]["CPreal"] > 0) || (isWhiteMove == 0 && afterMoveAnalysis[0]["CPreal"] < 0)) {
          var [didSacrificeIncrease, didPlayerMoveSacrificedFigure] = sacrifice.didSacrificeIncrease(afterLastMoveAnalysis[0]["FEN"], beforeMoveAnalysis[0]["FEN"], afterMoveAnalysis[0]["FEN"], playersMove)
          console.log("SACLOG", didSacrificeIncrease, didPlayerMoveSacrificedFigure)
          if (didSacrificeIncrease) {
            if(winPercentForThePlayer>90 && didPlayerMoveSacrificedFigure==false){
              
            }else{
              return "brilliant";
            }
          }
        }
      }
    }
    const firstVsSecondBestMoveCP=Math.abs((Math.abs(beforeMoveAnalysis[0]["CPreal"]) - Math.abs(beforeMoveAnalysis[1]["CPreal"])));
    const firstBest = getWinPercentFromCP(beforeMoveAnalysis[0]["CPreal"])
    const secondBest = getWinPercentFromCP(beforeMoveAnalysis[1]["CPreal"])

    const firstVsSecondBestMoveWP = ( (isWhiteMove? 0:100) - (firstBest)*(isWhiteMove?-1:1)) - ( (isWhiteMove? 0:100) - (secondBest)*(isWhiteMove?-1:1))

    if (playersMove == beforeMoveAnalysis[0]["move"]) {
      console.log(beforeMoveAnalysis[0]["CPreal"], beforeMoveAnalysis[1]["CPreal"]);
      console.log(playersMove, beforeMoveAnalysis[0]["move"], firstVsSecondBestMoveCP);

      if (firstVsSecondBestMoveWP > 15) {
        return "great";
      }
      else {
        return "best";
      }
    }
    if (playersMove == beforeMoveAnalysis[1]["move"] && firstVsSecondBestMoveCP < 100) {
      return "good";
    }
    const winPercentDiscrepancy = (afterMoveWinPercent - beforeMoveWinPercent) * (isWhiteMove ? -1 : 1)
    //console.log("discrepancy", winPercentDiscrepancy);
    if (winPercentDiscrepancy < -20) {
      return "blunder";
  }
  if (winPercentDiscrepancy < -13) {
      return "mistake";
  }
  if (winPercentDiscrepancy < -7) {
      return "inaccuracy";
  }
    return "gray";
  }


  sendEval(dataFromStockfish) {

    if (this.stopped) {
      return;
    }
    var dataForFen = dataFromStockfish["positionEvaluation"];
    var FENstring = dataFromStockfish["FENstring"];
    var regularMove = dataFromStockfish["regularMove"];
    var moveIndex = dataFromStockfish["moveIndex"];

    //console.log("my analysisArray is", this.analysisArray, "and dataFromStockfish Is", dataFromStockfish)
    this.allDataAnalysisArray.push(dataForFen);

    const moveAnalysis = parseFenDataFromStockfish(dataForFen);

    moveAnalysis["moveRating"] = this.calculateMoveBrilliance(regularMove, moveIndex);

    this.gameAnalysis.push(moveAnalysis);

    //console.log("gameAnalysis", JSON.stringify(this.gameAnalysis), "analsisArray", JSON.stringify(this.analysisArray), "moveArray", JSON.stringify(this.moveArray), "fenarray", JSON.stringify(this.fenArray))

    this.guiHandler.updateGraph(this.gameAnalysis);
    this.checkIfAnalysisFinalized(moveIndex+1);
    
  }

  private checkIfAnalysisFinalized(analyzedMoveCount){
    if(analyzedMoveCount==this.moveArray.length){
      this.guiHandler.getEloEstimator().calculateElo(this.gameAnalysis, this.fromPerspective, this.playerElos);
    }
  }

  async stopAnalysis() {

    if (this.running == false) {
      return;
    }
    this.stopped = true;

    while (this.stopped) {
      console.log("Cekam")
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    this.clearData();
    console.log("stopped and started new")
    //continue
  }
  async analyzePgnGame(fenMoves, moveArray, fromPerspective, alreadyAnalyzed = [], analyzedFens = [], playerElos=[]) {
    this.playerElos=playerElos;
    await this.stopAnalysis();
    this.gameAnalysis=[]
    this.moveArray = moveArray;
    if (analyzedFens) {
      this.allDataAnalysisArray = analyzedFens;
    }
    
    for(let i =0; i<this.allDataAnalysisArray.length; i++){
      const data=this.allDataAnalysisArray[i];
      var moveAnalysis={}
      if (i==0){
        moveAnalysis=parseFenDataFromStockfish(data)
        moveAnalysis["moveRating"] = "gray"

      }else{
        const regularMove=moveArray[i-1].fromto;
        const moveIndex=i;
        moveAnalysis=parseFenDataFromStockfish(data)
        moveAnalysis["moveRating"] = this.calculateMoveBrilliance(regularMove, moveIndex);
      }
      this.gameAnalysis.push(moveAnalysis);
    }
    //console.log("he alredy analyzed", alreadyAnalyzed, this.gameAnalysis);
    //console.log("KURAC")
    //console.log("fenMoves", fenMoves);
    //console.log("moveArray", moveArray);
    
    if (this.stockfishOrchestrator) {
      this.stockfishOrchestrator.deleteWorker();
    }
    this.stockfishOrchestrator = await createStockfishOrchestrator(false);

    this.stockfishOrchestrator.analysisOrchestrator = this;

    this.stockfishOrchestrator.setCallback((data) => { this.sendEval(data) });

    console.log("Propusten dalje")

    this.running = true;
    
    this.fromPerspective = fromPerspective;
    this.fenArray = fenMoves;

    var alreadyAnalyzedMoveCount
    if (this.gameAnalysis) {
      alreadyAnalyzedMoveCount = this.gameAnalysis.length;
    } else {
      alreadyAnalyzedMoveCount = 0;
    }
    this.checkIfAnalysisFinalized(alreadyAnalyzedMoveCount-1);

    this.guiHandler.updateGraph(this.gameAnalysis);
    for (let i = alreadyAnalyzedMoveCount; i < fenMoves.length; i++) {

      const fenMove = fenMoves[i];

      if (this.stopped) {
        console.log("nasilno stopiram")
        break;
      }
      if (i == 0) {
        await this.stockfishOrchestrator.waitForRun(fenMove, "", i);
      } else {
        await this.stockfishOrchestrator.waitForRun(fenMove, moveArray[i - 1].fromto, i);
      }
      //console.log(fenMove);
    }
    console.log("gotov")
    this.stopped = false;
    this.running = false;
  }


}
export { AnalysisOrchestrator };