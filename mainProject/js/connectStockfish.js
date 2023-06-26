
var wasmSupported = typeof WebAssembly === 'object' && WebAssembly.validate(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
var stockfish = new Worker(wasmSupported ? 'js/dependencies/stockfish.wasm.js' : 'js/dependencies/stockfish.js');

var stockfishOrchestrator=new Worker('js/stockfishOrchestator.js')

stockfish.addEventListener('message', function (e) {
    var message=e.data;
    console.log(message);
    stockfishOrchestrator.postMessage({from:'stockfish', message:message})
  });
stockfish.postMessage('position fen rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
stockfish.postMessage('go depth 10')


export {stockfish, stockfishOrchestrator};