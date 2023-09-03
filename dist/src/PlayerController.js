import { PgnToFenArr, PgnToMoveArr } from "./sacrifice.js";
import { Chess } from "../dependencies/chess.js";
import { Config } from "./config/config.js";
import { clampAndBound } from "./utils/ChessboardUtils.js";
class PlayerController {
    constructor(guiHandler, analysisOrchestratorInst, liveBoardEvaluationInst) {
        this.liveBoardEvaluation = liveBoardEvaluationInst;
        this.currentPgn = null;
        this.analysisOrchestrator = analysisOrchestratorInst;
        this.guiHandler = guiHandler;
        this.currentMove = 0;
        this.mainChessObject = Chess();
        this.alternativeChessObject = Chess();
        this.alternativeStackLeft = [];
        this.alternativeStackRight = [];
        this.inAlternativePath = false;
        this.liveBoardEvaluation = liveBoardEvaluationInst;
        this.analysisData = [];
        this.analyzedFens = [];
        this.ready = false;
    }
    getMoveType(flag) {
        if (flag == "c") {
            return Config.MOVE_TYPE.MOVE_CAPTURE;
        }
        else {
            return Config.MOVE_TYPE.MOVE_REGULAR;
        }
    }
    gotoMoveOfType(searchingForWhiteMove, moveType) {
        console.log("tryna go to move of type", moveType, searchingForWhiteMove);
        const startingPoint = this.currentMove + (((this.currentMove % 2 == 0 && searchingForWhiteMove) || (this.currentMove % 2 == 1 && !searchingForWhiteMove)) ? 1 : 0);
        var nextMove = startingPoint;
        if ((nextMove + 2) >= this.currentMoveArray.length) {
            nextMove = 1 + ((searchingForWhiteMove) ? 0 : 1);
        }
        else {
            nextMove = (nextMove + 2);
        }
        console.log(this.guiHandler.getGameAnalysis());
        while (nextMove != startingPoint && nextMove != startingPoint + 1) {
            console.log(nextMove, "nextmove");
            if (this.guiHandler.getGameAnalysis()[nextMove]["moveRating"] == moveType) {
                this.gotoMove(nextMove);
                return;
            }
            if ((nextMove + 2) >= this.currentMoveArray.length) {
                nextMove = 1 + ((searchingForWhiteMove) ? 0 : 1);
            }
            else {
                nextMove = (nextMove + 2);
            }
        }
    }
    moveArrayToPgn(moveArray) {
        var chessjs = Chess();
        for (const move of moveArray) {
            console.log(move.san);
            chessjs.move(move.san);
        }
        console.log(chessjs.pgn());
        return chessjs.pgn();
    }
    setGameFromExtension(currentFenArray, currentMoveArray, analysisData, analyzedFens, playerSide, initialSet = false) {
        console.log("injector tried to call me", this.ready, currentFenArray, currentMoveArray);
        if (initialSet || this.ready) {
            this.currentFenArray = currentFenArray;
            this.currentMoveArray = currentMoveArray;
            this.analysisData = analysisData;
            this.analyzedFens = analyzedFens;
            this.playerSide = playerSide;
            const pgnString = this.moveArrayToPgn(currentMoveArray);
            this.guiHandler.setBoardOrientation(playerSide);
            this.guiHandler.updateSidebar(pgnString);
            this.startAnalysis();
            return true;
        }
        else {
            return false;
        }
    }
    setPgn(pgnString) {
        this.analysisData = [];
        this.analyzedFens = [];
        this.currentPgn = pgnString;
        this.currentFenArray = PgnToFenArr(this.currentPgn);
        this.currentMoveArray = PgnToMoveArr(this.currentPgn);
        this.guiHandler.updateSidebar(pgnString);
        this.gotoMove(0);
        this.guiHandler.clearData();
        this.startAnalysis();
    }
    getChessObject() {
        if (this.inAlternativePath) {
            return this.alternativeChessObject;
        }
        else {
            return this.mainChessObject;
        }
    }
    getAlternativeChessObject() {
        return this.alternativeChessObject;
    }
    getInAlternative() {
        return this.inAlternativePath;
    }
    startAnalysis() {
        this.analysisOrchestrator.analyzePgnGame(this.currentFenArray, this.currentMoveArray, this.playerSide, this.analysisData, this.analyzedFens);
    }
    updateBoardGUI(newFen, from, to, currentMoveIndex, MOVE_TYPE, isAlternativeMove = false) {
        this.guiHandler.setBoardAndMove(newFen, from, to, currentMoveIndex, MOVE_TYPE, isAlternativeMove);
        this.liveBoardEvaluation.evaulateNewBoard(newFen);
    }
    makeAlternativeMove(moveString, promotionPiece) {
        const from = moveString.substring(0, 2);
        const to = moveString.substring(2, 4);
        const moveCheck = this.alternativeChessObject.move({
            from: from,
            to: to,
            promotion: promotionPiece
        });
        console.log(moveCheck, moveString, this.alternativeChessObject.fen());
        if (moveCheck) {
            const currentFen = this.alternativeChessObject.fen();
            this.inAlternativePath = true;
            this.updateBoardGUI(currentFen, from, to, this.currentMove, Config.MOVE_TYPE.MOVE_REGULAR, true);
            this.alternativeStackLeft.push([moveString, promotionPiece]);
        }
        else {
            return "snapback";
        }
    }
    makePossibleAlternativeMove(moveString, promotionPiece) {
        this.guiHandler.getChessboard().clearCircles();
        var lastMainMoveString;
        if (this.currentMove >= this.currentMoveArray.length) {
            this.inAlternativePath = true;
        }
        else {
            lastMainMoveString = this.currentMoveArray[this.currentMove].from + this.currentMoveArray[this.currentMove].to;
        }
        if (this.inAlternativePath == true) {
            return this.makeAlternativeMove(moveString, promotionPiece);
        }
        else {
            if (moveString == lastMainMoveString) {
                this.gotoMove(this.currentMove + 1);
            }
            else {
                return this.makeAlternativeMove(moveString, promotionPiece);
            }
        }
    }
    goBackwards() {
        //todo: ubaci proveru da li je alternative == main
        if (this.inAlternativePath) {
            const lastMoveString = this.alternativeStackLeft.pop();
            this.alternativeStackRight.push(lastMoveString);
            const from = lastMoveString[0].substring(0, 2);
            const to = lastMoveString[0].substring(2, 4);
            this.alternativeChessObject.undo();
            this.guiHandler.setBoardAndMove(this.alternativeChessObject.fen(), from, to, this.currentMove, Config.MOVE_TYPE.MOVE_REGULAR, false);
            if (this.alternativeChessObject.fen() == this.mainChessObject.fen()) {
                this.inAlternativePath = false;
            }
        }
        else {
            this.gotoMove(this.currentMove - 1);
        }
    }
    goForwards() {
        //todo: ubaci proveru da li je alternative == main
        if (this.inAlternativePath) {
            if (this.alternativeStackRight.length > 0) {
                const firstNextMove = this.alternativeStackRight.pop();
                this.makePossibleAlternativeMove(firstNextMove[0], firstNextMove[1]);
            }
        }
        else {
            this.gotoMove(this.currentMove + 1);
        }
    }
    gotoMove(index) {
        console.log("going to move", index);
        this.inAlternativePath = false;
        index = clampAndBound(index, 0, this.currentMoveArray.length);
        this.currentMove = index;
        this.mainChessObject.load(this.currentFenArray[index]);
        this.alternativeChessObject.load(this.currentFenArray[index]);
        if (index > 0) {
            console.log(this.currentFenArray[index]);
            const moveFlag = this.currentMoveArray[index - 1].flags;
            const moveType = this.getMoveType(moveFlag);
            this.updateBoardGUI(this.currentFenArray[index], this.currentMoveArray[index - 1].fromto.substring(0, 2), this.currentMoveArray[index - 1].fromto.substring(2, 4), index, moveType);
        }
        else {
            this.updateBoardGUI(this.currentFenArray[index], "", "", index, Config.MOVE_TYPE.MOVE_REGULAR);
        }
    }
}
export { PlayerController };
