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
const bouncingCells = [];
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

    // --- Reset and Set Up Board ---
    unselect();
    bouncingCells.length = 0;
    logicalGrid = [];

    const cellElements = [...document.getElementById("cell-holder").children];
    const container = document.getElementById("cell-holder");
    const speed = 1.5;
    let tempRow = [];

    cellElements.forEach((element, index) => {
        const gridY = Math.floor(index / 5);
        const gridX = index % 5;
        const angle = Math.random() * 2 * Math.PI;
        const cellWidth = element.offsetWidth || 60;
        const cellHeight = element.offsetHeight || 60;

        const cellObject = {
            element: element,
            gridX: gridX,
            gridY: gridY,
            x: Math.random() * (container.clientWidth - cellWidth),
            y: Math.random() * (container.clientHeight - cellHeight),
            dx: Math.cos(angle) * speed,
            dy: Math.sin(angle) * speed,
            width: cellWidth,
            height: cellHeight
        };

        // Link the click event on the visual element to the logical grid position
        element.onclick = () => on_click(gridX, gridY);

        // Set the initial letter from the board data
        element.innerHTML = board.cells[gridY][gridX];

        bouncingCells.push(cellObject);
        tempRow.push(cellObject);

        if (tempRow.length === 5) {
            logicalGrid.push(tempRow);
            tempRow = [];
        }
    });

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

function animate() {
    const container = document.getElementById("cell-holder");
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    bouncingCells.forEach(cell => {
        // Update position based on velocity
        cell.x += cell.dx;
        cell.y += cell.dy;

        // Check for wall collisions and reverse direction
        if (cell.x <= 0 || (cell.x + cell.width) >= containerWidth) {
            cell.dx *= -1;
        }
        if (cell.y <= 0 || (cell.y + cell.height) >= containerHeight) {
            cell.dy *= -1;
        }

        // Clamp position to ensure cells don't get stuck out of bounds
        cell.x = Math.max(0, Math.min(cell.x, containerWidth - cell.width));
        cell.y = Math.max(0, Math.min(cell.y, containerHeight - cell.height));

        // Apply the new position to the element's style
        cell.element.style.left = cell.x + 'px';
        cell.element.style.top = cell.y + 'px';
    });

    requestAnimationFrame(animate); // Loop the animation
}

// Initial game setup
populateSelector();
loadBoard(0); // Load the first board by default
animate(); // Start the animation loop