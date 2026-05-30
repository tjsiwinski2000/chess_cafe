//0528-2026 getting moves from chess-api
async function callChessApi(fen) {
    fen = await sanitizeFen(fen);
    console.log(`Sending FEN: ${fen}`);

    const response = await fetch("https://chess-api.com/v1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fen })
    });
    console.log(`sent ${fen}`)
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

    const data = await response.json();
    console.log(`Best move: ${data.move} | Eval: ${data.eval}`);
    
    //Apply the move to chess.js
    game.move({ from: data.from, to: data.to, promotion: 'q' })

   // Sync the board
   board1.position(game.fen());

   // Fun idea call API at this point to play against itself.
  setTimeout(() => {
  callChessApi(game.fen());
  }, 200); // slight delay feels more natural -->

  return data;
}


//0528-2026 2:00pm STASH JS
<script>
        var game = new Chess()
      
        function onDrop(source, target) {
          var move = game.move({
            from: source,
            to: target,
            promotion: 'q'
          })
      
          if (move === null) return 'snapback'
      
          
        }
      
        function onSnapEnd() {
          const fen = game.fen();
          board1.position(fen);
          document.getElementById("fen-output").textContent = fen;
          callChessApi(fen);
      }

        var board1 = Chessboard('board1', {
          position: 'start',
          draggable: true,
          pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
          onDrop: onDrop,
          onSnapEnd: onSnapEnd
        })
      
        async function sanitizeFen(fen) {
          fen = String(fen)
          const parts = fen.split(" ");
          parts[3] = "-";  // zero out en passant square
          return parts.join(" ");
      }
      
      async function getBestMove(fen, difficulty = "intermediate") {
        const response = await fetch("/best-move/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fen, difficulty })
        });
        const data = await response.json();
        return data.move; // adjust to match your API's response shape
      }
      
      

        $('#startBtn').on('click', board1.start)
        $('#clearBtn').on('click', board1.clear)
    </script>