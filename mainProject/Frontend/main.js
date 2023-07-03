import { evaluationGraph } from "./evaluationGraph.js";

function getRandomNumber(lastNumber) {

  let randomNumber;
  const chance = Math.random(); // Generate a random chance value between 0 and 1

  if (chance < 0.8) {
    // 80% chance of ±2
    const offset = (Math.random() < 0.5) ? -2 : 2; // Determine whether to add or subtract 2
    randomNumber = lastNumber + offset;
  } else {
    // 20% chance of ±6
    const offset = (Math.random() < 0.5) ? -6 : 6; // Determine whether to add or subtract 6
    randomNumber = lastNumber + offset;
  }

  // Ensure the random number is within the range of -10 and 10
  randomNumber = Math.max(-10, Math.min(10, randomNumber));

  return randomNumber;
}

const graph=new evaluationGraph('myChart');
var analysisData=[]
for (let i = 0; i < 50; i++) {
  const randomEvaluation = getRandomNumber(0);
  analysisData.push({"evaluation":randomEvaluation});
}

for (let i = 1; i < 50; i++) {
  if(analysisData[i]["evaluation"]>analysisData[i-1]["evaluation"]+6){
    analysisData[i]["moveRating"]="brilliant";
  }else if(analysisData[i]["evaluation"]<analysisData[i-1]["evaluation"]-6){
    analysisData[i]["moveRating"]="mistake";
  }else{
    analysisData[i]["moveRating"]="good";
  }
}

graph.updateGraph(analysisData);