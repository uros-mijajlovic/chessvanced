export namespace Config{
    export const STOCKFISH_MOVETIME=1000;
    export enum MOVE_TYPE {
        MOVE_REGULAR,
        MOVE_CAPTURE,
        MOVE_CHECK,
        MOVE_MATE,
        LEVY_THEROOK,
        MOVE_NONE,
        
    };
    export enum TILE_COLORS {
        ACTIVE,
        INACTIVE
    };
    export enum ANALYSIS_FOR{
        WHITE,
        BLACK, 
        BOTH
    }
    export const MOVE_NAMES=[
        "Brilliant", "Great Move", "Best Move", "Mistake", "Blunder"
    ]
    export const MOVE_TO_ID_NAME={
        "Brilliant":"brilliant-color",
        "Great Move":"great-color",
        "Best Move":"best-color",
        "Mistake":"mistake-color",
        "Blunder":"blunder-color"
    }
    export const ID_NAME_TO_MOVE_RATING = {
        "brilliant-color": "brilliant",
        "great-color": "great",
        "best-color": "best",
        "mistake-color":"mistake",
        "blunder-color":"blunder"
    };
    export const MOVE_RATING_TO_ID_NAME = {
        "brilliant": "brilliant-color",
        "great": "great-color",
        "best": "best-color",
        "mistake":"mistake-color",
        "blunder":"blunder-color",

    };
    
    export const Colors = {
        "brilliant":"rgba(15, 255, 243, 1)",
        "great":"rgba(107, 111, 229, 1)",
        "best" : "gray",
        "good" :"gray",
        "gray" : "gray",
        "inaccuracy" : "gray",
        "mistake" : "yellow",
        "blunder" : "red",
    }
    export const CssDictForTiles={
        "brilliant":"brilliant_tile",
        "great":"great_tile",
        "best" : "yellow_tile",
        "good" : "yellow_tile",
        "gray" : "yellow_tile",
        "inaccuracy" : "yellow_tile",
        "mistake" : "mistake_tile",
        "blunder" : "mistake_tile",
    }
    export const pointSizes={
        "brilliant":3,
        "great":3,
        "best" : 1,
        "good" : 1,
        "gray" : 1,
        "mistake" : 1,
        "inaccuracy" : 1,
        "blunder" : 1,
    }
    
    export enum PROMOTION {
        QUEEN,
        ROOK,
        BISHOP,
        KNIGHT,
    };
    export const PROMOTION_TO_CHAR : { [key: number]: string } = {
        0:"q",
        1:"r",
        2:"n",
        3:"b"
    };
    export const PROMOTION_CHAR_TO_IMAGE_URL = {
        "q":"/img/chesspieces/wikipedia/bQ.png",
        "r":"/img/chesspieces/wikipedia/bR.png",
        "n":"/img/chesspieces/wikipedia/bN.png",
        "b":"/img/chesspieces/wikipedia/bB.png",
    };
    
    
}