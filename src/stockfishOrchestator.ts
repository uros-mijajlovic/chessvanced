import { AnalysisOrchestrator } from "./AnalysisOrchestrator";
import { StockfishParser } from "./StockfishParser.js";

class stockfishOrchestrator {
    private stockfishWorker:any;
    private waiting:boolean;
    private isCurrentlyWorking:boolean;
    private currentFEN:string;
    public analysisOrchestrator:AnalysisOrchestrator;
    private whiteMove:boolean;
    private timeWhenSentToStockfish:Date;
    private lastMessageFromStockfish:string;
    private stockfishParser:StockfishParser;
    private moveTimeLengthMs:number;
    private currentRegularMove:string;
    private moveIndex:number;
    
    constructor(stockfishWorkerArg) {
        this.stockfishWorker = stockfishWorkerArg;

        this.stockfishParser= new StockfishParser();

        this.moveTimeLengthMs=2000;

        this.waiting=false;

        this.isCurrentlyWorking=null;

        this.currentFEN=null;

        this.analysisOrchestrator=null;

        this.whiteMove=true;

        this.timeWhenSentToStockfish=null;

        this.lastMessageFromStockfish="";




        this.stockfishWorker.postMessage(`setoption name Hash value 128`);
        this.stockfishWorker.postMessage(`setoption name Threads value 4`);
        this.stockfishWorker.postMessage(`setoption name MultiPV value 2`);
        


        self.onmessage = this.handleMainMessage.bind(this);
        //setoption name Use NNUE value true
        
        
        
        //this.stockfishWorker.postMessage(`bench`);
    }

    async getAnalsysForFenPosition(fenPosition, regularMove, moveIndex) {
        this.isCurrentlyWorking=true;
        this.currentFEN=fenPosition;
        this.currentRegularMove=regularMove;
        this.moveIndex=moveIndex;
        console.log(`position fen ${fenPosition}`);

        this.stockfishWorker.postMessage(`position fen ${fenPosition}`)

        this.stockfishWorker.postMessage(`go movetime ${this.moveTimeLengthMs}`)    
      }

    async waitForRun(fenPosition, regularMove, moveIndex) {
      while (this.isCurrentlyWorking) {
        await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for 100ms
      }
      await this.getAnalsysForFenPosition(fenPosition, regularMove, moveIndex);
    }
    handleMainMessage(message) {

      const from=message.from;
      const text=message.message;
      //console.log(text);

      if (text.startsWith('bestmove')) {
        this.whiteMove=!this.whiteMove;
        const currentEval=this.stockfishParser.getAllData();
        console.log("currentEval", currentEval);
        this.analysisOrchestrator.sendEval(currentEval, this.currentFEN, this.currentRegularMove, this.moveIndex);
        this.stockfishParser.cleanData();
        this.isCurrentlyWorking=false;
      }else{
        this.stockfishParser.sendMessage(text, this.whiteMove, this.currentFEN);

      }
    }
  }


export {stockfishOrchestrator};