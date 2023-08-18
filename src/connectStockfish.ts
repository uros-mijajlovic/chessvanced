import {stockfishOrchestrator} from './stockfishOrchestator.js'
import { AnalysisOrchestrator } from './AnalysisOrchestrator.js';
import {pgn_string_1, fen_string_1} from './const/constGames.js';
import { EvaluationGraph } from './EvaluationGraph.js';
import { GuiHandler } from './GuiHandler.js';
import { PlayerController } from './PlayerController.js';
import {Sidebar} from "./Sidebar.js"
import { createStockfishOrchestrator } from './stockfishOrchestator.js';
import { LiveBoardEvaluation } from './LiveBoardEvaluation.js';

declare global {
  interface Window {
    playerControllerInst: any; // You can replace 'any' with the appropriate type

    myStr: any; 
  }
}

var stockfish=null;


const sidebarInst=new Sidebar(document.getElementById("sidebarComponent"));

const evaluationGraphInst=new EvaluationGraph("myChart");

const guiHandlerInst=new GuiHandler(evaluationGraphInst, sidebarInst);
var analsysOrchestratorInst=new AnalysisOrchestrator(guiHandlerInst);

const stockfishOrchestratorForLiveEvaluation= await createStockfishOrchestrator(true);
const liveBoardEvaluationInst=new LiveBoardEvaluation(stockfishOrchestratorForLiveEvaluation, guiHandlerInst, document.getElementById("liveEvaluationContainer"));

const playerControllerInst=new PlayerController(guiHandlerInst, analsysOrchestratorInst, liveBoardEvaluationInst);






sidebarInst.playerController=playerControllerInst;
sidebarInst.guiHandler=guiHandlerInst;
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

window.playerControllerInst=playerControllerInst;

playerControllerInst.ready=true;
console.log(playerControllerInst.ready);

export {playerControllerInst, guiHandlerInst, evaluationGraphInst}