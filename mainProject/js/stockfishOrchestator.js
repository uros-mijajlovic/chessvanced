class stockfishOrchestrator {
    constructor(stockfishWorkerArg) {
        this.stockfishWorker = stockfishWorkerArg;
        
        this.waiting=false;

        this.isCurrentlyWorking=null;

        this.currentFEN=null;

        self.onmessage = this.handleMainMessage.bind(this);
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
        this.stockfishWorker.postMessage('go depth 10')    
      }

    async waitForRun(fenPosition) {
      while (this.isCurrentlyWorking) {
        await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for 100ms
      }
      await new Promise((resolve) => setTimeout(resolve, 2000))
      await this.getAnalsysForFenPosition(fenPosition);
    }
    handleMainMessage(message) {

      const from=message.from;
      const text=message.message;
      if(from=='stockfish' && this.getDepthFromString(text)==10){


        const regex = /cp\s(-?\d+)/;
        const match = text.match(regex);

        if (match) {
          const cpValue = parseInt(match[1]);
          console.log("CP value:", cpValue);
        }``


        console.log(text);
      }else if (text.startsWith('bestmove')) {
        this.isCurrentlyWorking=false;
      }
    }
  }


export {stockfishOrchestrator};