import { AnalysisOrchestrator } from "./AnalysisOrchestrator";
import { StockfishParser } from "./StockfishParser.js";
import { Config } from "./config/config.js";
declare var Stockfish: any;
declare var axios: any;

export async function createStockfishOrchestrator(sendEvalAfterEveryMove) {
  var stockfish;
  await Stockfish().then(sf => {
    stockfish = sf;
  });

  const stockfishOrchestratorInst = new stockfishOrchestrator(stockfish, sendEvalAfterEveryMove);

  stockfish.addMessageListener(message => {
    stockfishOrchestratorInst.handleMainMessage({ from: 'stockfish', message: message })
  });

  return stockfishOrchestratorInst;
}
class stockfishOrchestrator {
  private stockfishWorker: Worker;
  private isCurrentlyWorking: boolean;
  private currentFEN: string;
  public analysisOrchestrator: AnalysisOrchestrator;
  private whiteMove: boolean;
  private stockfishParser: StockfishParser;
  private moveTimeLengthMs: number;
  private currentRegularMove: string;
  private moveIndex: number;
  private callbackFunction;
  private sendEvalAfterEveryMove: boolean;



  constructor(stockfishWorkerArg, sendEvalAfterEveryMove) {
    this.sendEvalAfterEveryMove = sendEvalAfterEveryMove;
    this.stockfishWorker = stockfishWorkerArg;
    this.stockfishParser = new StockfishParser();

    if (sendEvalAfterEveryMove) {
      this.moveTimeLengthMs = 100000;
    } else {
      this.moveTimeLengthMs = Config.STOCKFISH_MOVETIME;
    }



    this.isCurrentlyWorking = null;

    this.currentFEN = null;

    this.analysisOrchestrator = null;

    this.whiteMove = true;

    if (/Android|iPhone/i.test(navigator.userAgent)) {
      console.log("THIS IS MOBILE")
      this.moveTimeLengthMs = 500;
    } else {
      this.stockfishWorker.postMessage(`setoption name Hash value 256`);
    }
    this.stockfishWorker.postMessage(`setoption name Threads value 1`);
    this.stockfishWorker.postMessage(`setoption name MultiPV value 2`);

    self.onmessage = this.handleMainMessage.bind(this);
    //setoption name Use NNUE value true



    //this.stockfishWorker.postMessage(`bench`);
  }

  private async getLichessData(fenPosition: string) {
    try {
      const apiUrl = `https://lichess.org/api/cloud-eval?fen=${encodeURIComponent(fenPosition)}&multiPv=2`;
      const response = await axios.get(apiUrl);

      // Check if the response contains any analysis data (e.g., 'evals' field).
      if (response.data.fen) {
        // The position was found in the cache (already analyzed).
        if (response.data.pvs.length < 2) {
          return [false]
        }
        return [true, response.data];
      } else {
        // The position was not found in the cache (no analysis available).
        return [false, response.data];
      }
    } catch (error) {
      return [false];
    }
  }

  private async checkCache(fenString) {
    const responseFromCache = await this.getLichessData(fenString)
    if (responseFromCache[0] == true) {
      return [true, this.stockfishParser.cachedDataToParsed(responseFromCache[1])];
    }
    return [false]
  }

  public deleteWorker() {
    this.stockfishWorker.terminate();
  }
  public clearData() {
    this.stockfishWorker.postMessage(`stop`)
    this.stockfishParser.clearData();
    this.whiteMove = true;
    this.isCurrentlyWorking = false;
  }

  public setCallback(callbackFunction) {
    this.callbackFunction = callbackFunction;
  }

  private fillRestOfDataForAnalysisOrchestrator(currentEval) {
    var dataFromStockfish = {};
    dataFromStockfish["positionEvaluation"] = currentEval;
    dataFromStockfish["FENstring"] = this.currentFEN;
    dataFromStockfish["regularMove"] = this.currentRegularMove;
    dataFromStockfish["moveIndex"] = this.moveIndex;
    return dataFromStockfish;
  }

  async getAnalsysForFenPosition(fenPosition, regularMove, moveIndex) {

    this.currentFEN = fenPosition;
    this.currentRegularMove = regularMove;
    this.moveIndex = moveIndex;

    const cachedResponse = await this.checkCache(fenPosition);
    if (cachedResponse[0] == true) {
      this.callbackFunction(this.fillRestOfDataForAnalysisOrchestrator(cachedResponse[1]));
      this.isCurrentlyWorking = false;
      return;
    }
    //console.log(`position fen ${fenPosition}`);

    this.stockfishWorker.postMessage(`position fen ${fenPosition}`)

    this.stockfishWorker.postMessage(`go movetime ${this.moveTimeLengthMs}`)
  }

  async waitForRun(fenPosition, regularMove, moveIndex) {
    while (this.isCurrentlyWorking) {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for 100ms
    }
    this.isCurrentlyWorking = true;
    await this.getAnalsysForFenPosition(fenPosition, regularMove, moveIndex);
  }

  async stopAndStartNewAnalysis(fenPosition) {
    this.stockfishWorker.postMessage(`stop`);
    this.getAnalsysForFenPosition(fenPosition, "", 0);

  }
  handleMainMessage(message) {

    const from = message.from;
    const text = message.message;
    //console.log(text);

    if (text && text.startsWith('bestmove')) {
      this.whiteMove = !this.whiteMove;
      const currentEval = this.stockfishParser.getAllData();
      //console.log(currentEval);
      var dataFromStockfish = this.fillRestOfDataForAnalysisOrchestrator(currentEval)

      this.stockfishParser.clearData();
      if (!this.sendEvalAfterEveryMove) {
        this.callbackFunction(dataFromStockfish);
      }


      this.isCurrentlyWorking = false;
    } else {

      this.stockfishParser.sendMessage(text, this.currentFEN);

      const currentEval = this.stockfishParser.getAllData();

      if (this.sendEvalAfterEveryMove) {
        this.callbackFunction(this.fillRestOfDataForAnalysisOrchestrator(currentEval));
      }

    }
  }
}


export { stockfishOrchestrator };