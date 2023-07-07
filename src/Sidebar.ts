import {Chess} from '../dependencies/chess.js';

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
    constructor(divForTheSidebar: HTMLElement){
        this.div = divForTheSidebar;
    }

    setAnalysisData(gameAnalysis){
        while (this.div.firstChild) {
            this.div.removeChild(this.div.firstChild);
        }
        const moves=getMovesFromFen(gameAnalysis);
        var moveTuple=[];
        moves.forEach((move, index) => {
            moveTuple.push(move);
            if(moveTuple.length==2){
                const move_container = document.createElement('div');
                move_container.id = `${index + 1}`;
                move_container.textContent = `${(index+1)/2}`;
                move_container.className="move-element";

                const move1=document.createElement('div');
                move1.className="move-notation clickable";
                move1.textContent=moveTuple[0];
                //move1.addEventListener('click', handleClick);

                const move2=document.createElement('div');
                move2.className="move-notation clickable";
                move2.textContent=moveTuple[1];

                move_container.appendChild(move1);
                move_container.appendChild(move2);

                
                this.div.appendChild(move_container);
                moveTuple=[];
            }
        });

    
        function handleClick(event) {
            console.log(event.target.id);
        }

    }

    gotoMove(){
        
    }
}