//govori GUI handleru sta da crta
//moze stockfishOrchestrator da se adaptira za ovu upotrebu mozda
//prima novi fen, salje to SO-u
//so ima callback nakon svakog depth-a
//i crtace sta je potrebno nacrtati

import { GuiHandler } from "./GuiHandler.js";
import { stockfishOrchestrator } from "./stockfishOrchestator.js";

export class LiveBoardEvaluation{
    private stockfishOrchestrator: stockfishOrchestrator
    private guiHandler:GuiHandler
    constructor(stockfishOrchestratorInst, guiHandler){
        this.stockfishOrchestrator=stockfishOrchestratorInst;
        this.guiHandler=guiHandler;
    }

    evaluationGetCallback(data){
        //get data from
    }
    evaulateNewBoard(fen){
        //so->stop
        //posalji novi fen
    }



}