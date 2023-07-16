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

function onDrop(dropEvent) {
    if ((dropEvent.piece == "wP" && dropEvent.target[1] == "8") || (dropEvent.piece == "bP" && dropEvent.target[1] == "1")) {
        const game = playerControllerInst.getChessObject();
        const move=game.move({
            from: dropEvent.source,
            to: dropEvent.target,
            promotion: 'q'
        })
        if(move){
            guiHandlerInst.createPromotionPopup(promotionCallback, dropEvent.source, dropEvent.target);
        }else{
            return "snapback";
        }
    } else {
        return promotionCallback(dropEvent.source, dropEvent.target, 'q');
    }
}

function promotionCallback(source, target, promotion) {
    const board = guiHandlerInst.getChessboard();
    const game = playerControllerInst.getChessObject();
    return playerControllerInst.makeAlternativeMove(source+target);
    const move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    })
    board.clearCircles()
    console.log(move);
    if (move) {
        board.fen(game.fen());
    } else {
        return 'snapback'
    }

}

