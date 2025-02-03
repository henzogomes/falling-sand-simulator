const canvas = document.getElementById("sandbox");
const ctx = canvas.getContext("2d");

const BLOCK_SIZE = 3; // 3x3 block
const DROP_CHANCE = 0.75; // 75% chance to drop a particle per cell

// Particle types
const EMPTY = "empty";
const SAND = "sand";
const WATER = "water";

// Fixed color for sand (yellow)
const SAND_COLOR = "yellow";

// Canvas dimensions
const width = 600;
const height = 600;
canvas.width = width;
canvas.height = height;
canvas.style.width = `${width}px`;
canvas.style.height = `${height}px`;

// Grid settings
const cellSize = 8;
const cols = Math.floor(width / cellSize);
const rows = Math.floor(height / cellSize);

// Initialize grid: each cell is an object with a type property.
const grid = Array.from({ length: rows }, () =>
  Array.from({ length: cols }, () => ({ type: EMPTY }))
);

let currentParticleType = null;
let intervalId = null;

// Draw the grid and particles
function drawGrid() {
  ctx.clearRect(0, 0, width, height);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cell = grid[y][x];
      if (cell.type !== EMPTY) {
        if (cell.type === SAND) {
          ctx.fillStyle = SAND_COLOR;
        } else if (cell.type === WATER) {
          ctx.fillStyle = "rgba(0, 150, 255, 0.7)";
        }
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }
  // Draw grid lines (optional)
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

/**
 * Attempts to move a particle at (x, y) into (targetX, targetY) if that cell is EMPTY.
 * Returns true if movement happened.
 */
function tryMove(x, y, targetX, targetY) {
  // Check bounds.
  if (targetX < 0 || targetX >= cols || targetY < 0 || targetY >= rows) {
    return false;
  }
  // If the target cell is not empty, we cannot move.
  if (grid[targetY][targetX].type !== EMPTY) {
    return false;
  }
  // For lateral moves (targetY === y), introduce a probability gate.
  // Adjust the chance (0.5 here) to suit your simulation.
  if (targetY === y) {
    if (Math.random() >= 0.5) {
      return false;
    }
  }
  // If we reach here, the move is allowed.
  grid[targetY][targetX] = { ...grid[y][x] };
  grid[y][x] = { type: EMPTY };
  return true;
}

/**
 * Update logic for a sand particle at (x, y).
 */
function updateSand(x, y) {
  // Try falling directly
  if (tryMove(x, y, x, y + 1)) return;
  // If not working, try falling diagonally (choose a random order)
  const diagDirections = [x - 1, x + 1];
  // Randomize the diagonal order
  diagDirections.sort(() => Math.random() - 0.5);
  for (const newX of diagDirections) {
    if (tryMove(x, y, newX, y + 1)) return;
  }
}

/**
 * Update logic for a water particle at (x, y).
 */
function updateWater(x, y) {
  // Try falling directly first.
  if (tryMove(x, y, x, y + 1)) return;

  // Create an array for lateral movement [left, right] and shuffle it.
  const lateralDirs = [x - 1, x + 1].sort(() => Math.random() - 0.5);

  for (const newX of lateralDirs) {
    if (tryMove(x, y, newX, y)) return;
  }
}

/**
 * Main updateGrid loop, which scans the grid from bottom to top.
 */
function updateGrid() {
  for (let y = rows - 1; y >= 0; y--) {
    for (let x = 0; x < cols; x++) {
      const cell = grid[y][x];
      if (cell.type === SAND) {
        updateSand(x, y);
      } else if (cell.type === WATER) {
        updateWater(x, y);
      }
    }
  }
}

// Place a 3x3 block of the given particle type at the mouse location.
function placeBlock(e, particleType) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  const x = Math.floor(mouseX / cellSize);
  const y = Math.floor(mouseY / cellSize);
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
        grid[gridY][gridX] = { type: particleType };
      }
    }
  }
}

// Set up event listeners
function initListeners() {
  let isMouseDown = false;
  canvas.addEventListener("mousedown", (e) => {
    e.preventDefault();
    isMouseDown = true;
    currentParticleType = e.button === 0 ? SAND : e.button === 2 ? WATER : null;
    if (currentParticleType) {
      placeBlock(e, currentParticleType);
      intervalId = setInterval(() => {
        placeBlock(e, currentParticleType);
      }, 50);
    }
  });
  canvas.addEventListener("mousemove", (e) => {
    if (isMouseDown && currentParticleType) {
      clearInterval(intervalId);
      placeBlock(e, currentParticleType);
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
  canvas.addEventListener("contextmenu", (e) => e.preventDefault());
}

// Main simulation loop
function loop() {
  updateGrid();
  drawGrid();
  requestAnimationFrame(loop);
}

initListeners();
loop();
