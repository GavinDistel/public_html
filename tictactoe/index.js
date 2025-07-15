let container = document.getElementById("container");
let cells = container.children
console.log(cells)

function whoWon() {
    for (let row = 0; row < 3; row++) {
        if (cells[row * 3].firstElementChild.innerHTML == cells[row * 3 + 1].firstElementChild.innerHTML &&
            cells[row * 3 + 1].firstElementChild.innerHTML == cells[row * 3 + 2].firstElementChild.innerHTML) {
            return cells[row * 3].firstElementChild.innerHTML;
        }
    }

    for (let column = 0; column < 3; column++) {
        if (cells[column + 3 * 0].firstElementChild.innerHTML == cells[column + 3].firstElementChild.innerHTML &&
            cells[column + 3].firstElementChild.innerHTML == cells[column + 3 * 2].firstElementChild.innerHTML) {
            return cells[column].firstElementChild.innerHTML;
        }
    }

    if (cells[0 * 3 + 0].firstElementChild.innerHTML == cells[1 * 3 + 1].firstElementChild.innerHTML &&
        cells[1 * 3 + 1].firstElementChild.innerHTML == cells[2 * 3 + 2].firstElementChild.innerHTML) {
        return cells[0 * 3 + 0].firstElementChild.innerHTML;
    }

    if (cells[2 * 3 + 0].firstElementChild.innerHTML == cells[1 * 3 + 1].firstElementChild.innerHTML &&
        cells[0 * 3 + 2].firstElementChild.innerHTML == cells[1 * 3 + 1].firstElementChild.innerHTML) {
        return cells[1 * 3 + 1].firstElementChild.innerHTML;
    }


    return ""
}

//inde of the cell
function onMouseClick(index) {
    let clickedCell = cells[index]
    let clickedInnerCell = clickedCell.firstElementChild
    if (clickedInnerCell.innerHTML != "") {
        return;
    }
    clickedInnerCell.innerHTML = "X"

    if (whoWon() == "X") {
        setTimeout(() => alert("X wins!"), 100)
    }

    let enemyChoices = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    while (enemyChoices.length > 0) {
        let enemyChoiceIndex = Math.floor(Math.random() * 9);
        let enemyChoice = enemyChoices.splice(enemyChoiceIndex, 1);

        let enemyClickedCell = cells[enemyChoice]
        let enemyClickedInnerCell = enemyClickedCell.firstElementChild
        if (enemyClickedInnerCell.innerHTML != "") {
            continue;
        }
        enemyClickedInnerCell.innerHTML = "O"
        break;
    }

    if (whoWon() == "O") {
        alert("O wins!")
    }
}