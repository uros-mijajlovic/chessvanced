var wasmSupported = typeof WebAssembly === 'object' && WebAssembly.validate(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));

var stockfish = new Worker(wasmSupported ? 'stockfish.wasm.js' : 'stockfish.js');

stockfish.addEventListener('message', function (e) {
  var bestMoveRegex = /^bestmove ([a-h][1-8][a-h][1-8])/;
  var message=e.data;
  var match = message.match(bestMoveRegex);
  if (match && match.length > 1) {
    var bestMove = match[1];
    console.log('Best move:', bestMove);
  }
});

stockfish.postMessage('uci');
stockfish.postMessage('position fen rnbqkbnr/pp2pppp/3p4/2p5/4P3/4B2N/PPPP1PPP/RN1QKB1R b KQkq - 0 1');
stockfish.postMessage('go depth 10');
