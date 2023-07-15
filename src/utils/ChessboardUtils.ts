import { playerControllerInst, guiHandlerInst } from "../connectStockfish.js"


export const boardConfig = {
    draggable: true,
    position: "start",
    onDragStart,
    onDrop
}



function onDragStart(dragStartEvt) {

    const game = playerControllerInst.getChessObject();
    const board = guiHandlerInst.getChessboard();
    if (game.game_over()) return false

    // only pick up pieces for the side to move
    if (game.turn() === 'w' && !isWhitePiece(dragStartEvt.piece)) return false
    if (game.turn() === 'b' && !isBlackPiece(dragStartEvt.piece)) return false

    // what moves are available to from this square?
    const legalMoves = game.moves({
        square: dragStartEvt.square,
        verbose: true
    })

    // place Circles on the possible target squares
    legalMoves.forEach((move) => {
        board.addCircle(move.to)
    })
}

function isWhitePiece(piece) { return /^w/.test(piece) }
function isBlackPiece(piece) { return /^b/.test(piece) }

function onDrop(dropEvt) {
    const board = guiHandlerInst.getChessboard();
    const game = playerControllerInst.getChessObject();
    const move = game.move({
        from: dropEvt.source,
        to: dropEvt.target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    })

    // remove all Circles from the board
    board.clearCircles()

    // make the move if it is legal
    if (move) {
        board.fen(game.fen());
    } else {
        return 'snapback'
    }
}

