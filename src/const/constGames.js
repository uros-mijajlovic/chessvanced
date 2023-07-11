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
[Date "2023.06.29"]
[Round "-"]
[White "Raimrai"]
[Black "urke-37"]
[Result "0-1"]
[CurrentPosition "r6k/ppp3pp/2np4/1q6/8/2P5/PP3P1R/5RK1 w - -"]
[Timezone "UTC"]
[ECO "C44"]
[ECOUrl "https://www.chess.com/openings/Ponziani-Opening-3...d6"]
[UTCDate "2023.06.29"]
[UTCTime "11:06:51"]
[WhiteElo "1691"]
[BlackElo "1638"]
[TimeControl "900+10"]
[Termination "urke-37 won by resignation"]
[StartTime "11:06:51"]
[EndDate "2023.06.29"]
[EndTime "11:34:48"]
[Link "https://www.chess.com/game/live/81775983589"]
[WhiteUrl "https://www.chess.com/bundles/web/images/noavatar_l.84a92436.gif"]
[WhiteCountry "158"]
[WhiteTitle ""]
[BlackUrl "https://images.chesscomfiles.com/uploads/v1/user/49908860.6e139a99.50x50o.906cfd1f5469.jpeg"]
[BlackCountry "231"]
[BlackTitle ""]

1. e4 e5 2. Nf3 Nc6 3. c3 d6 4. h3 $6 f5 5. d3 $2 Be7 $6 6. Na3 $6 Nf6 7. Bg5 $2 fxe4
8. Bxf6 $6 Bxf6 $9 9. dxe4 O-O 10. Be2 Qe8 11. O-O $6 Qg6 12. Kh2 $6 Qxe4 13. Qd2
Qg6 14. Nb5 e4 15. Bc4+ $6 Kh8 16. Ne1 $6 Be5+ 17. Kh1 $6 Qh5 $2 18. Be2 $6 Qh4 19.
Qe3 $6 Bf4 20. Qxe4 Bxh3 $3 21. Nf3 Bxg2+ 22. Kxg2 Qg4+ $1 23. Kh1 Rf6 $6 24. Nh2 Qh4
25. Qg2 Rg6 26. Rg1 Rxg2 27. Rxg2 Bxh2 28. Rxh2 Qe4+ 29. Kg1 $6 Qxe2 30. Rf1 Qxb5
{<br /><br />Game may have continued...} (30... Qxb5 31. Re1 Qg5+ 32. Rg2 Qxg2+
33. Kxg2 g5 34. Kg3 Ne5 {-6.29}) 0-1`

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
