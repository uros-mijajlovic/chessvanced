import { EvaluationGraph } from "./EvaluationGraph.js";
import { Sidebar } from "./Sidebar.js";
import { SoundHandler } from "./SoundHandler.js";
import { Config } from "./config/config.js"
import { boardConfig, getRowFromTile } from "./utils/ChessboardUtils.js";
import ChessboardHandler from "./ChessboardHandler.js";
declare var Chessboard2: any;

const glyphToSvg = {
  // Inaccuracy
  'inaccuracy': `
<g transform="translate(105 -5) scale(0.55)">
  <circle style="fill:#56b4e9" cx="50" cy="50" r="50" />
  <path style="fill:#ffffff;stroke-width:0.81934" d="m 37.734375,21.947266 c -3.714341,0 -7.128696,0.463992 -10.242187,1.392578 -3.113493,0.928585 -6.009037,2.130656 -8.685547,3.605468 l 4.34375,8.765626 c 2.348774,-1.201699 4.643283,-2.157093 6.882812,-2.867188 2.239529,-0.710095 4.504676,-1.064453 6.798828,-1.064453 2.294152,0 4.069851,0.463993 5.326172,1.392578 1.310944,0.873963 1.966797,2.185668 1.966797,3.933594 0,1.747925 -0.546219,3.276946 -1.638672,4.58789 -1.037831,1.256322 -2.786121,2.757934 -5.24414,4.50586 -2.785757,2.021038 -4.751362,3.961188 -5.898438,5.818359 -1.147076,1.857171 -1.720703,4.149726 -1.720703,6.88086 v 2.951171 h 10.568359 v -2.376953 c 0,-1.147076 0.137043,-2.10247 0.410156,-2.867187 0.327737,-0.764718 0.928772,-1.557613 1.802735,-2.376953 0.873963,-0.81934 2.103443,-1.802143 3.6875,-2.949219 2.130284,-1.584057 3.905982,-3.058262 5.326172,-4.423828 1.420189,-1.42019 2.485218,-2.951164 3.195312,-4.589844 0.710095,-1.63868 1.064453,-3.576877 1.064453,-5.816406 0,-4.205946 -1.583838,-7.675117 -4.751953,-10.40625 -3.113492,-2.731134 -7.510649,-4.095703 -13.191406,-4.095703 z m 24.744141,0.818359 2.048828,39.083984 h 9.75 L 76.324219,22.765625 Z M 35.357422,68.730469 c -1.966416,0 -3.63248,0.51881 -4.998047,1.55664 -1.365567,0.983208 -2.046875,2.731498 -2.046875,5.244141 0,2.403397 0.681308,4.151687 2.046875,5.244141 1.365567,1.03783 3.031631,1.55664 4.998047,1.55664 1.911793,0 3.550449,-0.51881 4.916016,-1.55664 1.365566,-1.092454 2.048828,-2.840744 2.048828,-5.244141 0,-2.512643 -0.683262,-4.260933 -2.048828,-5.244141 -1.365567,-1.03783 -3.004223,-1.55664 -4.916016,-1.55664 z m 34.003906,0 c -1.966416,0 -3.63248,0.51881 -4.998047,1.55664 -1.365566,0.983208 -2.048828,2.731498 -2.048828,5.244141 0,2.403397 0.683262,4.151687 2.048828,5.244141 1.365567,1.03783 3.031631,1.55664 4.998047,1.55664 1.911793,0 3.550449,-0.51881 4.916016,-1.55664 1.365566,-1.092454 2.046875,-2.840744 2.046875,-5.244141 0,-2.512643 -0.681309,-4.260933 -2.046875,-5.244141 -1.365567,-1.03783 -3.004223,-1.55664 -4.916016,-1.55664 z" />
</g>
`,

  // Mistake
  'mistake': `
<g transform="translate(105 -5) scale(0.55)">
  <circle style="fill:#e69f00" cx="50" cy="50" r="50" />
  <path style="fill:#ffffff;stroke-width:0.932208" d="m 40.435856,60.851495 q 0,-4.661041 1.957637,-7.830548 1.957637,-3.169507 6.711897,-6.618677 4.194937,-2.983065 5.966132,-5.127144 1.864416,-2.237299 1.864416,-5.220365 0,-2.983065 -2.237299,-4.474598 -2.144079,-1.584754 -6.059353,-1.584754 -3.915273,0 -7.737326,1.21187 -3.822053,1.211871 -7.830548,3.262729 L 28.13071,24.495382 q 4.567819,-2.516962 9.881405,-4.101716 5.313586,-1.584753 11.6526,-1.584753 9.694964,0 15.008549,4.66104 5.406807,4.66104 5.406807,11.839042 0,3.822053 -1.21187,6.618677 -1.211871,2.796624 -3.635612,5.220365 -2.423741,2.33052 -6.059352,5.033923 -2.703403,1.957637 -4.194936,3.355949 -1.491533,1.398312 -2.050858,2.703403 -0.466104,1.305091 -0.466104,3.262728 v 2.703403 H 40.435856 Z m -1.491533,18.923822 q 0,-4.288156 2.33052,-5.966131 2.33052,-1.771195 5.686469,-1.771195 3.262728,0 5.593248,1.771195 2.33052,1.677975 2.33052,5.966131 0,4.101716 -2.33052,5.966132 -2.33052,1.771195 -5.593248,1.771195 -3.355949,0 -5.686469,-1.771195 -2.33052,-1.864416 -2.33052,-5.966132 z" />
</g>
`,

  // Blunder
  'blunder': `
<g transform="translate(105 -5) scale(0.55)">
  <circle style="fill:#df5353" cx="50" cy="50" r="50" />
  <path style="fill:#ffffff;stroke-width:0.810558" d="m 31.799294,22.220598 c -3.67453,-10e-7 -7.050841,0.460303 -10.130961,1.378935 -3.08012,0.918633 -5.945403,2.106934 -8.593226,3.565938 l 4.297618,8.67363 c 2.3236,-1.188818 4.592722,-2.135794 6.808247,-2.838277 2.215525,-0.702483 4.45828,-1.053299 6.727842,-1.053299 2.269562,0 4.025646,0.460305 5.268502,1.378937 1.296893,0.864596 1.945788,2.160375 1.945788,3.889565 0,1.72919 -0.541416,3.241939 -1.62216,4.538831 -1.026707,1.242856 -2.756423,2.729237 -5.188097,4.458428 -2.755898,1.999376 -4.700572,3.917682 -5.835354,5.754947 -1.13478,1.837266 -1.702564,4.106388 -1.702564,6.808248 v 2.918681 h 10.4566 v -2.34982 c 0,-1.134781 0.135856,-2.081756 0.406042,-2.838277 0.324222,-0.756521 0.918373,-1.539262 1.782969,-2.349819 0.864595,-0.810559 2.079262,-1.783901 3.646342,-2.918683 2.10745,-1.567078 3.863533,-3.025082 5.268501,-4.376012 1.404967,-1.404967 2.459422,-2.919725 3.161905,-4.540841 0.702483,-1.621116 1.053298,-3.539423 1.053298,-5.754948 0,-4.160865 -1.567492,-7.591921 -4.70165,-10.29378 -3.080121,-2.70186 -7.429774,-4.052384 -13.049642,-4.052384 z m 38.66449,0 c -3.67453,-10e-7 -7.05285,0.460303 -10.132971,1.378935 -3.08012,0.918633 -5.943393,2.106934 -8.591215,3.565938 l 4.295608,8.67363 c 2.323599,-1.188818 4.592721,-2.135794 6.808246,-2.838277 2.215526,-0.702483 4.458281,-1.053299 6.727842,-1.053299 2.269563,0 4.025647,0.460305 5.268502,1.378937 1.296893,0.864596 1.945788,2.160375 1.945788,3.889565 0,1.72919 -0.539406,3.241939 -1.62015,4.538831 -1.026707,1.242856 -2.756423,2.729237 -5.188097,4.458428 -2.755897,1.999376 -4.700572,3.917682 -5.835353,5.754947 -1.134782,1.837266 -1.702564,4.106388 -1.702564,6.808248 v 2.918681 h 10.456599 v -2.34982 c 0,-1.134781 0.133846,-2.081756 0.404032,-2.838277 0.324223,-0.756521 0.918374,-1.539262 1.782969,-2.349819 0.864596,-0.810559 2.081273,-1.783901 3.648352,-2.918683 2.107451,-1.567078 3.863534,-3.025082 5.268502,-4.376012 1.404966,-1.404967 2.45942,-2.919725 3.161904,-4.540841 0.702483,-1.621116 1.053299,-3.539423 1.053299,-5.754948 0,-4.160865 -1.567493,-7.591921 -4.701651,-10.29378 -3.08012,-2.70186 -7.429774,-4.052384 -13.049642,-4.052384 z M 29.449473,68.50341 c -1.945339,0 -3.593943,0.513038 -4.944873,1.539744 -1.350931,0.97267 -2.026192,2.702386 -2.026192,5.188098 0,2.377636 0.675261,4.107352 2.026192,5.188097 1.35093,1.026707 2.999534,1.539745 4.944873,1.539745 1.891302,0 3.51153,-0.513038 4.86246,-1.539745 1.35093,-1.080745 2.026192,-2.810461 2.026192,-5.188097 0,-2.485712 -0.675262,-4.215428 -2.026192,-5.188098 -1.35093,-1.026706 -2.971158,-1.539744 -4.86246,-1.539744 z m 38.662481,0 c -1.945339,0 -3.591933,0.513038 -4.942864,1.539744 -1.35093,0.97267 -2.026192,2.702386 -2.026192,5.188098 0,2.377636 0.675262,4.107352 2.026192,5.188097 1.350931,1.026707 2.997525,1.539745 4.942864,1.539745 1.891302,0 3.513539,-0.513038 4.864469,-1.539745 1.350931,-1.080745 2.026192,-2.810461 2.026192,-5.188097 0,-2.485712 -0.675261,-4.215428 -2.026192,-5.188098 -1.35093,-1.026706 -2.973167,-1.539744 -4.864469,-1.539744 z" />
</g>
`,
'brilliant': `
<g class="layer">
<title>Layer 1</title>
<g id="svg_1" transform="matrix(0.55 0 0 0.55 0 0)">
 <circle cx="240.91" cy="40.91" fill="#34c9c9" id="svg_2" r="50"/>
 <text fill="#000000" font-family="Fantasy" font-size="24" id="svg_5" letter-spacing="2" opacity="0.55" stroke-width="0" text-anchor="middle" transform="matrix(3.5161 -0.00597026 0.00557864 3.28546 -551.824 -46.1199)" x="222.06" xml:space="preserve" y="36.71">!</text>
 <text fill="#ffffff" font-family="Fantasy" font-size="24" id="svg_6" letter-spacing="2" opacity="NaN" stroke-width="0" text-anchor="middle" transform="matrix(1 0 0 1 0 0) matrix(2.98604 -0.00493582 0.00534736 3.06578 -492.11 -36.6522)" x="241.41" xml:space="preserve" y="35.73">!</text>
 <text fill="#000000" font-family="Fantasy" font-size="24" id="svg_10" letter-spacing="2" opacity="0.55" stroke-width="0" text-anchor="middle" transform="matrix(3.5161 -0.00597026 0.00557864 3.28546 -526.666 -44.4195)" x="221.91" xml:space="preserve" y="36.15">!</text>
 <text fill="#ffffff" font-family="Fantasy" font-size="24" id="svg_8" letter-spacing="2" opacity="NaN" stroke-width="0" text-anchor="middle" transform="matrix(2.98604 -0.00493582 0.00534736 3.06578 -467.792 -36.8071)" x="241.41" xml:space="preserve" y="35.73">!</text>
</g>
</g>
`,
'great':`<g class="layer">
<title>Layer 1</title>
<g id="svg_1" transform="matrix(0.55 0 0 0.55 0 0)">
 <circle cx="240.91" cy="40.91" fill="#4242a3" id="svg_2" r="50"/>
 <text fill="#000000" font-family="Fantasy" font-size="24" id="svg_10" letter-spacing="2" opacity="0.55" stroke-width="0" text-anchor="middle" transform="matrix(1 0 0 1 0 0) matrix(3.5161 -0.00597026 0.00557864 3.28546 -536.922 -42.881)" x="221.91" xml:space="preserve" y="36.15">!</text>
 <text fill="#ffffff" font-family="Fantasy" font-size="24" id="svg_8" letter-spacing="2" opacity="NaN" stroke-width="0" style="cursor: move;" text-anchor="middle" transform="matrix(1 0 0 1 0 0) matrix(2.98604 -0.00493582 0.00534736 3.06578 -478.305 -36.5507)" x="241.41" xml:space="preserve" y="35.73">!</text>
</g>
</g>`
};

