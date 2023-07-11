const pgn_string_white=`[Event "Live Chess"]
[Site "Chess.com"]
[Date "2023.06.22"]
[Round "?"]
[White "urke-37"]
[Black "Selow234"]
[Result "1-0"]
[ECO "B01"]
[WhiteElo "1641"]
[BlackElo "1615"]
[TimeControl "900+10"]
[EndTime "3:52:00 PDT"]
[Termination "urke-37 won by resignation"]

1. e4 d5 2. exd5 Qxd5 3. Nc3 Qa5 4. d3 c6 5. Bd2 Nf6 6. h3 e5 7. Qe2 Be6 8. Nf3
Bd6 9. Ne4 Nxe4 10. Bxa5 b6 11. Qxe4 1-0 `

const pgn_string_black=`[Event "Live Chess"]
[Site "Chess.com"]
[Date "2023.06.23"]
[Round "-"]
[White "Crini"]
[Black "urke-37"]
[Result "1-0"]
[CurrentPosition "1k1r3r/pbq2p2/1p2pn2/3p2B1/3P2Pp/1P3Pb1/P3P1B1/RN1Q2KR b - -"]
[Timezone "UTC"]
[ECO "D02"]
[ECOUrl "https://www.chess.com/openings/Queens-Pawn-Opening-Zukertort-Variation-2...e6"]
[UTCDate "2023.06.23"]
[UTCTime "18:09:59"]
[WhiteElo "990"]
[BlackElo "984"]
[TimeControl "300"]
[Termination "Crini won - game abandoned"]
[StartTime "18:09:59"]
[EndDate "2023.06.23"]
[EndTime "18:13:08"]
[Link "https://www.chess.com/game/live/81282779099"]
[WhiteUrl "https://images.chesscomfiles.com/uploads/v1/user/81810616.9a654fcf.50x50o.78c147cfe4d2.jpeg"]
[WhiteCountry "2"]
[WhiteTitle ""]
[BlackUrl "https://images.chesscomfiles.com/uploads/v1/user/49908860.6e139a99.50x50o.906cfd1f5469.jpeg"]
[BlackCountry "231"]
[BlackTitle ""]

1. d4 d5 2. Nf3 e6 3. b3 c5 4. Bb2 cxd4 5. Bxd4 Nc6 6. Bb2 Nf6 7. g3 b6 8. Bg2
Bb7 9. O-O Bb4 10. c3 Bd6 11. Nd4 Nxd4 12. cxd4 h5 13. f3 h4 14. g4 Qc7 15. Kf2
Bxh2 16. Rh1 Bg3+ 17. Kg1 g5 18. Bc3 O-O-O 19. Bd2 Kb8 20. Bxg5 $6 {<br /><br
/>Game may have continued...} (20. Bxg5 Nxg4 21. fxg4 Rdg8 22. Bd2 Rxg4 23. Qf1
Rhg8 24. Nc3 {-3.30}) 1-0`

const pgn_string_1=pgn_string_black;

// const pgn_string_1=`[Event "Live Chess"]
// [Site "Chess.com"]
// [Date "2023.06.22"]
// [Round "?"]
// [White "urke-37"]
// [Black "Selow234"]
// [Result "1-0"]
// [ECO "B01"]
// [WhiteElo "1641"]
// [BlackElo "1615"]
// [TimeControl "900+10"]
// [EndTime "3:52:00 PDT"]
// [Termination "urke-37 won by resignation"]

// 1. e4 d5 2. exd5 Qxd5 3. Nc3 Qa5 4. d3 c6 5. Bd2 Nf6 6. h3 e5 7. Qe2 Be6 8. Nf3
// Bd6 9. Ne4 Nxe4 10. Bxa5 b6 11. Qxe4 Bd5 12. Qe3 bxa5 13. Nxe5 O-O 14. d4 Nd7
// 15. c4 Bb4+ 16. Kd1 Be6 17. Nxd7 Bxd7 18. a3 Rfe8 19. axb4 Rxe3 20. fxe3 axb4
// 21. c5 a5 22. Bc4 a4 23. Rf1 Be6 24. Bxe6 fxe6 25. Kc2 a3 26. bxa3 bxa3 27. Rfb1
// a2 28. Rb2 Ra3 29. Kd2 1-0`
const fen_string_1 = "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2";

export{pgn_string_1, fen_string_1};
