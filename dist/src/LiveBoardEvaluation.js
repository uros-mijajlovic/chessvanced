//govori GUI handleru sta da crta
//moze stockfishOrchestrator da se adaptira za ovu upotrebu mozda
//prima novi fen, salje to SO-u
//so ima callback nakon svakog depth-a
//i crtace sta je potrebno nacrtati
import { algebraicToSEN } from "./utils/ChessboardUtils.js";
export class LiveBoardEvaluation {
    constructor(stockfishOrchestratorInst, guiHandler, divForEvaluation) {
        this.stockfishOrchestrator = stockfishOrchestratorInst;
        this.guiHandler = guiHandler;
        this.stockfishOrchestrator.setCallback((data) => { this.evaluationGetCallback(data); });
        this.div = divForEvaluation;
        this.enabled = false;
        this.lastFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        const toggleSwitch = document.getElementById("toggleSwitch");
        toggleSwitch.addEventListener("change", this.toggleSwitched.bind(this));
        //const isDivInvisible = window.getComputedStyle(myDiv).display === 'none';
    }
    disableAllLines() {
        var evaluationLineDivs = this.div.children;
        for (let i = 0; i < evaluationLineDivs.length; i++) {
            const evaluationLine = evaluationLineDivs[i];
            evaluationLine.style.display = 'none';
        }
    }
    toggleSwitched() {
        this.enabled = !this.enabled;
        if (this.enabled) {
            this.evaulateNewBoard(this.lastFen);
        }
        else {
            this.disableAllLines();
            this.guiHandler.clearArrows();
        }
    }
    evaluationGetCallback(stockfishData) {
        var data = stockfishData["positionEvaluation"];
        if (this.enabled) {
            var evaluationLineDivs = this.div.children;
            let i = 0;
            const bestMove = data[0]["move"];
            this.guiHandler.addBestMoveArrow(bestMove);
            while (i in data) {
                var evaluationLine = evaluationLineDivs[i];
                const isLineInvisible = window.getComputedStyle(evaluationLine).display === 'none';
                if (isLineInvisible) {
                    evaluationLine.style.display = 'flex';
                }
                console.log(data[i]["allMoves"]);
                const senArray = algebraicToSEN(data[i]["allMoves"], data[i]["FEN"]);
                evaluationLine.querySelector(".liveBestMove").textContent = senArray.slice(0, 8).join(", ");
                if (data[i]["cpOrMate"] == "cp") {
                    const isPositiveEvaluation = (parseFloat(data[i]["CP"]) / 100) > 0;
                    evaluationLine.querySelector(".liveEvaluation").textContent = (isPositiveEvaluation ? "+" : "") + (parseFloat(data[i]["CP"]) / 100).toString();
                }
                else {
                    evaluationLine.querySelector(".liveEvaluation").textContent = "M" + data[i]["CP"];
                }
                i++;
            }
        }
        //get data from
    }
    evaulateNewBoard(fen) {
        this.lastFen = fen;
        if (this.enabled && fen != "") {
            this.stockfishOrchestrator.stopAndStartNewAnalysis(fen);
        }
    }
}
