/**
 * Number puzzle game
 */

import { Stopwatch } from './classes/Stopwatch';

// Enums
enum Edge {
    Top = 'top',
    Right = 'right',
    Bottom = 'bottom',
    Left = 'left'
}

// Constants
const NUM_RANDOM_ITERATIONS: number = 2000;
const DISPLAY_CLASS: string = 'display-none';

// Variables
let gridSize: number = 4;
let numTiles: number = 16;
let grid: HTMLDivElement;
let hud: HTMLDivElement;
let overlay: HTMLDivElement;
let headingContainer: HTMLDivElement;
let actionButton: HTMLButtonElement;
let tiles: HTMLDivElement[] = [];
let blankIndex: number = numTiles - 1;
let optionsContainer: HTMLDivElement;
let optionButtons: HTMLButtonElement[] = [];
let movesDisplay: HTMLDivElement;
let numMoves: number = 0;
let win: HTMLDivElement;
let timer: Stopwatch;
let timerDisplay: HTMLDivElement;

/**
 * Sets up the grid and tiles
 * @returns void
 */
function setupGrid(): void {
    removeTiles();

    for (let i: number = 0; i < numTiles; i++) {
        const tile: HTMLDivElement = document.createElement('div') as HTMLDivElement;
        tile.classList.add('tile');
        tile.classList.add(`tile-${gridSize}`);
        tile.dataset.titleId = i.toString();
        grid.appendChild(tile);
        tiles.push(tile);
    }

    resetGrid();
}

/**
 * Removes all tiles from the grid
 * @returns void
 */
function removeTiles(): void {
    tiles.forEach((tile) => grid.removeChild(tile));
    tiles = [];
}

/**
 * Resets the grid to the solved state before randomizing
 * @returns void
 */
function resetGrid(): void {
    for (let i: number = 0; i < numTiles - 1; i++) {
        setTileValue(i, i + 1);
    }

    setTileBlank(numTiles - 1);
    randomizeGrid();
    overlay.classList.add(DISPLAY_CLASS);
    headingContainer.classList.add(DISPLAY_CLASS);
    actionButton.innerText = 'Reset';
    numMoves = 0;
    movesDisplay.classList.remove(DISPLAY_CLASS);
    timerDisplay.classList.remove(DISPLAY_CLASS);
    updateMovesDisplay();
    timer.start();
}

/**
 * Randomizes the grid
 * @returns void
 
 */
function randomizeGrid(): void {
    for (let i: number = 0; i < NUM_RANDOM_ITERATIONS; i++) {
        randomMove();
    }
}

/**
 * Makes a random move with a tile adjacent to the blank tile
 * @returns void
 */
function randomMove(): void {
    const adjacentTiles: number[] = adjacentToBlank();
    const randomIndex: number = Math.floor(Math.random() * adjacentTiles.length);
    swapTileWithBlank(adjacentTiles[randomIndex]);
}

/**
 * Returns an array of tile indices Adjacent  to the blank tile
 * @returns number[]
 */
function adjacentToBlank(): number[] {
    const adjacentTiles: number[] = [];

    if (!isEdgeTile(blankIndex, Edge.Right)) adjacentTiles.push(blankIndex + 1);
    if (!isEdgeTile(blankIndex, Edge.Bottom)) adjacentTiles.push(blankIndex + gridSize);
    if (!isEdgeTile(blankIndex, Edge.Left)) adjacentTiles.push(blankIndex - 1);
    if (!isEdgeTile(blankIndex, Edge.Top)) adjacentTiles.push(blankIndex - gridSize);

    return adjacentTiles;
}

/**
 * Sets the value of a tile
 * @param tileId - The index of the tile
 * @param value - The value to set
 * @returns void
 */
function setTileValue(tileId: number, value: number): void {
    tiles[tileId].innerText = value.toString();
    tiles[tileId].classList.remove('dark', 'light', 'blank');
    tiles[tileId].classList.add(value % 2 ? 'light' : 'dark');
}

