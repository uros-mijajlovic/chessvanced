//govori GUI handleru sta da crta
//moze stockfishOrchestrator da se adaptira za ovu upotrebu mozda
//prima novi fen, salje to SO-u
//so ima callback nakon svakog depth-a
//i crtace sta je potrebno nacrtati

import { GuiHandler } from "./GuiHandler.js";
import { stockfishOrchestrator } from "./stockfishOrchestator.js";
import { algebraicToSEN, isGameFinished } from "./utils/ChessboardUtils.js";

export class LiveBoardEvaluation {
    private stockfishOrchestrator: stockfishOrchestrator
    private guiHandler: GuiHandler //for drawing arrows
    private div: HTMLElement;
    private enabled: boolean;
    private lastFen: string;

    constructor(stockfishOrchestratorInst, guiHandler, divForEvaluation: HTMLElement) {
        this.stockfishOrchestrator = stockfishOrchestratorInst;
        this.guiHandler = guiHandler;
        this.stockfishOrchestrator.setCallback((data) => { this.evaluationGetCallback(data) });
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
            const evaluationLine = evaluationLineDivs[i] as HTMLElement;
            evaluationLine.style.display = 'none';
        }
    }
    toggleSwitched() {
        this.enabled = !this.enabled;
        if (this.enabled) {
            this.evaulateNewBoard(this.lastFen);

        } else {
            this.disableAllLines();
            this.guiHandler.clearArrows();
        }
    }
    evaluationGetCallback(stockfishData) {
        var data=stockfishData["positionEvaluation"];
        if (this.enabled && this.lastFen) {
            var evaluationLineDivs = this.div.children;
            let i = 0;
            
            const bestMove = data[0]["move"];
            this.guiHandler.addBestMoveArrow(bestMove);

            while (i in data) {

                var evaluationLine = evaluationLineDivs[i] as HTMLElement;

                const isLineInvisible = window.getComputedStyle(evaluationLine).display === 'none';
                if (isLineInvisible) {
                    evaluationLine.style.display = 'flex';
                }
                const senArray=algebraicToSEN(data[i]["allMoves"], data[i]["FEN"])
                evaluationLine.querySelector(".liveBestMove").textContent = senArray.slice(0, 8).join(", ");

                if (data[i]["cpOrMate"] == "cp") {
                    const isPositiveEvaluation = (parseFloat(data[i]["CP"]) / 100) > 0;
                    evaluationLine.querySelector(".liveEvaluation").textContent = (isPositiveEvaluation ? "+" : "") + (parseFloat(data[i]["CP"]) / 100).toString();
                } else {
                    evaluationLine.querySelector(".liveEvaluation").textContent = "M" + data[i]["CP"];
                }

                i++;
            }
        }

        //get data from
    }
    evaulateNewBoard(fen) {
        this.lastFen=fen;
        
        if (this.enabled && fen != "") {
            if(isGameFinished(fen)){
                this.lastFen="";
                this.disableAllLines();
                this.guiHandler.clearArrows();
            }else{
                this.stockfishOrchestrator.stopAndStartNewAnalysis(fen);
            }
        }
    }



}