import requests

response = requests.post(
    "http://54.208.50.62:8000/best-move",
    headers={"X-API-Key": "your-strong-secret-key"},
    json={
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
        "difficulty": "intermediate"
    }
)
print(response.status_code)
print(response.json())