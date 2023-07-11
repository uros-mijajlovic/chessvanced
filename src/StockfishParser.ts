function getDepthFromString(message:string){
    const depthPattern = /depth (\d+)/;
    const depthMatch = message.match(depthPattern);

    if (depthMatch) {
      const depth = parseInt(depthMatch[1]);
      return depth
    } else {
      return -1
    }
  }

function getCPvalueFromString(message:string){
    const regex = /cp\s(-?\d+)/;
    const match = message.match(regex);
    if (match) {
        var cpValue = parseInt(match[1]);
        //console.log("CP value:", cpValue);
        return cpValue;
        
    }
  }

function getMultiPVvalueFromString(message:string){
    const regex = /multipv\s(\d+)/;
    const match = message.match(regex);
    if (match) {
        var cpValue = parseInt(match[1]);
        //console.log("PV value:", cpValue);
        return cpValue;
    }
}

function getBestMoveFromString(message:string){

    
    const regex = /pv\s(\w{4})/;
    const match = message.match(regex);
    return match[1];

}


  

export class StockfishParser{
    private data:Record<number, any>; 
    private maxDepthReached:number;
    constructor(){
        this.data={};
        this.maxDepthReached=0;
    }
    getEval(){
        console.log(`max depth reached is ${this.maxDepthReached}`);
        this.maxDepthReached=0;
        return this.data[0]["CP"];
    }
    sendMessage(message:string, isWhiteMove:boolean){
        this.maxDepthReached=Math.max(this.maxDepthReached, getDepthFromString(message));
        const moveOrder=getMultiPVvalueFromString(message);
        const bestMove=getBestMoveFromString(message);

        this.data[moveOrder-1]={"move":bestMove, "CP":getCPvalueFromString(message) * (isWhiteMove ? 1:-1)};
    }
    getAllData(){
        return this.data;
    }
    cleanData(){
        this.data={};
    }




}