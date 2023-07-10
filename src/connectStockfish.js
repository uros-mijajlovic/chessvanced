import {stockfishOrchestrator} from './stockfishOrchestator.js'
import { AnalysisOrchestrator } from './AnalysisOrchestrator.js';
import {pgn_string_1, fen_string_1} from './const/constGames.js';
import { EvaluationGraph } from './EvaluationGraph.js';
import { GuiHandler } from './GuiHandler.js';
import { PlayerController } from './PlayerController.js';
import {Sidebar} from "./Sidebar.js"
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
if(wasmSupported)console.log("wasmSupported");
var stockfish = new Worker(wasmSupported ? '/dependencies/stockfish.wasm.js' : '/dependencies/stockfish.js');
//var stockfish = new Worker('/dependencies/stockfish.js');

stockfish.postMessage("go depth 15");
//var stockfish = new Worker('/dependencies/stockfish.wasm.js');


stockfish.addEventListener('message', function (e) {
    console.log(event.data ? event.data : event);
    var message=e.data;
    stockfishOrchestratorInst.handleMainMessage({from:'stockfish', message:message})
});
const stockfishOrchestratorInst=new stockfishOrchestrator(stockfish);

const sidebarInst=new Sidebar(document.getElementById("sidebarComponent"));

const evaluationGraphInst=new EvaluationGraph("myChart");

const guiHandlerInst=new GuiHandler(evaluationGraphInst, sidebarInst);
var analsysOrchestratorInst=new AnalysisOrchestrator(stockfishOrchestratorInst, guiHandlerInst);


const playerControllerInst=new PlayerController(guiHandlerInst, analsysOrchestratorInst);

sidebarInst.playerController=playerControllerInst;
console.log("playerControllerSet");

document.addEventListener('keydown', function(event) {
  if (event.keyCode === 37) {
    // Left arrow key is pressed
    playerControllerInst.goBackwards();
    // Your code for left cursor event handling goes here
  } else if (event.keyCode === 39) {
    // Right arrow key is pressed
    playerControllerInst.goForwards();
    // Your code for right cursor event handling goes here
  }
});


evaluationGraphInst.playerControllerInst=playerControllerInst;




stockfishOrchestratorInst.analysisOrchestrator=analsysOrchestratorInst;




//INICIALIZATION




playerControllerInst.setPgn(pgn_string_1);



export {stockfish, stockfishOrchestratorInst, evaluationGraphInst};