const canvas = document.getElementById("sandbox");
const ctx = canvas.getContext("2d");

const INITIAL_HUE = 200; // Start hue value at 200
const HUE_STEP = 0.5; // Smaller increment for slower hue change
const BLOCK_SIZE = 3; // 3-by-3 block of sand
const DROP_CHANCE = 0.75; // 75% chance to drop sand on each cell

// Canvas dimensions
const width = 600; // Desired width
const height = 600; // Desired height
canvas.width = width;
canvas.height = height;
canvas.style.width = `${width}px`;
canvas.style.height = `${height}px`;

// Grid settings
const cellSize = 8; // Cell size
const cols = Math.floor(width / cellSize); // Number of columns
const rows = Math.floor(height / cellSize); // Number of rows

// Create a 2D array to represent the grid (0 means empty)
// When not empty, the cell will hold the hue value.
const grid = Array.from({ length: rows }, () => Array(cols).fill(0));

let currentSandHue = INITIAL_HUE; // Global hue that increments for each new sand block

// Function to draw the grid and particles
function drawGrid() {
  ctx.clearRect(0, 0, width, height);

  // Draw sand particles
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] !== 0) {
        const hue = grid[y][x] % 360;
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }

  // Draw grid lines
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 0.5;
  for (let y = 0; y <= rows; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * cellSize);
    ctx.lineTo(width, y * cellSize);
    ctx.stroke();
  }
  for (let x = 0; x <= cols; x++) {
    ctx.beginPath();
    ctx.moveTo(x * cellSize, 0);
    ctx.lineTo(x * cellSize, height);
    ctx.stroke();
  }
}

// Function to update the grid (apply gravity to sand particles)
function updateGrid() {
  for (let y = rows - 1; y >= 0; y--) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] !== 0) {
        // Move particle downwards if cell below is empty
        if (y + 1 < rows && grid[y + 1][x] === 0) {
          grid[y + 1][x] = grid[y][x];
          grid[y][x] = 0;
        } else {
          // Try moving diagonally
          const directions = [x - 1, x + 1];
          const randomDirection =
            directions[Math.floor(Math.random() * directions.length)];

          if (
            randomDirection >= 0 &&
            randomDirection < cols &&
            y + 1 < rows &&
            grid[y + 1][randomDirection] === 0
          ) {
            grid[y + 1][randomDirection] = grid[y][x];
            grid[y][x] = 0;
          }
        }
      }
    }
  }
}

// Function to initialize mouse event listeners
function initListeners() {
  let isMouseDown = false;
  let intervalId = null;

  canvas.addEventListener("mousedown", (e) => {
    isMouseDown = true;
    placeSandBlock(e);
    intervalId = setInterval(() => {
      if (isMouseDown) {
        placeSandBlock(e);
      }
    }, 50);
  });

  canvas.addEventListener("mousemove", (e) => {
    if (isMouseDown) {
      placeSandBlock(e);
      clearInterval(intervalId);
    }
  });

  canvas.addEventListener("mouseup", () => {
    isMouseDown = false;
    clearInterval(intervalId);
  });

  canvas.addEventListener("mouseleave", () => {
    isMouseDown = false;
    clearInterval(intervalId);
  });

  // Place a 3x3 block of sand with a 75% chance per cell
  function placeSandBlock(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const x = Math.floor(mouseX / cellSize);
    const y = Math.floor(mouseY / cellSize);

    // Center the block at the click position by adjusting starting coordinates
    const startX = x - Math.floor(BLOCK_SIZE / 2);
    const startY = y - Math.floor(BLOCK_SIZE / 2);

    for (let j = 0; j < BLOCK_SIZE; j++) {
      for (let i = 0; i < BLOCK_SIZE; i++) {
        const gridX = startX + i;
        const gridY = startY + j;
        if (
          gridX >= 0 &&
          gridX < cols &&
          gridY >= 0 &&
          gridY < rows &&
          Math.random() < DROP_CHANCE
        ) {
          grid[gridY][gridX] = currentSandHue;
        }
      }
    }

    // Increment the hue after placing the block
    currentSandHue = (currentSandHue + HUE_STEP) % 360;
  }
}

// Simulation loop
function loop() {
  updateGrid();
  drawGrid();
  requestAnimationFrame(loop);
}

initListeners();
loop();
