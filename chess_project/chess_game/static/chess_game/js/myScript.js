function myFunction() {
    document.getElementById("demo").innerHTML = "Paragraph changed.";
  }

async function sanitizeFen(fen) {
    const parts = fen.split(" ");
    parts[3] = "-";  // zero out en passant square
    return parts.join(" ");
}

async function callChessApi(fen) {
    fen = await sanitizeFen(fen);
    console.log(`Sending FEN: ${fen}`);

    const response = await fetch("https://chess-api.com/v1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fen })
    });

    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

    const data = await response.json();
    console.log(`Best move: ${data.move} | Eval: ${data.eval}`);
    return data;
}

// Usage:
// callChessApi("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1")
//     .then(data => {
//         const bestMove = data.move;   // e.g. "e7e5"
//         const fromSq   = data.from;   // "e7"
//         const toSq     = data.to;     // "e5"
//     });