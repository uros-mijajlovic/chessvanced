import { boardConfig, getRowFromTile } from "./utils/ChessboardUtils.js";
import { Config } from "./config/config.js";
import { Chess } from "../dependencies/chess.js";
export default class ChessboardHandler {
    constructor() {
        this.chessObject = Chess();
        this.activeTiles = [];
        this.chessBoard = Chessboard2('chessground', boardConfig);
    }
    clearArrows() {
        this.chessBoard.clearArrows();
    }
    addBestMoveArrow(fromto) {
        this.chessBoard.clearArrows();
        const from = fromto.substring(0, 2);
        const to = fromto.substring(2, 4);
        this.addArrowToBoard(from, to);
    }
    addArrowToBoard(from, to) {
        const smer = from + '-' + to;
        //console.log(`NACRTAJ MI STRELICU OD ${smer} DA TI NE BIH JEBAO MAMU`)
        this.chessBoard.addArrow(smer, 'small');
    }
    setPosition(fen, somebool) {
        this.chessObject.load(fen);
        this.chessBoard.position(fen, somebool);
    }
    getPieceAtSquare(square) {
        return this.chessObject.get(square);
    }
    getChessboard() {
        return this.chessBoard;
    }
    flipBoard() {
        this.chessBoard.flip();
        this.flipPromotionPopup(document.getElementById("promotion_bar"));
    }
    createButton(id, callback, sourceTile, targetTile, sidePlaying) {
        const imgWrapDiv = document.createElement('div');
        imgWrapDiv.classList.add("promotion-figure-button");
        const button = document.createElement('img');
        button.src = "/img/chesspieces/wikipedia/" + sidePlaying + Config.PROMOTION_TO_CHAR[id].toUpperCase() + ".png";
        button.id = `button-${id}`;
        button.addEventListener('click', (event) => this.promotionChosenCallback(event, callback, sourceTile, targetTile, id));
        imgWrapDiv.appendChild(button);
        return imgWrapDiv;
    }
    promotionChosenCallback(event, callback, sourceTile, targetTile, id) {
        const buttonContainer = document.getElementById('promotion_bar');
        buttonContainer.style.visibility = "hidden";
        while (buttonContainer.firstChild) {
            buttonContainer.removeChild(buttonContainer.firstChild);
        }
        callback(sourceTile, targetTile, Config.PROMOTION_TO_CHAR[id]);
    }
    movePromotionPopup(promotionPopup, targetTile, sidePlaying) {
        console.log(targetTile);
        const translateX = 100 * (getRowFromTile(targetTile));
        const translateY = sidePlaying == 'w' ? 0 : 100;
        console.log("translate", translateX, translateY);
        if (this.chessBoard.orientation() == "white") {
            promotionPopup.style.transform = `translate(${translateX}%, ${translateY}%)`;
        }
        else {
            promotionPopup.style.transform = `translate(${700 - translateX}%, ${100 - translateY}%)`;
        }
    }
    flipPromotionPopup(promotionPopup) {
        const oldTranslate = promotionPopup.style.transform;
        const regex = /translate\((\d+)%, (\d+)%\)/;
        // Use the exec method of the regex to get the matched groups
        const match = regex.exec(oldTranslate);
        if (match) {
            const x = parseInt(match[1]);
            const y = parseInt(match[2]);
            promotionPopup.style.transform = `translate(${700 - x}%, ${100 - y}%)`;
        }
    }
    createPromotionPopup(callback, sourceTile, targetTile, sidePlaying) {
        console.log("PRAVIM DUGMICE");
        const popupContainer = document.getElementById('promotion_bar');
        this.movePromotionPopup(popupContainer, targetTile, sidePlaying);
        popupContainer.style.visibility = "visible";
        // Create and add four buttons to the container
        for (let i = 0; i <= 3; i++) {
            const button = this.createButton(i, callback, sourceTile, targetTile, sidePlaying);
            popupContainer.appendChild(button);
        }
    }
    colorTile(tile, TILE_COLOR, tile_css = "yellow_tile") {
        var chessgroundElement = document.getElementById("chessground");
        const indexRow = 8 - parseInt(tile[1]);
        const indexColumn = tile[0].charCodeAt(0) - "a".charCodeAt(0);
        if (indexRow >= 0 && indexRow < 8 && indexColumn >= 0 && indexColumn < 8) {
            var selectedTile = chessgroundElement.firstElementChild.firstElementChild.children[1].children[indexRow].children[indexColumn];
            if (TILE_COLOR == Config.TILE_COLORS.ACTIVE) {
                const lastClassOfTile = selectedTile.classList[selectedTile.classList.length - 1];
                if (lastClassOfTile != "active") {
                    this.activeTiles.push(tile);
                    if (lastClassOfTile == "inactive") {
                        selectedTile.classList.remove(lastClassOfTile);
                        selectedTile.classList.add(tile_css);
                    }
                    else {
                        selectedTile.classList.add(tile_css);
                    }
                }
            }
            else if (TILE_COLOR == Config.TILE_COLORS.INACTIVE) {
                selectedTile.classList.remove(selectedTile.classList[selectedTile.classList.length - 1]);
                selectedTile.classList.add("kurac");
            }
        }
    }
    deactivateTiles() {
        while (this.activeTiles.length > 0) {
            this.colorTile(this.activeTiles[this.activeTiles.length - 1], Config.TILE_COLORS.INACTIVE);
            this.activeTiles.pop();
        }
    }
}
