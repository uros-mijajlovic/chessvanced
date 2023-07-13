import { PlayerController } from "./PlayerController";
import { verticalLinePlugin, hoverLinePlugin,changeBarForCurrentMove } from "./chartPlugins.js";
import { Config } from "./config/config.js";
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
        pointRadius: [],
        hoverRadius:5,
        hoverBorderWidth:0,
        borderColor:"rgba(170, 252, 255, 0.8)",
    }]
  };

var globalGameAnalysis=[]





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
                return Config.Colors[this.gameAnalysis[index]["moveRating"]];
                
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
                },
                tooltip:{
                  bodySpacing:0,
                  displayColors: false,
                  callbacks: {
                    title: function(tooltipItem, data) {
                      return "";
                    },
                    body:function(tooltipItem) {
                      return "k";
                    },
                    label:function(tooltipItem) {
                      return globalGameAnalysis[tooltipItem.dataIndex]["CP"].toString();
                    }

                  },

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
                  min: -50,
                  max: 50,
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
      globalGameAnalysis=newGameAnalysis;
      var labels = this.chartData.labels=[];
      var data = this.chartData.datasets[0].data=[];
      var pointRadii= this.chartData.datasets[0].pointRadius=[];

      for(const moveData of this.gameAnalysis){

        labels.push(moveData["CP"].toString());
        
        data.push(moveData["evaluation"]);

        pointRadii.push(moveData["moveRating"]=="gray" ? 1 : 3)

      }
      this.graph.update();

    } 
    updateGraphSelectedMove(index){
      changeBarForCurrentMove(index);
      this.graph.update();

    } 
}