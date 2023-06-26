class stockfishOrchestrator {
    constructor(stockfishWorker) {
        this.stockfishWorker = stockfishWorker;
        this.waiting=false;
        this.mutex=true;
        self.onmessage = this.handleMainMessage.bind(this);
    }
    
    getAnalsysForFenPosition(fenPosition) {
        return new Promise((resolve, reject) => {
          const interval = setInterval(() => {
            if (!this.waiting) {
                this.waiting=false;
                resolve("rac");
            }
          }, 1000); // Adjust the interval as needed
      
          // Timeout to reject the promise if the boolean doesn't become true within a certain time
          setTimeout(() => {
            clearInterval(interval);
            reject(new Error('Timeout: Boolean did not become true.'));
          }, 5000); // Adjust the timeout duration as needed
        });
      }
    
    handleMainMessage(event) {
      // Process the message received from the main thread
      const message = event.data;
      console.log('Received message from main thread:', message);
    }

  }


const SO=new stockfishOrchestrator();