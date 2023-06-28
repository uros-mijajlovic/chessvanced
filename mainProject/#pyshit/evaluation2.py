import chess
import chess.engine

def get_evaluation(fen_position):
    engine = chess.engine.SimpleEngine.popen_uci("C:/Users/uros/Desktop/ChessKiller/mainProject/#pyshit/stockfish.exe")  # Replace "path/to/stockfish" with the actual path to the Stockfish executable
    board = chess.Board(fen_position)
    result = engine.play(board, chess.engine.Limit(time=2))  # Set a time limit for the engine's evaluation
    engine.quit()
    print(result.info)
    return result.info["score"].relative.score(mate_score=10000)

def evaluate_moves(fen_position):
    board = chess.Board(fen_position)
    legal_moves = list(board.legal_moves)

    evaluations = {}
    for move in legal_moves:
        board.push(move)
        evaluation = get_evaluation(board.fen())
        board.pop()
        evaluations[move.uci()] = evaluation

    return evaluations

fen_position = "r1bqkb1r/ppp2ppp/2n2n2/3p4/3P4/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 0 1"
move_evaluations = evaluate_moves(fen_position)
best_move = max(move_evaluations, key=move_evaluations.get)
print("Best move:", best_move)
print("Evaluation:", move_evaluations[best_move])
print("Move evaluations:", move_evaluations)
