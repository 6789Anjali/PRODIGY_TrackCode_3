const boxes = document.querySelectorAll(".box");
const resetBtn = document.querySelector("#reset-btn");
const newGameBtn = document.querySelector("#new-btn");
const msgContainer = document.querySelector(".msg-container");
const msg = document.querySelector("#msg");
const modeContainer = document.querySelector(".mode-container");
const humanBtn = document.querySelector("#human-btn");
const aiBtn = document.querySelector("#ai-btn");

let isVsAI = false; // Flag for AI mode
let turnO = true; // true if it's "O"'s turn, false if it's "X"'s turn
let count = 0; // To track for a draw

const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Select opponent (Human or AI)
humanBtn.addEventListener("click", () => {
  isVsAI = false;
  modeContainer.classList.add("hide");
});

aiBtn.addEventListener("click", () => {
  isVsAI = true;
  modeContainer.classList.add("hide");
});

// Reset game function
const resetGame = () => {
  turnO = true;
  count = 0;
  enableBoxes();
  msgContainer.classList.add("hide");
  modeContainer.classList.remove("hide"); // Show the mode selection at reset
};

// Event listener for each box
boxes.forEach((box, index) => {
  box.addEventListener("click", () => {
    if (box.innerText === "" && turnO) {
      box.innerText = "O";
      box.disabled = true;
      count++;

      if (checkWinner("O")) {
        showWinner("O");
      } else if (count === 9) {
        gameDraw();
      } else {
        turnO = false; // Switch to "X"'s turn in human mode
        if (isVsAI) {
          setTimeout(aiMove, 500); // AI takes the next move if in AI mode
        }
      }
    } else if (box.innerText === "" && !turnO && !isVsAI) { // "X"'s turn in Human vs Human mode
      box.innerText = "X";
      box.disabled = true;
      count++;

      if (checkWinner("X")) {
        showWinner("X");
      } else if (count === 9) {
        gameDraw();
      } else {
        turnO = true; // Switch back to "O"'s turn
      }
    }
  });
});

// AI move function with imperfections for Human vs AI mode
const aiMove = () => {
  let bestScore = -Infinity;
  let bestMove = null;

  // Adding randomness to make AI imperfect
  const randomFactor = Math.random();
  const useMinimax = randomFactor > 0.3; // 70% chance to use minimax, 30% chance for a random move

  if (useMinimax) {
    boxes.forEach((box, index) => {
      if (box.innerText === "") {
        box.innerText = "X"; // AI plays "X"
        count++;
        let score = minimax(false);
        box.innerText = ""; // Undo move
        count--;

        if (score > bestScore) {
          bestScore = score;
          bestMove = index;
        }
      }
    });
  } else {
    const availableMoves = Array.from(boxes).map((box, index) => box.innerText === "" ? index : null).filter(index => index !== null);
    bestMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  if (bestMove !== null) {
    boxes[bestMove].innerText = "X";
    boxes[bestMove].disabled = true;
    count++;

    if (checkWinner("X")) {
      showWinner("X");
    } else if (count === 9) {
      gameDraw();
    } else {
      turnO = true; // Switch back to human's turn
    }
  }
};

// Minimax algorithm for the AI
const minimax = (isMaximizing) => {
  if (checkWinner("X")) return 1;
  if (checkWinner("O")) return -1;
  if (count === 9) return 0;

  let bestScore = isMaximizing ? -Infinity : Infinity;

  boxes.forEach((box) => {
    if (box.innerText === "") {
      box.innerText = isMaximizing ? "X" : "O";
      count++;

      let score = minimax(!isMaximizing);

      box.innerText = ""; // Undo move
      count--;

      if (isMaximizing) {
        bestScore = Math.max(score, bestScore);
      } else {
        bestScore = Math.min(score, bestScore);
      }
    }
  });

  return bestScore;
};

// Show draw message
const gameDraw = () => {
  msg.innerText = "Game was a Draw.";
  msgContainer.classList.remove("hide");
  disableBoxes();
};

// Disable all boxes after game ends
const disableBoxes = () => {
  boxes.forEach((box) => (box.disabled = true));
};

// Enable boxes for a new game
const enableBoxes = () => {
  boxes.forEach((box) => {
    box.disabled = false;
    box.innerText = "";
  });
};

// Show winner message
const showWinner = (winner) => {
  msg.innerText = `Congratulations, Winner is ${winner}`;
  msgContainer.classList.remove("hide");
  disableBoxes();
};

// Check if there's a winner
const checkWinner = (player) => {
  return winPatterns.some((pattern) => {
    const [a, b, c] = pattern;
    return boxes[a].innerText === player &&
           boxes[b].innerText === player &&
           boxes[c].innerText === player;
  });
};

// Event listeners for reset and new game buttons
resetBtn.addEventListener("click", resetGame);
newGameBtn.addEventListener("click", resetGame);

// Start with the mode selection popup
modeContainer.classList.remove("hide");
