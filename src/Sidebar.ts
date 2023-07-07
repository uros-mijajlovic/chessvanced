export class Sidebar{
    
    private div: HTMLElement;
    constructor(divForTheSidebar: HTMLElement){
        this.div = document.createElement('div');
        this.div.style.backgroundColor = 'gray';
        this.div.id="sidebarComponent"
        divForTheSidebar.appendChild(this.div);
    }

    setAnalysisData(gameAnalysis){
        return;
        console.log(gameAnalysis);
        while (this.div.firstChild) {
            this.div.removeChild(this.div.firstChild);
        }
        const numDivs = 5;
        for (let i = 0; i < numDivs; i++) {
        const child = document.createElement('div');
        child.id = `div${i + 1}`;
        child.textContent = `Div ${i + 1}`;
        child.addEventListener('click', handleClick);
        this.div.appendChild(child);
        }

        // Event handler for div click
        function handleClick(event) {
            console.log(event.target.id);
        }

    }

    gotoMove(){
        
    }
}