export class Sidebar{

    private div: HTMLElement;
    constructor(divForTheSidebar: HTMLElement){
        this.div = document.createElement('div');
        this.div.style.backgroundColor = 'red';
        this.div.style.width = '200px';
        this.div.style.height = '200px';
        divForTheSidebar.appendChild(this.div);
    }

    setAnalysisData(){

    }

    gotoMove(){
        
    }
}