const sleep = (ms) => new Promise(r => setTimeout(r, ms));






class GuiHandler {
  private evaluationGraph: EvaluationGraph;
  private sidebar: Sidebar;
  private soundHandler: SoundHandler;
  private gameAnalysis: any[];
  private chessboardHandler: ChessboardHandler;
  private boardOrientation: string;
  constructor(evaluationGraphInst: EvaluationGraph, sidebar: Sidebar) {
    this.soundHandler = new SoundHandler();
    this.evaluationGraph = evaluationGraphInst;
    this.chessboardHandler = new ChessboardHandler();
    this.sidebar = sidebar;
    this.boardOrientation = "white";
    this.boardSetup();
  }

  public boardSetup(){
    var boardRanks = document.getElementsByClassName("squares-2dea6")[0];
    var i = 8;
    console.log("board ranks", boardRanks)
    for (const rank of boardRanks.children) {
      const firstSquare = rank.firstChild;

      var spanChild = document.createElement("span")
      spanChild.textContent = i.toString();

      firstSquare.appendChild(spanChild);
      i -= 1;
    }
    var i = 8;
    for (const rank of boardRanks.children) {

      const lastSquare = rank.children[7];

      var spanChild = document.createElement("span")
      spanChild.textContent = i.toString();

      lastSquare.appendChild(spanChild);
      i -= 1;

    }
    var topRank = boardRanks.children[0];
    i = 0;
    for (const childSquare of topRank.children) {
      var emptyChild = document.createElement("span");
      var spanChild = document.createElement("span")
      spanChild.textContent = String.fromCharCode(97 + i);;
      if (i != 7 && i != 0) {
        childSquare.appendChild(emptyChild);
      }
      childSquare.appendChild(spanChild);
      i += 1
    }

    var topRank = boardRanks.children[7];
    i = 0;
    for (const childSquare of topRank.children) {
      var emptyChild = document.createElement("span");
      var spanChild = document.createElement("span")

      spanChild.textContent = String.fromCharCode(97 + i);;
      if (i != 7 && i != 0) {
        childSquare.appendChild(emptyChild);
      }
      childSquare.appendChild(spanChild);
      i += 1
    }
    console.log("GUI HANDLER INITATED NIGGA", topRank)
  }
  public getSidebar(): Sidebar {
    return this.sidebar;
  }
  public getGameAnalysis() {
    return this.gameAnalysis;
  }
  public setBoardOrientation(boardOrientation) {
    if (this.boardOrientation != boardOrientation) {
      this.flipBoard();
    }
  }
  public clearData() {
    this.gameAnalysis = [];
    this.evaluationGraph.clearData();
  }
  public showImportPopup() {
    console.log("Vsiible")
    document.getElementById("import_popup").style.visibility = "visible";
  }
  public hideImportPopup() {
    document.getElementById("import_popup").style.visibility = "hidden";
  }

