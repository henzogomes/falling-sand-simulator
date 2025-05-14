# Falling Sand Simulator

A browser-based physics simulator that models the behavior of particles like sand and water in a cellular automaton.

<img src="simulation.gif" alt="Simulation in action" width="40%">

## Overview

This falling sand simulator creates a dynamic, interactive environment where particles follow simple physics rules:

- **Sand**: Falls downward with gravity and forms piles
- **Water**: Flows downward and spreads horizontally

## Features

- Interactive canvas where you can place particles
- Left-click to place sand particles
- Right-click to place water particles
- Realistic particle physics simulation
- Grid-based cellular automaton system

## How It Works

The simulation works on a grid system where each cell can contain a particle type (empty, sand, or water). The physics engine updates each frame by:

1. Iterating through each cell from bottom to top (to prevent particles from "skipping" spaces)
2. Applying movement rules based on particle type:
   - Sand falls directly downward if possible, or diagonally if blocked
   - Water falls downward, then attempts to flow horizontally
3. Rendering the updated grid state to the canvas

## Usage

Open `index.html` in a modern web browser to start the simulation. No additional dependencies or installation required.

### Controls

- **Left mouse button**: Place sand particles
- **Right mouse button**: Place water particles
- Hold and drag to continuously place particles

## Technical Details

- Pure vanilla JavaScript implementation
- HTML5 Canvas for rendering
- No external libraries or dependencies
- Cellular automaton approach for particle simulation
- Configurable parameters for block size, cell size, and particle behavior

## Future Enhancements

Potential features that could be added:

- More particle types (stone, oil, fire, etc.)
- Particle interactions (water + sand = mud)
- UI controls for adjusting simulation parameters
- Save/load simulation states
