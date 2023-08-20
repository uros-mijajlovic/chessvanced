import { playerControllerInst, guiHandlerInst } from "../connectStockfish.js";
import { Chess } from "../../dependencies/chess.js";
export function algebraicToSEN(algebraicNotation, FENstring) {
    const chessObject = Chess();
    chessObject.load(FENstring);
    const move = chessObject.move({ from: algebraicNotation.substring(0, 2), to: algebraicNotation.substring(2, 4), promotion: 'q' });
    if (move) {
        return move.san;
    }
    else {
        return algebraicNotation;
    }
}
export const boardConfig = {
    draggable: true,
    position: "start",
    onDragStart,
    onDrop
};
export function clampAndBound(x, min, max) {
    return Math.min(Math.max(x, min), max);
}
export function getRowFromTile(tile) {
    return tile[0].charCodeAt(0) - "a".charCodeAt(0);
}
function onDragStart(dragStartEvt) {
    var game = null;
    if (playerControllerInst.getInAlternative) {
        game = playerControllerInst.getAlternativeChessObject();
    }
    else {
        game = playerControllerInst.getChessObject();
    }
    const board = guiHandlerInst.getChessboard();
    if (game.game_over())
        return false;
    // only pick up pieces for the side to move
    if (game.turn() === 'w' && !isWhitePiece(dragStartEvt.piece))
        return false;
    if (game.turn() === 'b' && !isBlackPiece(dragStartEvt.piece))
        return false;
    // what moves are available to from this square?
    const legalMoves = game.moves({
        square: dragStartEvt.square,
        verbose: true
    });
    // place Circles on the possible target squares
    legalMoves.forEach((move) => {
        board.addCircle(move.to);
    });
}
function isWhitePiece(piece) { return /^w/.test(piece); }
function isBlackPiece(piece) { return /^b/.test(piece); }
function onDrop(dropEvent) {
    //check if it is promotion
    if ((dropEvent.piece == "wP" && dropEvent.target[1] == "8") || (dropEvent.piece == "bP" && dropEvent.target[1] == "1")) {
        const game = playerControllerInst.getChessObject();
        console.log(game.fen());
        const move = game.move({
            from: dropEvent.source,
            to: dropEvent.target,
            promotion: 'q'
        });
        game.undo();
        if (move) {
            console.log("PROMOCIJA");
            const sidePlaying = dropEvent.piece[0];
            guiHandlerInst.createPromotionPopup(moveCallback, dropEvent.source, dropEvent.target, sidePlaying);
        }
        else {
            console.log("SNAP");
            return "snapback";
        }
    }
    else {
        return moveCallback(dropEvent.source, dropEvent.target, 'q');
    }
}
function moveCallback(source, target, promotion) {
    console.log("P");
    const board = guiHandlerInst.getChessboard();
    const game = playerControllerInst.getChessObject();
    return playerControllerInst.makePossibleAlternativeMove(source + target, promotion);
    const move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });
    board.clearCircles();
    console.log(move);
    if (move) {
        board.fen(game.fen());
    }
    else {
        return 'snapback';
    }
}
