import {Chess} from '../dependencies/chess.js';
import { GuiHandler } from './GuiHandler.js';
import { PlayerController } from './PlayerController.js';
import { Config } from './config/config.js';
function getMovesFromFen(fenString){
    const chess=Chess();
    chess.load_pgn(fenString);
    const moves = chess.history();
    var senMoves=[];
  
    moves.forEach((move, index) => {
      senMoves.push(move);
    });
    return senMoves;

}


export class Sidebar{
    
    private div: HTMLElement;
    public playerController:PlayerController;
    public guiHandler:GuiHandler;
    private playerSide:string;
    constructor(divForTheSidebar: HTMLElement){
        this.div = divForTheSidebar;
        this.playerSide="white"
        document.getElementById("flipBoardButton").addEventListener('click', () => {this.guiHandler.flipBoard()});

        document.getElementById("loadpgnButton").addEventListener('click', () => {this.guiHandler.showImportPopup()});

        document.getElementById("import-button").addEventListener('click', () => {this.importFromText()});

        document.getElementById("close-import-button").addEventListener('click', () => {this.guiHandler.hideImportPopup()});

        const moveOverviewDiv = document.getElementById("moveOverviewDiv");
        Config.MOVE_NAMES.forEach((name) => {
            var div = document.createElement("div")
            div.className="moveOverview "+ Config.MOVE_TO_ID_NAME[name];
            
            var moveOverviewYou = document.createElement("span")
            moveOverviewYou.textContent="0";
            moveOverviewYou.id = "white-"+Config.MOVE_TO_ID_NAME[name];
            moveOverviewYou.addEventListener('click', (event) => this.gotoSpecialMove(event));

            var moveOverviewName = document.createElement("div")
            moveOverviewName.textContent=name;

            var moveOverviewOpponent = document.createElement("span")
            moveOverviewOpponent.textContent="0";
            moveOverviewOpponent.id = "black-"+Config.MOVE_TO_ID_NAME[name];
            moveOverviewOpponent.addEventListener('click', (event) => this.gotoSpecialMove(event));

            div.append(moveOverviewYou);
            div.append(moveOverviewName);
            div.append(moveOverviewOpponent);
            moveOverviewDiv.append(div);
            
        })
    }

    public setCounterOrientation(playerSide){
        if(this.playerSide!=playerSide){
            this.playerSide=playerSide;
            const moveOverviewDiv = document.getElementById("moveOverviewDiv");
            if (moveOverviewDiv.className=="reversed"){
                moveOverviewDiv.className=""
            }else{
                moveOverviewDiv.className="reversed"
            }
        }
        
    }

    public gotoSpecialMove(event){
        const spanId=event.target.id as String;
        this.playerController.gotoMoveOfType(spanId.substring(0, 5)=="white", Config.ID_NAME_TO_MOVE_RATING[spanId.slice(6)])
        console.log("tried to go to move", event.target.id)
    }
    
    public addSpecialMove(moveRating, moveSide){
        
        const idName = Config.MOVE_RATING_TO_ID_NAME[moveRating];
        console.log("wanna add special move ", moveRating, moveSide+"-"+idName)
        const spamCounterElement=document.getElementById(moveSide+"-"+idName)
        if(spamCounterElement){
            spamCounterElement.textContent=(parseInt(spamCounterElement.textContent)+1).toString();
        }


    }
    public clearMoveCounter(){
        const spans = document.getElementById("moveOverviewDiv").querySelectorAll("span");
        spans.forEach((span)=>{
            span.textContent="0";
        })
    }

    

    public importFromText(){
        const textarea = document.getElementById("pgn_textarea") as HTMLTextAreaElement;
        const text = textarea.value;
        this.guiHandler.hideImportPopup();
        this.playerController.setPgn(text);

    }


    public setAnalysisData(gameAnalysis){
        
        console.log("SETUP")
        //document.getElementById("import").addEventListener('click', () => {this.playerController.setPgn()});

        const handleClick = (event) => {
            this.playerController.gotoMove(parseInt(event.target.id)+1);
        };
        const getMoveElementDiv = (index:number, move1Str:string, move2Str:string) =>{
            const move_container = document.createElement('div');
            move_container.id = `${index + 1}`;
            move_container.textContent = `${(index+1)/2}`;
            move_container.className="move-element";
        
            const move1=document.createElement('div');
            move1.className="move-notation clickable";
            move1.textContent=move1Str;
            move1.id=`${index-1}`;
            move1.addEventListener('click', handleClick);

            move_container.appendChild(move1);
            if(move2Str!=""){
            const move2=document.createElement('div');
            move2.className="move-notation clickable";
            move2.textContent=move2Str;
            move2.id=`${index}`;
            move2.addEventListener('click', handleClick);
            move_container.appendChild(move2);
            }
            return move_container;
        }
    
        while (this.div.firstChild) {
            this.div.removeChild(this.div.firstChild);
        }
        const moves=getMovesFromFen(gameAnalysis);
        var moveTuple=[];
        moves.forEach((move, index) => {
            moveTuple.push(move);
            if(moveTuple.length==2){
                const move_container=getMoveElementDiv(index, moveTuple[0], moveTuple[1]);
                this.div.appendChild(move_container);
                moveTuple=[];
            }
            
        });

        if(moveTuple.length==1){
            const move_container=getMoveElementDiv(moves.length, moveTuple[0], "");
            this.div.appendChild(move_container);
        }
    }
}