  public clearArrows() {
    this.chessboardHandler.clearArrows();
  }
  public addBestMoveArrow(fromto) {
    this.chessboardHandler.addBestMoveArrow(fromto);
  }
  public addArrowToBoard(from, to) {
    this.chessboardHandler.addArrowToBoard(from, to);
  }

  public getChessboard() {
    return this.chessboardHandler.getChessboard();
  }

  public flipBoard() {

    if (this.boardOrientation == "white") {
      this.boardOrientation = "black"
    } else {
      this.boardOrientation = "white"
    }
    this.flipGlyphs();
    this.sidebar.setCounterOrientation(this.boardOrientation)
    this.chessboardHandler.flipBoard();

  }

  public createPromotionPopup(callback, sourceTile, targetTile, sidePlaying: string) {

    this.chessboardHandler.createPromotionPopup(callback, sourceTile, targetTile, sidePlaying);
  }
  private colorTile(tile: string, TILE_COLOR: Config.TILE_COLORS, tile_css = "yellow_tile") {

    this.chessboardHandler.colorTile(tile, TILE_COLOR, tile_css);
  }

  private deactivateTiles() {
    this.chessboardHandler.deactivateTiles();

  }
  private colorTilesForMove(from, to, moveIndex) {
    this.deactivateTiles();

    if (from != "" && to != "") {
      const moveRating = this.gameAnalysis[moveIndex]["moveRating"];
      const cssForTile = Config.CssDictForTiles[moveRating];
      this.colorTile(from, Config.TILE_COLORS.ACTIVE, cssForTile);
      this.colorTile(to, Config.TILE_COLORS.ACTIVE, cssForTile);

    }

  }

