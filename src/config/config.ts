export namespace Config{
    export enum MOVE_TYPE {
        MOVE_REGULAR,
        MOVE_CAPTURE,
        MOVE_CHECK,
        MOVE_MATE,
        MOVE_NONE,
    };
    export enum ANALYSIS_FOR{
        WHITE,
        BLACK, 
        BOTH
    }
    export const Colors = {
        "brilliant":"rgba(15, 255, 243, 1)",
        "great":"rgba(107, 111, 229, 1)",
        "gray" : "gray",
        "mistake" : "red",


    }
}