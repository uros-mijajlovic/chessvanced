import { Chess } from '../dependencies/chess.js';
import { GuiHandler } from './GuiHandler.js';
import { getWinPercentFromCP } from './utils/ChessboardUtils.js';
import { EvaluationGraph } from './EvaluationGraph.js';
import { stockfishOrchestrator } from './stockfishOrchestator.js';
import { createStockfishOrchestrator } from './stockfishOrchestator.js';
import * as sacrifice from './sacrifice.js';
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
  private analysisArray: Record<number, any>[];
  private stopped: boolean;
  private running: boolean;

  constructor(guiHandler) {
    this.stockfishOrchestrator = null;
    this.gameAnalysis = [];
    this.guiHandler = guiHandler;
    this.analysisArray = [];
    this.stopped = false;
    this.running = false;
    //var myself=this;


  }

  public clearData() {
    this.gameAnalysis = []
    this.analysisArray = []
  }
  private calculateMoveBrilliance(playersMove, moveIndex) {
    if (moveIndex == 0) {
      return "gray"
    }

    const isWhiteMove = moveIndex % 2;


    const beforeMoveAnalysis = this.analysisArray[this.analysisArray.length - 2];

    const afterMoveAnalysis = this.analysisArray[this.analysisArray.length - 1];

    const beforeMoveWinPercent = getWinPercentFromCP(afterMoveAnalysis[0]["CPreal"])
    const afterMoveWinPercent = getWinPercentFromCP(beforeMoveAnalysis[0]["CPreal"])


    if (!(1 in beforeMoveAnalysis)) {
      return "gray";
    }

    //console.log("CALCULATING BRILLIANCE", beforeMoveAnalysis, playersMove);
    //console.log(`i think the move ${this.moveArray[moveIndex-1].fromto}, ${moveIndex-1}`)
    //console.log(dataForFen);
    const afterMoveCpDiscrepancy = (afterMoveAnalysis[0]["CPreal"] - beforeMoveAnalysis[0]["CPreal"]) * (isWhiteMove ? 1 : -1);
    if (this.analysisArray.length > 2) {
      const afterLastMoveAnalysis = this.analysisArray[this.analysisArray.length - 3];
      if (afterMoveCpDiscrepancy > -75) {
        if (Math.abs(afterMoveAnalysis[0]["CPreal"]) < 75 || (isWhiteMove == 1 && afterMoveAnalysis[0]["CPreal"] > 0) || (isWhiteMove == 0 && afterMoveAnalysis[0]["CPreal"] < 0)) {
          if (sacrifice.didSacrificeIncrease(afterLastMoveAnalysis[0]["FEN"], beforeMoveAnalysis[0]["FEN"], afterMoveAnalysis[0]["FEN"], playersMove)) {
            return "brilliant";
          }
        }
      }
    }
    if (playersMove == beforeMoveAnalysis[0]["move"]) {
      if (Math.abs((Math.abs(beforeMoveAnalysis[0]["CPreal"]) - Math.abs(beforeMoveAnalysis[1]["CPreal"]))) > 100) {
        return "great";
      }
      else {
        return "best";
      }
    }
    if (playersMove == beforeMoveAnalysis[1]["move"] && Math.abs((Math.abs(beforeMoveAnalysis[0]["CPreal"]) - Math.abs(beforeMoveAnalysis[1]["CPreal"]))) < 100) {
      return "good";
    }
    const winPercentDiscrepancy = (afterMoveWinPercent - beforeMoveWinPercent) * (isWhiteMove ? -1 : 1)
    console.log("discrepancy", winPercentDiscrepancy);
    if (winPercentDiscrepancy < -30) {
      return "blunder";
  }
  if (winPercentDiscrepancy < -20) {
      return "mistake";
  }
  if (winPercentDiscrepancy < -10) {
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
    this.analysisArray.push(dataForFen);

    const moveAnalysis = {}

    const centipawns = dataForFen[0]["CP"];
    //console.log(FENstring, centipawns, dataForFen);

    if (dataForFen[0]["cpOrMate"] == "mate") {
      if (dataForFen[0]["isCheckmated"] == true) {
        moveAnalysis["CP"] = "M0";
        moveAnalysis["evaluation"] = -centipawns * 49;
        dataForFen[0]["CPreal"] = -centipawns * 2000;
      } else {
        console.log(centipawns);
        console.log(dataForFen);
        const mateForOpposite = (centipawns > 0) ? 1 : -1;
        moveAnalysis["CP"] = "M" + centipawns.toString();
        moveAnalysis["evaluation"] = mateForOpposite * 49;
        dataForFen[0]["CPreal"] = mateForOpposite * 2000;

      }

    } else {
      dataForFen[0]["CPreal"] = centipawns;
      var evalScoreForGraph = 50 * (2 / (1 + Math.exp(-0.004 * centipawns)) - 1)
      moveAnalysis["evaluation"] = evalScoreForGraph;
      moveAnalysis["CP"] = centipawns;

    }

    moveAnalysis["moveRating"] = this.calculateMoveBrilliance(regularMove, moveIndex);

    this.gameAnalysis.push(moveAnalysis);

    //console.log("gameAnalysis", JSON.stringify(this.gameAnalysis), "analsisArray", JSON.stringify(this.analysisArray), "moveArray", JSON.stringify(this.moveArray), "fenarray", JSON.stringify(this.fenArray))

    this.guiHandler.updateGraph(this.gameAnalysis);
    this.checkIfAnalysisFinalized(moveIndex+1);
    
  }

  private checkIfAnalysisFinalized(analyzedMoveCount){
    if(analyzedMoveCount==this.moveArray.length){
      console.log("analysis finalized")
      
    }else{
      console.log("analysis is not yet done", analyzedMoveCount, this.moveArray.length)
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
  async analyzePgnGame(fenMoves, moveArray, fromPerspective, alreadyAnalyzed = [], analyzedFens = []) {

    await this.stopAnalysis();

    if (alreadyAnalyzed) {
      this.gameAnalysis = alreadyAnalyzed;
    }
    if (analyzedFens) {
      this.analysisArray = analyzedFens;
    }

    console.log("he alredy analyzed", alreadyAnalyzed, analyzedFens);
    console.log("KURAC")
    console.log("fenMoves", fenMoves);
    console.log("moveArray", moveArray);
    if (this.stockfishOrchestrator) {
      this.stockfishOrchestrator.deleteWorker();
    }



    this.stockfishOrchestrator = await createStockfishOrchestrator(false);

    this.stockfishOrchestrator.analysisOrchestrator = this;

    this.stockfishOrchestrator.setCallback((data) => { this.sendEval(data) });

    console.log("Propusten dalje")

    this.running = true;
    this.moveArray = moveArray;
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