  private createGlyph(row, column, moveRating) {

    // Create an SVG element (you can replace this with your desired glyph)
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); // Set a larger height for better visibility
    svg.setAttribute("viewBox", "-20 -20 200 200");  // Set the viewBox for scaling
    svg.style.position = "absolute";
    svg.style.width = "15.5%"
    svg.style.height = "15.5%"
    const svgContent=glyphToSvg[moveRating];
    svg.innerHTML = svgContent;
    if(this.boardOrientation=="black"){
      svg.style.left = `${(7-column)*12.5}%`;
      svg.style.bottom = `${(7-row)*12.5}%`;
    }else{
      svg.style.left = `${column*12.5}%`;
      svg.style.bottom = `${row*12.5}%`;
    }
    

    return svg;
  }
  private flipGlyphs(){
    const board=document.getElementsByClassName("squares-2dea6")[0]
    const glyphs=board.querySelectorAll("svg");
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

  private addGlyphForMove(square, moveIndex) {
    this.deactivateGlyphs();
    const moveRating = this.gameAnalysis[moveIndex]["moveRating"]
    if(glyphToSvg.hasOwnProperty(moveRating)){
      
      const indexRow = parseInt(square[1])-1;
      const indexColumn = square[0].charCodeAt(0) - "a".charCodeAt(0);
      console.log(`${square}, row ${indexRow} column ${indexColumn}`)
      const myGlyph=this.createGlyph(indexRow, indexColumn, moveRating);
      const board=document.getElementsByClassName("squares-2dea6")[0]
      board.appendChild(myGlyph);
    }
  }
  private deactivateGlyphs() {
    const board=document.getElementsByClassName("squares-2dea6")[0]
    const glyphs=board.querySelectorAll("svg");

    for (const glyph of glyphs) {
      glyph.remove();
    }

    //deactivate glyps
  }
  public async setBoardAndMove(fenString: string, from: string, to: string, moveIndex: number, moveType: Config.MOVE_TYPE = Config.MOVE_TYPE.MOVE_NONE, isAlternativeMove=false) {

    this.soundHandler.playSound(moveType);
    this.evaluationGraph.updateGraphSelectedMove(moveIndex);
    this.chessboardHandler.getChessboard().position(fenString, false);
    if(isAlternativeMove){
      this.deactivateGlyphs();
      this.deactivateTiles();
      this.colorTile(from, Config.TILE_COLORS.ACTIVE, "yellow_tile");
      this.colorTile(to, Config.TILE_COLORS.ACTIVE, "yellow_tile");
    }else{
      this.colorTilesForMove(from, to, moveIndex);
      this.addGlyphForMove(to, moveIndex);
    }
    
    

  }
  public updateGraph(gameAnalysis) {
    //this.sidebar.setAnalysisData(gameAnalysis);
    this.sidebar.clearMoveCounter();
    var i = 0
    for (const moveAnalysis of gameAnalysis) {
      this.addMoveAnalysis(moveAnalysis, ((i % 2 == 0) ? "black" : "white"))
      i++;
    }



    this.gameAnalysis = gameAnalysis;
    this.evaluationGraph.updateGraph(gameAnalysis);
  }

  public addMoveAnalysis(moveAnalysis, moveSide) {
    this.sidebar.addSpecialMove(moveAnalysis["moveRating"], moveSide)
  }

  public updateSidebar(pgnString) {
    this.sidebar.setAnalysisData(pgnString);
  }


}
export { GuiHandler };