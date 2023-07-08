import {Chess} from '../dependencies/chess.js';
import { PlayerController } from './PlayerController.js';
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
    constructor(divForTheSidebar: HTMLElement){
        this.div = divForTheSidebar;
    }


    setAnalysisData(gameAnalysis){
        const handleClick = (event) => {
            this.playerController.gotoMove(parseInt(event.target.id));
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