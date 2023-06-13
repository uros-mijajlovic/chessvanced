var wasmSupported = typeof WebAssembly === 'object' && WebAssembly.validate(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));

var stockfish = new Worker(wasmSupported ? 'stockfish.wasm.js' : 'stockfish.js');

stockfish.addEventListener('message', function (e) {
  var bestMoveRegex = /^bestmove ([a-h][1-8][a-h][1-8])/;
  
  var message=e.data;
  console.log(message);
  var match = message.match(bestMoveRegex);
  if (match && match.length > 1) {
    
    var bestMove = match[1];
    var h2Element = document.getElementById('bestMoveSpot');
    h2Element.textContent = bestMove;
  }
});


