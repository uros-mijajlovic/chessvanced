import { SoundHandler } from "./SoundHandler.js";
import { Config } from "./config/config.js";
import ChessboardHandler from "./ChessboardHandler.js";
import { EloEstimator } from "./EloEstimator.js";
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
class GuiHandler {
    constructor(evaluationGraphInst, sidebar) {
        this.soundHandler = new SoundHandler();
        this.evaluationGraph = evaluationGraphInst;
        this.chessboardHandler = new ChessboardHandler();
        this.eloEstimator = new EloEstimator();
        this.sidebar = sidebar;
        this.boardOrientation = "white";
        this.boardSetup();
    }
    getEloEstimator() {
        return this.eloEstimator;
    }
    boardSetup() {
        var boardRanks = document.getElementsByClassName("squares-2dea6")[0];
        var i = 8;
        console.log("board ranks", boardRanks);
        for (const rank of boardRanks.children) {
            const firstSquare = rank.firstChild;
            var spanChild = document.createElement("span");
            spanChild.textContent = i.toString();
            firstSquare.appendChild(spanChild);
            i -= 1;
        }
        var i = 8;
        for (const rank of boardRanks.children) {
            const lastSquare = rank.children[7];
            var spanChild = document.createElement("span");
            spanChild.textContent = i.toString();
            lastSquare.appendChild(spanChild);
            i -= 1;
        }
        var topRank = boardRanks.children[0];
        i = 0;
        for (const childSquare of topRank.children) {
            var emptyChild = document.createElement("span");
            var spanChild = document.createElement("span");
            spanChild.textContent = String.fromCharCode(97 + i);
            ;
            if (i != 7 && i != 0) {
                childSquare.appendChild(emptyChild);
            }
            childSquare.appendChild(spanChild);
            i += 1;
        }
        var topRank = boardRanks.children[7];
        i = 0;
        for (const childSquare of topRank.children) {
            var emptyChild = document.createElement("span");
            var spanChild = document.createElement("span");
            spanChild.textContent = String.fromCharCode(97 + i);
            ;
            if (i != 7 && i != 0) {
                childSquare.appendChild(emptyChild);
            }
            childSquare.appendChild(spanChild);
            i += 1;
        }
    }
    getSidebar() {
        return this.sidebar;
    }
    getGameAnalysis() {
        return this.gameAnalysis;
    }
    setBoardOrientation(boardOrientation) {
        if (this.boardOrientation != boardOrientation) {
            this.flipBoard();
        }
    }
    clearData() {
        this.gameAnalysis = [];
        this.evaluationGraph.clearData();
    }
    showImportPopup() {
        console.log("Vsiible");
        document.getElementById("import_popup").style.visibility = "visible";
    }
    hideImportPopup() {
        document.getElementById("import_popup").style.visibility = "hidden";
    }
    clearArrows() {
        this.chessboardHandler.clearArrows();
    }
    addBestMoveArrow(fromto) {
        this.chessboardHandler.addBestMoveArrow(fromto);
    }
    addArrowToBoard(from, to) {
        this.chessboardHandler.addArrowToBoard(from, to);
    }
    getChessboard() {
        return this.chessboardHandler.getChessboard();
    }
    flipBoard() {
        if (this.boardOrientation == "white") {
            this.boardOrientation = "black";
        }
        else {
            this.boardOrientation = "white";
        }
        this.flipGlyphs();
        this.sidebar.setCounterOrientation(this.boardOrientation);
        this.chessboardHandler.flipBoard();
    }
    createPromotionPopup(callback, sourceTile, targetTile, sidePlaying) {
        this.chessboardHandler.createPromotionPopup(callback, sourceTile, targetTile, sidePlaying);
    }
    colorTile(tile, TILE_COLOR, tile_css = "yellow_tile") {
        this.chessboardHandler.colorTile(tile, TILE_COLOR, tile_css);
    }
    deactivateTiles() {
        this.chessboardHandler.deactivateTiles();
    }
    colorTilesForMove(from, to, moveIndex) {
        this.deactivateTiles();
        if (from != "" && to != "") {
            console.log(this.gameAnalysis);
            const moveAnalysis = this.gameAnalysis[moveIndex];
            var moveRating;
            if (moveAnalysis) {
                moveRating = this.gameAnalysis[moveIndex]["moveRating"];
            }
            else {
                moveRating = "gray";
            }
            const cssForTile = Config.CssDictForTiles[moveRating];
            this.colorTile(from, Config.TILE_COLORS.ACTIVE, cssForTile);
            this.colorTile(to, Config.TILE_COLORS.ACTIVE, cssForTile);
        }
    }
    createGlyph(row, column, moveRating) {
        // Create an SVG element (you can replace this with your desired glyph)
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); // Set a larger height for better visibility
        svg.setAttribute("viewBox", "-20 -20 200 200"); // Set the viewBox for scaling
        svg.style.position = "absolute";
        svg.style.width = "15.5%";
        svg.style.height = "15.5%";
        const svgContent = Config.glyphToSvg[moveRating];
        svg.innerHTML = svgContent;
        if (this.boardOrientation == "black") {
            svg.style.left = `${(7 - column) * 12.5}%`;
            svg.style.bottom = `${(7 - row) * 12.5}%`;
        }
        else {
            svg.style.left = `${column * 12.5}%`;
            svg.style.bottom = `${row * 12.5}%`;
        }
        return svg;
    }
    flipGlyphs() {
        const board = document.getElementsByClassName("squares-2dea6")[0];
        const glyphs = board.querySelectorAll("svg");
        glyphs.forEach(svg => {
            // Get the left and top style values as percentages
            const leftPercentage = svg.style.left || '0%';
            const topPercentage = svg.style.bottom || '0%';
            // Convert percentages to absolute values
            const leftAbsolute = Math.abs(87.5 - parseFloat(leftPercentage));
            const topAbsolute = Math.abs(87.5 - parseFloat(topPercentage));
            // Update the style properties
            svg.style.left = `${leftAbsolute}%`;
            svg.style.bottom = `${topAbsolute}%`;
        });
    }
    addGlyphForMove(square, moveIndex) {
        this.deactivateGlyphs();
        const moveRating = this.gameAnalysis[moveIndex]["moveRating"];
        if (Config.glyphToSvg.hasOwnProperty(moveRating)) {
            const indexRow = parseInt(square[1]) - 1;
            const indexColumn = square[0].charCodeAt(0) - "a".charCodeAt(0);
            console.log(`${square}, row ${indexRow} column ${indexColumn}`);
            const myGlyph = this.createGlyph(indexRow, indexColumn, moveRating);
            const board = document.getElementsByClassName("squares-2dea6")[0];
            board.appendChild(myGlyph);
        }
    }
    deactivateGlyphs() {
        const board = document.getElementsByClassName("squares-2dea6")[0];
        const glyphs = board.querySelectorAll("svg");
        for (const glyph of glyphs) {
            glyph.remove();
        }
        //deactivate glyps
    }
    async setBoardAndMove(fenString, from, to, moveIndex, moveType = Config.MOVE_TYPE.MOVE_NONE, isAlternativeMove = false) {
        // if(this.gameAnalysis[moveIndex] && this.gameAnalysis[moveIndex]["moveRating"]=="brilliant" && getPieceAtSquare(fenString, to)?.type=="r"){
        //   moveType=Config.MOVE_TYPE.LEVY_THEROOK;
        // }
        this.soundHandler.playSound(moveType);
        this.evaluationGraph.updateGraphSelectedMove(moveIndex);
        this.chessboardHandler.setPosition(fenString, false);
        if (isAlternativeMove) {
            this.deactivateGlyphs();
            this.deactivateTiles();
            this.colorTile(from, Config.TILE_COLORS.ACTIVE, "yellow_tile");
            this.colorTile(to, Config.TILE_COLORS.ACTIVE, "yellow_tile");
        }
        else {
            this.colorTilesForMove(from, to, moveIndex);
            this.addGlyphForMove(to, moveIndex);
        }
    }
    updateGraph(gameAnalysis) {
        //this.sidebar.setAnalysisData(gameAnalysis);
        this.sidebar.clearMoveCounter();
        var i = 0;
        for (const moveAnalysis of gameAnalysis) {
            this.addMoveAnalysis(moveAnalysis, ((i % 2 == 0) ? "black" : "white"));
            i++;
        }
        this.gameAnalysis = gameAnalysis;
        this.evaluationGraph.updateGraph(gameAnalysis);
        this.sidebar.updateWithNewAnalysis(gameAnalysis);
    }
    addMoveAnalysis(moveAnalysis, moveSide) {
        this.sidebar.addSpecialMove(moveAnalysis["moveRating"], moveSide);
    }
    updateSidebar(pgnString) {
        this.sidebar.setAnalysisData(pgnString);
    }
}
export { GuiHandler };
