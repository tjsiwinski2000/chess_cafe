# 0526-2026
# tested successfully TJS
base_fen = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"

import json 
import requests

def sanitize_fen(fen: str) -> str:
    parts = fen.split(" ")
    parts[3] = "-"  # zero out en passant square
    return " ".join(parts)
    
def call_chess_api(base_fen):
    print(f"argument passed {base_fen}")

    base_fen = sanitize_fen(base_fen)
    parameters = {
    "fen": base_fen
    }
    
    print(parameters)
  
    chess_url = "https://chess-api.com/v1"
    response = requests.post(url=chess_url, json=parameters)
    response.raise_for_status()
    data = response.json()
    #Next_move=data["continuationArr"][0]
    #print(data["continuationArr"])
    print(data)

# call_chess_api(base_fen='rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1')