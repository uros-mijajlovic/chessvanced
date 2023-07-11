import { Config } from "./config/config.js";

async function createBlobFromAudioFile(audioFileLocation: string): Promise<Blob> {
    const response = await fetch(audioFileLocation);
    return await response.blob();
  }
export class SoundHandler{
    private enabled:boolean;

    private audioArray:string[];

    constructor(){

        this.audioArray=Array(4).fill(undefined);
        createBlobFromAudioFile('/assets/audio/standard/Move.mp3').then((blob: Blob) => {
            this.audioArray[Config.MOVE_TYPE.MOVE_REGULAR]=URL.createObjectURL(blob);
        })
        createBlobFromAudioFile('/assets/audio/standard/Capture.mp3').then((blob: Blob) => {
            this.audioArray[Config.MOVE_TYPE.MOVE_CAPTURE]=URL.createObjectURL(blob);
        })
        createBlobFromAudioFile('/assets/audio/standard/Check.mp3').then((blob: Blob) => {
            this.audioArray[Config.MOVE_TYPE.MOVE_CHECK]=URL.createObjectURL(blob);
        })
        createBlobFromAudioFile('/assets/audio/standard/Mate.mp3').then((blob: Blob) => {
            this.audioArray[Config.MOVE_TYPE.MOVE_MATE]=URL.createObjectURL(blob);
        })



    }
    public enableSound(){
        this.enabled=true;
    }
    public disableSound(){
        this.enabled=false;
    }
    public playSound(soundType:Config.MOVE_TYPE){
        if(soundType!=Config.MOVE_TYPE.MOVE_NONE){
            let audio=new Audio(this.audioArray[soundType]);
            audio.volume=0.5;
            audio.play();
        }
    }
    


}