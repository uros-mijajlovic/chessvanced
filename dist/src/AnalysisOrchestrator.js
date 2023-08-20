import { Chess } from '../dependencies/chess.js';
import { createStockfishOrchestrator } from './stockfishOrchestator.js';
import * as sacrifice from './sacrifice.js';
// ti za potez treba da gledas info od prethodnog, a ne od trenutnog !!!
function pgnToFenArr(pgnString) {
    const chessjs = Chess();
    chessjs.load_pgn(pgnString);
    const moves = chessjs.history();
    var fenMoves = [];
    const newChessjs = Chess();
    moves.forEach((move, index) => {
        newChessjs.move(move);
        fenMoves.push(newChessjs.fen());
    });
    return fenMoves;
}
class AnalysisOrchestrator {
    constructor(guiHandler) {
        this.stockfishOrchestrator = null;
        this.gameAnalysis = [];
        this.guiHandler = guiHandler;
        this.analysisArray = [];
        this.stopped = false;
        this.running = false;
        //var myself=this;
    }
    clearData() {
        this.gameAnalysis = [];
        this.analysisArray = [];
    }
    calculateMoveBrilliance(playersMove, moveIndex) {
        if (moveIndex == 0) {
            return "gray";
        }
        const isWhiteMove = moveIndex % 2;
        const beforeMoveAnalysis = this.analysisArray[this.analysisArray.length - 2];
        const afterMoveAnalysis = this.analysisArray[this.analysisArray.length - 1];
        if (!(1 in beforeMoveAnalysis)) {
            return "gray";
        }
        //console.log("CALCULATING BRILLIANCE", beforeMoveAnalysis, playersMove);
        //console.log(`i think the move ${this.moveArray[moveIndex-1].fromto}, ${moveIndex-1}`)
        //console.log(dataForFen);
        const afterMoveCpDiscrepancy = (afterMoveAnalysis[0]["CP"] - beforeMoveAnalysis[0]["CP"]) * (isWhiteMove ? 1 : -1);
        if (this.analysisArray.length > 2) {
            const afterLastMoveAnalysis = this.analysisArray[this.analysisArray.length - 3];
            if (afterMoveCpDiscrepancy > -75) {
                if (Math.abs(afterMoveAnalysis[0]["CP"]) < 75 || (isWhiteMove == 1 && afterMoveAnalysis[0]["CP"] > 0) || (isWhiteMove == 0 && afterMoveAnalysis[0]["CP"] < 0)) {
                    if (sacrifice.didSacrificeIncrease(afterLastMoveAnalysis[0]["FEN"], beforeMoveAnalysis[0]["FEN"], afterMoveAnalysis[0]["FEN"], playersMove)) {
                        return "brilliant";
                    }
                }
            }
        }
        if (playersMove == beforeMoveAnalysis[0]["move"]) {
            if (Math.abs((Math.abs(beforeMoveAnalysis[0]["CP"]) - Math.abs(beforeMoveAnalysis[1]["CP"]))) > 100) {
                return "great";
            }
            else {
                return "best";
            }
        }
        if (playersMove == beforeMoveAnalysis[1]["move"] && Math.abs((Math.abs(beforeMoveAnalysis[0]["CP"]) - Math.abs(beforeMoveAnalysis[1]["CP"]))) < 100) {
            return "good";
        }
        if (afterMoveCpDiscrepancy < -200) {
            return "mistake";
        }
        // if(afterMoveCpDiscrepancy)
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
        this.analysisArray.push(dataForFen);
        const moveAnalysis = {};
        const centipawns = dataForFen[0]["CP"];
        //console.log(FENstring, centipawns, dataForFen);
        if (dataForFen[0]["cpOrMate"] == "mate") {
            console.log(centipawns);
            console.log(dataForFen);
            const mateForOpposite = (centipawns > 0) ? 1 : -1;
            moveAnalysis["CP"] = "M" + centipawns.toString();
            moveAnalysis["evaluation"] = mateForOpposite * 49;
        }
        else {
            var evalScoreForGraph = 50 * (2 / (1 + Math.exp(-0.004 * centipawns)) - 1);
            moveAnalysis["evaluation"] = evalScoreForGraph;
            moveAnalysis["CP"] = centipawns;
        }
        moveAnalysis["moveRating"] = this.calculateMoveBrilliance(regularMove, moveIndex);
        this.gameAnalysis.push(moveAnalysis);
        this.guiHandler.updateGraph(this.gameAnalysis);
    }
    async stopAnalysis() {
        if (this.running == false) {
            return;
        }
        this.stopped = true;
        while (this.stopped) {
            console.log("Cekam");
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
        this.clearData();
        console.log("stopped and started new");
        //continue
    }
    async analyzePgnGame(fenMoves, moveArray, fromPerspective, alreadyAnalyzed = {}, analyzedFens = {}) {
        this.gameAnalysis = alreadyAnalyzed;
        this.analysisArray = analyzedFens;
        console.log("he alredy analyzed", alreadyAnalyzed, analyzedFens);
        console.log("KURAC");
        console.log("fenMoves", fenMoves);
        console.log("moveArray", moveArray);
        if (this.stockfishOrchestrator) {
            this.stockfishOrchestrator.deleteWorker();
        }
        await this.stopAnalysis();
        this.stockfishOrchestrator = await createStockfishOrchestrator(false);
        this.stockfishOrchestrator.analysisOrchestrator = this;
        this.stockfishOrchestrator.setCallback((data) => { this.sendEval(data); });
        console.log("Propusten dalje");
        this.running = true;
        this.moveArray = moveArray;
        this.fromPerspective = fromPerspective;
        this.fenArray = fenMoves;
        var alreadyAnalyzedMoveCount = this.gameAnalysis.length;
        this.guiHandler.updateGraph(this.gameAnalysis);
        for (let i = alreadyAnalyzedMoveCount; i < fenMoves.length; i++) {
            const fenMove = fenMoves[i];
            if (this.stopped) {
                console.log("nasilno stopiram");
                break;
            }
            if (i == 0) {
                await this.stockfishOrchestrator.waitForRun(fenMove, "", i);
            }
            else {
                await this.stockfishOrchestrator.waitForRun(fenMove, moveArray[i - 1].fromto, i);
            }
            //console.log(fenMove);
        }
        console.log("gotov");
        this.stopped = false;
        this.running = false;
    }
}
export { AnalysisOrchestrator };