/**
 * Sets a tile to blank
 * @param tileId - The index of the tile
 * @returns void
 */
function setTileBlank(tileId: number): void {
    tiles[tileId].innerText = '';
    tiles[tileId].classList.remove('dark', 'light');
    tiles[tileId].classList.add('blank');
    blankIndex = tileId;
}

/**
 * Returns true if the tile is on the edge
 * @param tileId - The index of the tile
 * @param edge - The edge to check
 * @returns boolean
 */
function isEdgeTile(tileId: number, edge: Edge): boolean {
    if (edge === Edge.Right) return tileId % gridSize === gridSize - 1;
    if (edge === Edge.Bottom) return tileId + gridSize >= numTiles;
    if (edge === Edge.Left) return tileId % gridSize === 0;
    if (edge === Edge.Top) return tileId - gridSize < 0;

    return false;
}

/**
 * Attempts to move tile(s)
 * @param tileId - The index of the tile that was clicked by user
 * @returns void
 */
function tryMoveTiles(tileId: number): void {
    if (tileId === blankIndex) return;

    let increment: number = incrementAmount(tileId);
    if (increment === 0) return;

    while (blankIndex !== tileId) {
        swapTileWithBlank(blankIndex + increment);
    }

    numMoves++;
    updateMovesDisplay();
    if (checkWin()) showWinScreen();
}


/**
 * Returns the amount to increment the blank tile each step until it reaches the target tile
 * @param tileId - The index of the tile
 * @returns number
 */
function incrementAmount(tileId: number): number {
    if (tileId % gridSize === blankIndex % gridSize) {
        // Blank is in same column
        return tileId < blankIndex ? -gridSize : gridSize;
    }

    if (Math.floor(tileId / gridSize) === Math.floor(blankIndex / gridSize)) {
        // Blank is in same row
        return tileId < blankIndex ? -1 : 1;
    }

    return 0;
}

/**
 * Swaps the tile with the blank tile
 * @param index - The index of the tile
 * @returns void
 */
function swapTileWithBlank(index: number): void {
    setTileValue(blankIndex, parseInt(tiles[index].innerText));
    setTileBlank(index);
}

/**
 * Sets the grid size
 * @param size - The size of the grid
 * @returns void
 */
function setGridSize(size: number): void {
    gridSize = size;
    numTiles = size * size;
}

/**
 * Checks if the puzzle is in the win state
 * @returns boolean
 */
function checkWin(): boolean {
    for (let i: number = 0; i < numTiles - 1; i++) {
        if (parseInt(tiles[i].innerText) !== i + 1) return false;
    }

    return true;
}

/**
 * Shows the win screen
 * @returns void
 */
function showWinScreen(): void {
    win.classList.remove(DISPLAY_CLASS);
    optionsContainer.classList.add(DISPLAY_CLASS);
    overlay.classList.remove('overlay-solid', DISPLAY_CLASS);
    overlay.classList.add('overlay-transparent');
    actionButton.innerText = 'Play again';
    timer.stop();
}

/**
 * Updates the number of moves taken display
 * @returns void
 */
function updateMovesDisplay(): void {
    movesDisplay.innerText = `Moves: ${numMoves}`;
}

/**
 * Shows the options screen
 * @returns void
 */
function showOptions(): void {
    overlay.classList.remove('overlay-transparent');
    overlay.classList.add('overlay-solid');
    headingContainer.classList.remove(DISPLAY_CLASS)
    win.classList.add(DISPLAY_CLASS);
    optionsContainer.classList.remove(DISPLAY_CLASS);
    actionButton.innerText = 'Start';
    movesDisplay.classList.add(DISPLAY_CLASS);
    timerDisplay.classList.add(DISPLAY_CLASS);
}

/**
 * Creates the DOM elements
 * @param app - The app element
 * @returns void
 */
