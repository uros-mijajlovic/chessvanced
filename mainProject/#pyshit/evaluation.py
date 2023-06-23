from stockfish import Stockfish
import chess.pgn
import matplotlib.pyplot as plt

def draw_line(points):
    x = range(len(points))
    y = points

    plt.plot(x, y, marker='o')
    plt.plot(x, y, 'k-')

    plt.xlabel('X')
    plt.ylabel('Y')
    plt.title('Line Plot')
    plt.grid(True)
    plt.show()


stockfish = Stockfish(path="C:/Users/uros/Desktop/ChessKiller/stockfish_15.1_win_x64_avx2/stockfish")

stockfish.set_depth(8)




pgn = open("game2.pgn")
mygame=chess.pgn.read_game(pgn)
points=[]
while mygame.next():
    mygame=mygame.next()
    stockfish.set_fen_position(mygame.board().fen())
    print(stockfish.get_best_move())
    eval=stockfish.get_evaluation()
    print(eval)
    points.append(eval['value'])
    print(mygame.board().fen())

print(points)
draw_line(points)