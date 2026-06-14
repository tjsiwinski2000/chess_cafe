from django.shortcuts import render
import requests
from django.http import JsonResponse
from django.views.decorators.http import require_POST
import json
STOCKFISH_API_URL = "http://54.89.162.116:8000/best-move"
STOCKFISH_API_KEY = "your-strong-secret-key"  # or load from env

# Create your views here.
def index(request):
    return render(request,'chess_game/index.html')

@require_POST
def best_move(request):
    data = json.loads(request.body)
    response = requests.post(
        STOCKFISH_API_URL,
        headers={"X-API-Key": STOCKFISH_API_KEY},
        json={
            "fen": data["fen"],
            "difficulty": data.get("difficulty", "intermediate")
        }
    )
    return JsonResponse(response.json(), status=response.status_code)