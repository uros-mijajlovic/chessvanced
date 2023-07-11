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
}