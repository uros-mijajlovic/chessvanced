import {stockfishOrchestrator} from './stockfishOrchestator.js'
import { analysisOrchestrator } from './analysisOrchestrator.js';
import {pgn_string_1, fen_string_1} from './const/constGames.js';


var wasmSupported = typeof WebAssembly === 'object' && WebAssembly.validate(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
var stockfish = new Worker(wasmSupported ? 'js/dependencies/stockfish.wasm.js' : 'js/dependencies/stockfish.js');

stockfish.addEventListener('message', function (e) {
    var message=e.data;
    stockfishOrchestratorInst.handleMainMessage({from:'stockfish', message:message})
});

const stockfishOrchestratorInst=new stockfishOrchestrator(stockfish);
const analsysOrchestratorInst=new analysisOrchestrator(stockfishOrchestratorInst);

analsysOrchestratorInst.analyzePgnGame(pgn_string_1);
export {stockfish, stockfishOrchestratorInst};