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

function getScorevalueFromString(message:string, isWhiteMove:boolean){
    const cpRegex = /score cp (-?\d+)/;
    const mateRegex = /score mate (-?\d+)/;

    const cpMatch = message.match(cpRegex);
    const mateMatch = message.match(mateRegex);

    if (cpMatch) {
        var cpValue = parseInt(cpMatch[1]);
        return {"value" : cpValue, "cpOrMate":"cp", "isWhiteMove":isWhiteMove}
    }
    if (mateMatch) {
        const movesToMate = parseInt(mateMatch[1]);
        return {"value" : movesToMate, "cpOrMate":"mate", "isWhiteMove":isWhiteMove}
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
    sendMessage(message:string, isWhiteMove:boolean, currentFEN:string){
        this.maxDepthReached=Math.max(this.maxDepthReached, getDepthFromString(message));
        const moveOrder=getMultiPVvalueFromString(message);
        const bestMove=getBestMoveFromString(message);
        
        const score=getScorevalueFromString(message, isWhiteMove)
        this.data[moveOrder-1]={"move":bestMove, "CP":score["value"] * (isWhiteMove ? 1:-1), "cpOrMate":score["cpOrMate"]};
        this.data[moveOrder-1]["FEN"]=currentFEN;

    }
    getAllData(){
        return this.data;
    }
    cleanData(){
        this.data={};
    }




}