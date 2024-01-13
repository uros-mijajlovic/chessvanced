

class OpeningsBase {

    private isLoaded: boolean;
    private isFailed: boolean;
    private openingsDict: { [key: string]: any }

    constructor() {
        this.isLoaded = false;
        this.isFailed = false;
    }
    public async loadOpenings(){

        try {
            this.openingsDict = await this.loadJsonFromFile("/assets/openings_final.json")
            this.isLoaded = true
        } catch (error) {
            // alert("failed to load")
            this.isFailed = true
        }

    }
    private async loadJsonFromFile(filePath: string): Promise<any> {
        try {
            const response = await fetch(filePath);
            const jsonData = await response.json();
            return jsonData;
        } catch (error) {
            throw new Error(`Error loading JSON from ${filePath}: ${error.message}`);
        }
    }

    private binarySearch(target) {
        let left = 0;
        let right = this.openingsDict.length - 1;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const midValue : String = this.openingsDict[mid]["g"];

            if (midValue.startsWith(target)) {
                return mid; // Target found, return the index
            } else if (midValue < target) {
                left = mid + 1; // Adjust the search range to the right half
            } else {
                right = mid - 1; // Adjust the search range to the left half
            }
        }

        return -1
    }

    public isBookMove(gameStr: String): boolean{
        
        if (!this.isLoaded) {
            // alert("failed to load")
            return false
        }

        var index = this.binarySearch(gameStr)
        if(index!=-1){
            
            return true
        }else{
            // alert("not a game")
            return false
        }
    }



}

export { OpeningsBase }