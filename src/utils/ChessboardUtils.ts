import { playerControllerInst, guiHandlerInst } from "../connectStockfish.js"
import { Chess } from "../../dependencies/chess.js";

export function getWinPercentFromCP(cp) {
    return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * cp)) - 1)
}
export function extractCPreal(gameAnalysis) {
    var cps = []
    for (const moveAnalysis of gameAnalysis) {
        cps.push(moveAnalysis["CPreal"]);
    }
    return cps
}
export function getAccuracyFromWinPercent(before, after, color) {

    if (color) {
        if (before <= after) {
            return 100.0
        } else {
            const win_diff = before - after
            const raw = 103.1668100711649 * Math.exp(-0.04354415386753951 * win_diff) + -3.166924740191411
            return Math.max(Math.min(raw + 1, 100), 0)
        }
    } else {

        if (before >= after) {
            return 100.0
        } else {
            const win_diff = after - before
            const raw = 103.1668100711649 * Math.exp(-0.04354415386753951 * win_diff) + -3.166924740191411
            return Math.max(Math.min(raw + 1, 100), 0)
        }
    }
}
function addCPrealToDataForFen(dataForFen) {
    for (let i = 0; i < 2; i++) {
        if (dataForFen[i]) {
            if (dataForFen[i]["cpOrMate"] == "mate") {
                if (dataForFen[i]["isCheckmated"] == true) {
                    dataForFen[i]["CPreal"] = -dataForFen[i]["CP"] * 2000;
                } else {
                    const mateForOpposite = (dataForFen[i]["CP"] > 0) ? 1 : -1;
                    dataForFen[i]["CPreal"] = mateForOpposite * 2000;
                }
            } else {
                dataForFen[i]["CPreal"] = dataForFen[i]["CP"];
            }
        }
    }
}
export function parseFenDataFromStockfish(dataForFen) {
    addCPrealToDataForFen(dataForFen)
    const centipawns = dataForFen[0]["CP"];
    console.log(dataForFen);
    var moveAnalysis = {};
    if (dataForFen[0]["cpOrMate"] == "mate") {
        if (dataForFen[0]["isCheckmated"] == true) {
            moveAnalysis["CP"] = "M0";
            moveAnalysis["evaluation"] = -centipawns * 49;
        } else {
            const mateForOpposite = (centipawns > 0) ? 1 : -1;
            moveAnalysis["CP"] = "M" + centipawns.toString();
            moveAnalysis["evaluation"] = mateForOpposite * 49;
        }

    } else {
        var evalScoreForGraph = 50 * (2 / (1 + Math.exp(-0.004 * centipawns)) - 1)
        moveAnalysis["evaluation"] = evalScoreForGraph;
        moveAnalysis["CP"] = centipawns;
    }
    moveAnalysis["CPreal"] = dataForFen[0]["CPreal"]
    return moveAnalysis;

}
export function algebraicToSEN(algebraicMoves: [string], FENstring) {
    const chessObject = Chess();
    chessObject.load(FENstring);
    var sanArray = []
    for (const moveAlgebraic of algebraicMoves) {
        const moveObject = chessObject.move({ from: moveAlgebraic.substring(0, 2), to: moveAlgebraic.substring(2, 4), promotion: 'q' });
        if (moveObject) {
            sanArray.push(moveObject.san);
        } else {
            sanArray.push(moveAlgebraic)
        }
    }
    return sanArray;

}
export function getPieceAtSquare(FENstring, square) {
    const chessObject = Chess();
    chessObject.load(FENstring);
    console.log(chessObject.get(square))
    return chessObject.get(square);
}
export function isGameFinished(FENstring: string) {
    const chessObject = Chess();
    chessObject.load(FENstring);
    if (chessObject.in_checkmate()) {
        return true
    } else {
        return false;
    }
}
export const boardConfig = {
    draggable: true,
    position: "start",
    onDragStart,
    onDrop
}

export function clampAndBound(x, min, max) {
    return Math.min(Math.max(x, min), max);
}

export function getRowFromTile(tile: string) {
    return tile[0].charCodeAt(0) - "a".charCodeAt(0);
}



function onDragStart(dragStartEvt) {
    var game = null;
    if (playerControllerInst.getInAlternative) {
        game = playerControllerInst.getAlternativeChessObject();
    } else {
        game = playerControllerInst.getChessObject();

    }
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

    //check if it is promotion

    if ((dropEvent.piece == "wP" && dropEvent.target[1] == "8") || (dropEvent.piece == "bP" && dropEvent.target[1] == "1")) {
        const game = playerControllerInst.getChessObject();

        console.log(game.fen());
        const move = game.move({
            from: dropEvent.source,
            to: dropEvent.target,
            promotion: 'q'
        })
        game.undo();
        if (move) {
            console.log("PROMOCIJA")
            const sidePlaying = dropEvent.piece[0];
            guiHandlerInst.createPromotionPopup(moveCallback, dropEvent.source, dropEvent.target, sidePlaying);
        } else {
            console.log("SNAP")
            return "snapback";
        }
    } else {
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
    })
    board.clearCircles();
    console.log(move);
    if (move) {
        board.fen(game.fen());
    } else {
        return 'snapback'
    }

}



