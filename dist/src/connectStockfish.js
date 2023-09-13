import { AnalysisOrchestrator } from './AnalysisOrchestrator.js';
import { urke_analysis_array, urke_fen_array, urke_game_analysis, urke_move_array } from './const/constGames.js';
import { EvaluationGraph } from './EvaluationGraph.js';
import { GuiHandler } from './GuiHandler.js';
import { PlayerController } from './PlayerController.js';
import { Sidebar } from "./Sidebar.js";
import { createStockfishOrchestrator } from './stockfishOrchestator.js';
import { LiveBoardEvaluation } from './LiveBoardEvaluation.js';
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
evaluationGraphInst.playerControllerInst = playerControllerInst;
window.playerControllerInst = playerControllerInst;
console.log(playerControllerInst.ready);
//playerControllerInst.setPgn(pgn_string_1);
playerControllerInst.ready = true;
if (window.location.href == "https://www.chessvanced.com/") {
    playerControllerInst.setGameFromExtension(urke_fen_array, urke_move_array, urke_game_analysis, urke_analysis_array, "black", {});
}
else if (window.location.href == "https://chessvanced.com/") {
    playerControllerInst.setGameFromExtension(urke_fen_array, urke_move_array, urke_game_analysis, urke_analysis_array, "black", {});
}
else if (window.location.href == "http://localhost:8000/") {
    playerControllerInst.setGameFromExtension(urke_fen_array, urke_move_array, urke_game_analysis, urke_analysis_array, "black", {});
}
console.log("successfully finished connectStockfish", window.location.href);
export { playerControllerInst, guiHandlerInst, evaluationGraphInst };
