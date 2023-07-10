class stockfishOrchestrator {
    constructor(stockfishWorkerArg) {
        this.stockfishWorker = stockfishWorkerArg;
        
        this.waiting=false;

        this.isCurrentlyWorking=null;

        this.currentFEN=null;

        this.analysisOrchestrator=null;

        this.whiteMove=false;

        self.onmessage = this.handleMainMessage.bind(this);
        //setoption name Use NNUE value true
        
        this.stockfishWorker.postMessage(`uci`);
        this.stockfishWorker.postMessage(`setoption name Threads value 7`);
        console.log("uci sent")
    }
    getDepthFromString(str){
      const depthPattern = /depth (\d+)/;
      const depthMatch = str.match(depthPattern);

      if (depthMatch) {
        const depth = parseInt(depthMatch[1], 10);
        return depth
      } else {
        return -1
      }
    }

    async getAnalsysForFenPosition(fenPosition) {
        this.isCurrentlyWorking=true;
        this.currentFEN=fenPosition;
        console.log(`position fen ${fenPosition}`);

        this.stockfishWorker.postMessage(`position fen ${fenPosition}`)
        this.stockfishWorker.postMessage('go depth 14')    
      }

    async waitForRun(fenPosition) {
      while (this.isCurrentlyWorking) {
        await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for 100ms
      }
      await this.getAnalsysForFenPosition(fenPosition);
    }
    handleMainMessage(message) {

      const from=message.from;
      const text=message.message;
      console.log(message.message)
      if(from=='stockfish' && this.getDepthFromString(text)==14){


        const regex = /cp\s(-?\d+)/;
        const match = text.match(regex);

        if (match) {
          var cpValue = parseInt(match[1]);
          console.log("CP value:", cpValue);

          if(!this.whiteMove){
            cpValue=-cpValue;
          }
          this.whiteMove=!this.whiteMove;
          this.analysisOrchestrator.sendEval(cpValue, this.currentFEN)
        }


        console.log(text);
      }else if (text.startsWith('bestmove')) {
        this.isCurrentlyWorking=false;
      }
    }
  }


export {stockfishOrchestrator};