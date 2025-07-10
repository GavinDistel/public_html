const boards = [
    {
        name: "Colors",
        cells: [
            ["E", "L", "W", "Y", "C"],
            ["Y", "L", "O", "A", "N"],
            ["U", "B", "L", "E", "E"],
            ["E", "L", "P", "M", "V"],
            ["P", "U", "R", "A", "U"]],
        words: ["CYAN", "YELLOW", "PURPLE", "MAUVE", "BLUE"]
    },
    {
        name: "Animals",
        cells: [
            ["E", "K", "O", "A", "P"],
            ["A", "W", "L", "I", "R"],
            ["N", "S", "F", "A", "T"],
            ["L", "E", "E", "R", "A"],
            ["A", "G", "G", "U", "J"]],
        words: ["TAPIR", "EAGLE", "JAGUAR", "SNAKE", "WOLF"]
    },
    {
        name: "Fruits",
        cells: [
            ["H", "C", "N", "A", "N"],
            ["Y", "R", "A", "A", "A"],
            ["R", "E", "A", "Y", "B"],
            ["F", "P", "P", "E", "R"],
            ["I", "G", "A", "P", "A"]],
        words: ["CHERRY", "PAPAYA", "BANANA", "PEAR", "FIG"]
    },
]

// --- Global State Variables ---
// A flat list of cell objects for the animation loop
// A 2D grid of the same cell objects for game logic
let logicalGrid = [];
// The coordinates of the currently selected cell in the logical grid
let selected_x = -1;
let selected_y = -1;

function loadBoard(boardIndex) {
    const board = boards[boardIndex];
    if (!board) {
        console.error("Invalid board index:", boardIndex);
        return;
    }

    unselect();
    logicalGrid = [];

    const cellHolder = document.getElementById("cell-holder");
    // Clear any existing cells to prevent duplication when changing boards
    cellHolder.innerHTML = '';

    // Dynamically create the 5x5 grid of cells
    for (let y = 0; y < 5; y++) {
        const tempRow = [];
        for (let x = 0; x < 5; x++) {
            const element = document.createElement('div');
            element.classList.add('cell');

            const cellObject = {
                element: element,
                gridX: x,
                gridY: y,
            };

            // Link the click event on the visual element to the logical grid position
            element.onclick = () => on_click(x, y);

            // Set the initial letter from the board data
            element.innerHTML = board.cells[y][x];

            // Add the new cell to the page and to our logical grid representation
            cellHolder.appendChild(element);
            tempRow.push(cellObject);
        }
        logicalGrid.push(tempRow);
    }

    document.getElementById("words").innerHTML = "Words to spell: " + board.words.join(", ");
}

function populateSelector() {
    const boardSelector = document.getElementById("board-selector");
    boards.forEach((board, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = board.name;
        boardSelector.appendChild(option);
    });

    boardSelector.addEventListener('change', (event) => {
        loadBoard(event.target.value);
    });
}

function move(x, y) {
    const sourceCell = logicalGrid[selected_y][selected_x];
    const destCell = logicalGrid[y][x];

    // Update the text content of the actual DOM elements
    destCell.element.innerHTML = sourceCell.element.innerHTML + destCell.element.innerHTML;
    sourceCell.element.innerHTML = "";

    select(x, y);
}

function unselect() {
    // Check if the grid exists and a cell is selected
    if (logicalGrid.length > 0 && selected_x >= 0 && selected_y >= 0) {
        logicalGrid[selected_y][selected_x].element.classList.remove("selected");
    }
    selected_x = -1;
    selected_y = -1;
}

function select(x, y) {
    const cell = logicalGrid[y][x];
    if (cell.element.innerHTML.length > 0) {
        unselect(); // Clear any previous selection first
        cell.element.classList.add("selected");
        selected_y = y;
        selected_x = x;
    }
}

function is_close(a, b) {
    return Math.abs(a - b) <= 1
}

function can_move(x, y) {
    const isAdjacent = (is_close(selected_x, x) && selected_y == y) || (is_close(selected_y, y) && selected_x == x);

    if (selected_x === -1 || !isAdjacent) {
        return false;
    }

    // Check the destination cell's element to see if it's empty
    return logicalGrid[y][x].element.innerHTML.length > 0;
}

function on_click(x, y) {
    if (selected_x == x && selected_y == y) {
        unselect()
    }
    else if (can_move(x, y)) {
        move(x, y)
    } else {
        select(x, y)
    }
}

// Initial game setup
populateSelector();
loadBoard(0); // Load the first board by default