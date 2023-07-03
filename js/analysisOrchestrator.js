import {Chess} from './dependencies/chess.js';


function pgnToFenArr(pgnString){
    const chessjs=new Chess();
    chessjs.load_pgn(pgnString);
    const moves = chessjs.history();
    var fenMoves=[];
  
    const newChessjs=new Chess()
    moves.forEach((move, index) => {
      newChessjs.move(move);
      fenMoves.push(newChessjs.fen());
    });
    return fenMoves;
  }

class analysisOrchestrator {
  constructor(stockfishOrchestratorInst, evaluationGraph){
      this.evaluationGraph=evaluationGraph;
      this.stockfishOrchestrator=stockfishOrchestratorInst;
      this.gameAnalysis=[]
    }
  sendEval(cpScore, FENstring){
    this.gameAnalysis.push({"evaluation":cpScore/100,"moveRating":"grey"})
    this.evaluationGraph.updateGraph(this.gameAnalysis);
  }
  
  async analyzePgnGame(pgnString){
      const fenMoves=pgnToFenArr(pgnString);
      for (const fenMove of fenMoves) {
        await this.stockfishOrchestrator.waitForRun(fenMove);
        console.log(fenMove);
      }
  }
}
export {analysisOrchestrator};