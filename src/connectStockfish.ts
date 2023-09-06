import { stockfishOrchestrator } from './stockfishOrchestator.js'
import { AnalysisOrchestrator } from './AnalysisOrchestrator.js';
import { urke_analysis_array, urke_fen_array, urke_game_analysis, urke_move_array } from './const/constGames.js';
import { EvaluationGraph } from './EvaluationGraph.js';
import { GuiHandler } from './GuiHandler.js';
import { PlayerController } from './PlayerController.js';
import { Sidebar } from "./Sidebar.js"
import { createStockfishOrchestrator } from './stockfishOrchestator.js';
import { LiveBoardEvaluation } from './LiveBoardEvaluation.js';

declare global {
  interface Window {
    playerControllerInst: any; // You can replace 'any' with the appropriate type

    myStr: any;
  }
}

var stockfish = null;


const sidebarInst = new Sidebar(document.getElementById("sidebarComponent"));

const evaluationGraphInst = new EvaluationGraph("myChart");

const guiHandlerInst = new GuiHandler(evaluationGraphInst, sidebarInst);

var analsysOrchestratorInst = new AnalysisOrchestrator(guiHandlerInst);

const stockfishOrchestratorForLiveEvaluation = await createStockfishOrchestrator(true);
const liveBoardEvaluationInst = new LiveBoardEvaluation(stockfishOrchestratorForLiveEvaluation, guiHandlerInst, document.getElementById("liveEvaluationContainer"));

const playerControllerInst = new PlayerController(guiHandlerInst, analsysOrchestratorInst, liveBoardEvaluationInst);






sidebarInst.playerController = playerControllerInst;
sidebarInst.guiHandler = guiHandlerInst;
console.log("playerControllerSet");

document.addEventListener('keydown', function (event) {
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


evaluationGraphInst.playerControllerInst = playerControllerInst;

window.playerControllerInst = playerControllerInst;

console.log(playerControllerInst.ready);
//playerControllerInst.setPgn(pgn_string_1);


if(window.location.href=="https://www.chessvanced.com/"){
  playerControllerInst.setGameFromExtension(urke_fen_array, urke_move_array, urke_game_analysis, urke_analysis_array, "black", true);
}else if(window.location.href=="https://chessvanced.com/"){
  playerControllerInst.setGameFromExtension(urke_fen_array, urke_move_array, urke_game_analysis, urke_analysis_array, "black", true);
}
// else if(window.location.href=="http://localhost:8000/"){
//   playerControllerInst.setGameFromExtension(urke_fen_array, urke_move_array, urke_game_analysis, urke_analysis_array, "black", true);
// }
playerControllerInst.ready = true;
console.log("successfully finished connectStockfish", window.location.href);

export { playerControllerInst, guiHandlerInst, evaluationGraphInst }