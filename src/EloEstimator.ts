import { extractCPreal, getAccuracyFromWinPercent, getWinPercentFromCP } from "./utils/ChessboardUtils.js";

export class EloEstimator {

    private writeAccuracies(whiteAccuracy, blackAccuracy, isEloEstimate){
        
        document.getElementById("elo-estimator-white").textContent = whiteAccuracy.toString();
        document.getElementById("elo-estimator-black").textContent = blackAccuracy.toString();
        var elo_or_accuracy_text_fields=document.getElementsByClassName("elo-or-accuracy-text")
        if(isEloEstimate){
            for(const textField of elo_or_accuracy_text_fields){
                textField.textContent="ELO"
            }
        }else{
            for(const textField of elo_or_accuracy_text_fields){
                textField.textContent="Accuracy"
            }

        }

    }
    public calculateElo(gameAnalysis, fromPerspective: string, playerElos) {
        var currentlyBlockedEloEstimation=true;
        console.log("OK THIS MAH GAME ANALYSIS", gameAnalysis, playerElos);
        if(currentlyBlockedEloEstimation || playerElos[0]<0){
            var cps=extractCPreal(gameAnalysis);
            console.log("cprealarr", cps)
            const blackAccuracy=this.getTotalAccuracy(cps, "black").toFixed(1);
            const whiteAccuracy=this.getTotalAccuracy(cps, "white").toFixed(1);
            this.writeAccuracies(whiteAccuracy, blackAccuracy, false);
            console.log("black, white accuracy", blackAccuracy, whiteAccuracy);
        }else{
            var enemyAccuracy;
            var yourAccuracy;
            var yourElo=playerElos[0];
            var enemyElo=playerElos[1];
            var cps=extractCPreal(gameAnalysis);
            const blackAccuracy=this.getTotalAccuracy(cps, "black").toFixed(1);
            const whiteAccuracy=this.getTotalAccuracy(cps, "white").toFixed(1);
            if(fromPerspective=="white"){
                yourAccuracy=whiteAccuracy;
                enemyAccuracy=blackAccuracy
                
            }else{
                yourAccuracy=blackAccuracy
                enemyAccuracy=whiteAccuracy;
            }
            
            enemyElo=((100-80+parseFloat(enemyAccuracy))/100)*parseFloat(enemyElo)
            yourElo=((100+parseFloat(yourAccuracy)-parseFloat(enemyAccuracy))/100)*parseFloat(enemyElo)

            this.writeAccuracies(enemyElo.toFixed(0), yourElo.toFixed(0), true);
        }
    }
    private standardDeviation(arr: number[]): number {
        const n = arr.length;
        if (n <= 1) return 0;

        const mean = arr.reduce((acc, val) => acc + val, 0) / n;
        const variance = arr.reduce((acc, val) => acc + (val - mean) ** 2, 0) / n;

        return Math.sqrt(variance);
    }
    private getWinPercentagesFromCps(cpList) {
        var wpList = [];
        for (const cp of cpList) {
            wpList.push(getWinPercentFromCP(cp));
        }


        return wpList;
    }
    private getWeighedAccuraciesForCps(cpList) {
        const wpList = this.getWinPercentagesFromCps(cpList);
        console.log("wplist", wpList);

        const windowSize = Math.max(0, Math.min(8, Math.floor(cpList.length / 10)));
        const windows: number[][] = [];

        for (let i = 0; i < wpList.length - windowSize + 1; i++) {
            windows.push(wpList.slice(i, i + windowSize));
        }

        const lastIndex = wpList.length - windowSize;
        for (let i = 0; i < windowSize - 1; i++) {
            windows.push(wpList.slice(lastIndex + i, lastIndex + windowSize - 1));
        }

        const weights = windows.map(xs =>
            Math.max(Math.min(this.standardDeviation(xs), 12), 0.5)
        );
        console.log("weightList", weights);

        var weighted_accuracies = []
        for (let i = 0; i < wpList.length - 1; i++) {

            var prev = wpList[i]
            var next_win = wpList[i + 1]
            var weight = weights[i]
            var color = (i % 2 == 0)
            var accuracy = getAccuracyFromWinPercent(prev, next_win, color)

            weighted_accuracies.push([[accuracy, weight], color]);

        }

        return weighted_accuracies

    }
    private weighted_mean(data: [number, number][]): number {
        if (!data || data.length === 0) {
            return 0.0;
        }

        var weighted_sum = 0
        for (const element of data){
            weighted_sum+=element[0]*element[1];
        }
        var weight_sum = 0
        for (const element of data){
            weight_sum+=element[1];
        }

        if (weight_sum === 0) {
            return 0.0;
        }

        const weighted = weighted_sum / weight_sum;
        return weighted;
    }

    public getTotalAccuracy(cps, fromPerspective) {
        const forWhite = fromPerspective == "white"
        const allWeighedAccuracies = this.getWeighedAccuraciesForCps(cps);
        console.log("awA", allWeighedAccuracies);
        const filteredWeightedAccuracies=[]
        for (let i = 0; i<allWeighedAccuracies.length; i++){
            if (allWeighedAccuracies[i][1]===forWhite){
                filteredWeightedAccuracies.push(allWeighedAccuracies[i][0]);
            }
        }

        const weightedMean = this.weighted_mean(filteredWeightedAccuracies)
        return weightedMean;
    }

}