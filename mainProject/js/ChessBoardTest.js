
function returnBoardContainer() {
    const container = html`<div id="board-container"></div>`;
    
    // This is the chess.js game engine (imported below).
    const game = new Chess();
    
    // This sets up the chess board in the div provided above
    const cg = Chessground(container,  {
        movable: {
          color: 'white', // only allow white pieces to be moved (it's white's turn to start)
          free: false, // don't allow movement anywhere ...
          dests: util.toDests(game), // ... only allow these moves. Accepts {square: [list of squares]} in Algebraic notation
        },
        draggable: {
          showGhost: true
        }
      });  // There's a lot of other options, and their defaults are listed here: https://github.com/ornicar/chessground/blob/master/src/state.ts#L105 
    
    
    // Now we add an event callback for what happens after a move.
    // This triggers a function defined in the next cell that sets up the
    // board for the next move (and will continue being called after each move.
    cg.set({
        movable: { events: { after: util.playOtherSide(cg, game) } }
      });
    return container
  }