import { AnalysisOrchestrator } from "./AnalysisOrchestrator";
import { StockfishParser } from "./StockfishParser.js";

class stockfishOrchestrator {
    private stockfishWorker:any;
    private waiting:boolean;
    private isCurrentlyWorking:boolean;
    private currentFEN:string;
    private analysisOrchestrator:AnalysisOrchestrator;
    private whiteMove:boolean;
    private timeWhenSentToStockfish:Date;
    private lastMessageFromStockfish:string;
    private stockfishParser:StockfishParser;
    private moveTimeLengthMs:number;
    private currentRegularMove:string;

    constructor(stockfishWorkerArg) {
        this.stockfishWorker = stockfishWorkerArg;

        this.stockfishParser= new StockfishParser();
        this.moveTimeLengthMs=700;
        this.waiting=false;

        this.isCurrentlyWorking=null;

        this.currentFEN=null;

        this.analysisOrchestrator=null;

        this.whiteMove=false;

        this.timeWhenSentToStockfish=null;

        this.lastMessageFromStockfish="";




        this.stockfishWorker.postMessage(`setoption name Hash value 128`);
        this.stockfishWorker.postMessage(`setoption name Threads value 1`);
        this.stockfishWorker.postMessage(`setoption name MultiPV value 2`);
        this.stockfishWorker.postMessage(`setoption name UCI_AnalyseMode value true`);
        this.stockfishWorker.postMessage(`uci`);


        self.onmessage = this.handleMainMessage.bind(this);
        //setoption name Use NNUE value true
        
        
        
        //this.stockfishWorker.postMessage(`bench`);
    }

    async getAnalsysForFenPosition(fenPosition, regularMove) {
        this.isCurrentlyWorking=true;
        this.currentFEN=fenPosition;
        this.currentRegularMove=regularMove;
        //console.log(`position fen ${fenPosition}`);

        this.stockfishWorker.postMessage(`position fen ${fenPosition}`)

        this.stockfishWorker.postMessage(`go movetime ${this.moveTimeLengthMs}`)    
      }

    async waitForRun(fenPosition, regularMove) {
      while (this.isCurrentlyWorking) {
        await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for 100ms
      }
      await this.getAnalsysForFenPosition(fenPosition, regularMove);
    }
    handleMainMessage(message) {

      const from=message.from;
      const text=message.message;
      

      if (text.startsWith('bestmove')) {
        this.isCurrentlyWorking=false;
        this.whiteMove=!this.whiteMove;
        const currentEval=this.stockfishParser.getAllData();
        this.analysisOrchestrator.sendEval(currentEval, this.currentFEN, this.currentRegularMove);
        this.stockfishParser.cleanData();
      }else{
        this.stockfishParser.sendMessage(text, this.whiteMove);

      }
    }
  }


export {stockfishOrchestrator};