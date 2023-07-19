//govori GUI handleru sta da crta
//moze stockfishOrchestrator da se adaptira za ovu upotrebu mozda
//prima novi fen, salje to SO-u
//so ima callback nakon svakog depth-a
//i crtace sta je potrebno nacrtati

import { GuiHandler } from "./GuiHandler.js";
import { stockfishOrchestrator } from "./stockfishOrchestator.js";

export class LiveBoardEvaluation{
    private stockfishOrchestrator: stockfishOrchestrator
    private guiHandler:GuiHandler //for drawing arrows
    private div:HTMLElement;
    private evaluationLine:HTMLElement;
    private evaluationDiv:HTMLElement;
    constructor(stockfishOrchestratorInst, guiHandler, divForEvaluation: HTMLElement){
        this.stockfishOrchestrator=stockfishOrchestratorInst;
        this.guiHandler=guiHandler;
        this.stockfishOrchestrator.setCallback((data) => {this.evaluationGetCallback(data)});
        this.div=divForEvaluation;
        this.evaluationLine=this.div.querySelector(".liveEvaluationLine");
        this.evaluationDiv=this.evaluationLine.querySelector(".liveEvaluation");

//const isDivInvisible = window.getComputedStyle(myDiv).display === 'none';
    }

    evaluationGetCallback(data){
        var evaluationLineDivs=this.div.children;
        let i=0;
        const bestMove=data[0]["move"];
        this.guiHandler.addBestMoveArrow(bestMove);

        while (i in data){
            
            var evaluationLine=evaluationLineDivs[i] as HTMLElement;

            const isLineInvisible = window.getComputedStyle(evaluationLine).display === 'none';
            if(isLineInvisible){
                evaluationLine.style.display = 'flex';
            }
            evaluationLine.querySelector(".liveBestMove").textContent=data[i]["move"];
            
            if(data[i]["cpOrMate"]=="cp"){
                evaluationLine.querySelector(".liveEvaluation").textContent=data[i]["CP"];
            }else{
                evaluationLine.querySelector(".liveEvaluation").textContent="M"+data[i]["CP"];
            }

            i++;
        }

        //get data from
    }
    evaulateNewBoard(fen){
        //console.log(`LBE got fen ${fen}`);
        this.stockfishOrchestrator.stopAndStartNewAnalysis(fen);
        //so->stop
        //posalji novi fen
    }



}