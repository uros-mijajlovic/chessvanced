import { PlayerController } from "./PlayerController";
import { verticalLinePlugin, hoverLinePlugin,changeBarForCurrentMove } from "./chartPlugins.js";
declare var Chart: any;
var chartData = {
    lineAtIndex: [2,4,8],
    labels: [],
    datasets: [{
        label: 'Data',
        data: [],
        fill: {above: 'rgba(255, 255, 255, 0.8)', below: 'rgba(0, 0, 0, 0.8)', target: {value: 0}},
        borderWidth: 0,
        pointHitRadius: 50,
        usePointStyle: true,
        pointStyle: 'circle',
        pointRadius: 3,
        hoverRadius:5,
        hoverBorderWidth:0,
        borderColor:"rgba(170, 252, 255, 0.8)",
    }]
  };





export class EvaluationGraph {
    
    private chartData:Record<string, any>;
    private canvasId:string
    private gameAnalysis:any;
    private graph:any;
    public playerControllerInst:PlayerController;
    constructor(canvasId : string){

        this.chartData=chartData;
        this.canvasId=canvasId;
        this.gameAnalysis=null;
        
        
        const ctx = document.getElementById(canvasId);
        this.graph=new Chart(ctx, {
        
        type: 'line',
        data: this.chartData,
        plugins:[verticalLinePlugin, hoverLinePlugin],
        options: {

            pointBackgroundColor: (context) => {
              const index = context.dataIndex;
              try{
                if(this.gameAnalysis[index]["moveRating"]=="brilliant"){
                  return "rgba(15, 255, 243, 1)"
                }else if(this.gameAnalysis[index]["moveRating"]=="mistake"){
                  return "red";
                }else{
                  return "gray";
                }
              }catch{
                return "gray";
              }
            },
            plugins: {
                legend: {
                    display: false,
                },
                verticalLinePlugin:{
                  lineColor:"cyan",
                  xPosition:3,
                }
                
            },
            responsive: true,
            maintainAspectRatio:false,
            interaction: {
            mode: 'index',
            intersect: false,
            },
            scales: {
                y: {
                  min: -10,
                  max: 10,
                  ticks: {
                    display: false
                  }
                },
                x: {
                    ticks: {
                      display: false
                    }
                  },
                
            },
            onClick: (e) => {

                const canvasPosition = Chart.helpers.getRelativePosition(e, this.graph);
                const dataX = this.graph.scales.x.getValueForPixel(canvasPosition.x);
                const dataY = this.graph.scales.y.getValueForPixel(canvasPosition.y);
                console.log(dataX, dataY);
                this.playerControllerInst.gotoMove(dataX);
        }
        }
        });
    }
    updateGraph(newGameAnalysis){
      this.gameAnalysis=newGameAnalysis
      var labels = this.chartData.labels=[];
      var data = this.chartData.datasets[0].data=[];

      for(const moveData of this.gameAnalysis){

        labels.push(labels.length + 1);
        data.push(moveData["evaluation"]);

      }
      this.graph.update();

    } 
    updateGraphSelectedMove(index){
      changeBarForCurrentMove(index);
      this.graph.update();

    } 
}