function createElements(app: HTMLDivElement): void {
    // Create the grid elements
    grid = document.createElement('div');
    grid.classList.add('grid');
    app.appendChild(grid);

    // Create overlay
    overlay = document.createElement('div');
    overlay.classList.add('overlay', 'overlay-solid');
    grid.appendChild(overlay);

    // Heading container
    headingContainer = document.createElement('div');
    headingContainer.classList.add('heading-container');
    headingContainer.innerHTML = '<h1>Number Puzzle</h1>';
    overlay.appendChild(headingContainer);

    // Create options container and buttons
    optionsContainer = document.createElement('div');
    optionsContainer.classList.add('options-container');
    overlay.appendChild(optionsContainer);
    optionsContainer.innerHTML = '<h2>Select grid size:</h2>';

    const gridSizeOptions: string[] = ['Small 4x4', 'Medium 6x6', 'large 8x8'];
    const gridSizes: number[] = [4, 6, 8];
    gridSizeOptions.forEach((label: string, index: number) => {
        const optionButton = document.createElement('button');
        optionButton.innerText = label;
        optionButton.classList.add('btn-option');
        optionButton.dataset.optionId = gridSizes[index].toString();
        if (index === 0) optionButton.classList.add('active');
        optionsContainer.appendChild(optionButton);
        optionButtons.push(optionButton);
    });

    // Create win screen
    win = document.createElement('div');
    win.innerHTML = '<h2 class="win">WINNER!</h2>';
    overlay.appendChild(win);
    win.classList.add(DISPLAY_CLASS);

    // Create the HUD
    hud = document.createElement('div');
    hud.classList.add('hud');
    app.appendChild(hud);

    actionButton = document.createElement('button');
    actionButton.classList.add('btn-action');
    actionButton.innerText = 'Start';
    hud.appendChild(actionButton);

    timerDisplay = document.createElement('div');
    timerDisplay.classList.add('timer', DISPLAY_CLASS);
    timerDisplay.innerText = 'Timer: 0:00';
    hud.appendChild(timerDisplay);

    movesDisplay = document.createElement('div');
    movesDisplay.classList.add('moves');
    hud.appendChild(movesDisplay);

}

/**
 * Sets up the event listeners
 * @returns void
 */
function setupListeners(): void {
    grid.addEventListener('click', (event) => {
        const target = event.target as HTMLDivElement;
        if (target.classList.contains('tile')) {
            const id: number = parseInt(target.dataset.titleId || '');
            tryMoveTiles(id);
        }
        else if (target.classList.contains('btn-option')) {
            optionButtons.forEach((button) => button.classList.remove('active'));
            target.classList.add('active');
            const id: number = parseInt(target.dataset.optionId || '');
            setGridSize(id);
        }
    });

    actionButton.addEventListener('click', () => {
        const buttonText: string = actionButton.innerText.toLowerCase();

        if (buttonText === 'start') {
            setupGrid();
            resetGrid();
        }
        else if (buttonText === 'reset') {
            resetGrid();
        }
        else if (buttonText === 'play again') {
            showOptions();
        }
    });
}

/**
 * Callback function to update the timer
 */
function updateTimer(): void {
    const totalSeconds: number = timer.getElapsedTime() / 1000;
    const displaySeconds: number = Math.floor(totalSeconds % 60);
    const displatMinutes: number = Math.floor(totalSeconds / 60);
    updateTimerDisplay(displatMinutes, displaySeconds);
}


/**
 * Updates the timer display
 * @param mins - The minutes
 * @param seconds - The seconds
 * @returns void
 */
function updateTimerDisplay(mins: number, seconds: number): void {
    timerDisplay.innerText = `Timer: ${mins}:${seconds < 10 ? '0' : ''}${seconds}`;
}



/**
 * Sets up the number puzzle
 * @param app - The app element
 * @returns void
 */
export function setupNumberPuzzle(app: HTMLDivElement): void {
    // Create DOM elements
    createElements(app);

    // Attach event listeners
    setupListeners();

    // Set up timer
    timer = new Stopwatch(updateTimer);
}