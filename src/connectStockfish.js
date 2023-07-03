import {stockfishOrchestrator} from './stockfishOrchestator.js'
import { analysisOrchestrator } from './analysisOrchestrator.js';
import {pgn_string_1, fen_string_1} from './const/constGames.js';
import { evaluationGraph } from './evaluationGraph.js';
import { GuiHandler } from './GuiHandler.js';
function getRandomNumber(lastNumber) {

    let randomNumber;
    const chance = Math.random(); // Generate a random chance value between 0 and 1
  
    if (chance < 0.8) {
      // 80% chance of ±2
      const offset = (Math.random() < 0.5) ? -2 : 2; // Determine whether to add or subtract 2
      randomNumber = lastNumber + offset;
    } else {
      // 20% chance of ±6
      const offset = (Math.random() < 0.5) ? -6 : 6; // Determine whether to add or subtract 6
      randomNumber = lastNumber + offset;
    }
  
    // Ensure the random number is within the range of -10 and 10
    randomNumber = Math.max(-10, Math.min(10, randomNumber));
  
    return randomNumber;
  }
  
var analysisData=[]
for (let i = 0; i < 50; i++) {
const randomEvaluation = getRandomNumber(0);
analysisData.push({"evaluation":randomEvaluation});
}

for (let i = 1; i < 50; i++) {
if(analysisData[i]["evaluation"]>analysisData[i-1]["evaluation"]+6){
    analysisData[i]["moveRating"]="brilliant";
}else if(analysisData[i]["evaluation"]<analysisData[i-1]["evaluation"]-6){
    analysisData[i]["moveRating"]="mistake";
}else{
    analysisData[i]["moveRating"]="good";
}
}
  



var wasmSupported = typeof WebAssembly === 'object' && WebAssembly.validate(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
var stockfish = new Worker(wasmSupported ? '/dependencies/stockfish.wasm.js' : '/dependencies/stockfish.js');

stockfish.addEventListener('message', function (e) {
    var message=e.data;
    stockfishOrchestratorInst.handleMainMessage({from:'stockfish', message:message})
});

const evaluationGraphInst=new evaluationGraph("myChart");

const stockfishOrchestratorInst=new stockfishOrchestrator(stockfish);



var analsysOrchestratorInst=new analysisOrchestrator(stockfishOrchestratorInst, evaluationGraphInst);

const guiHandlerInst=new GuiHandler(analsysOrchestratorInst);


stockfishOrchestratorInst.analysisOrchestrator=analsysOrchestratorInst;

guiHandlerInst.setPgn(pgn_string_1);


export {stockfish, stockfishOrchestratorInst, evaluationGraphInst};