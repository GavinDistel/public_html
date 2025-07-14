const canvas = document.getElementById("gameboard");
const ctx = canvas.getContext("2d");
const cpucheck = document.getElementById("cpucheck");
const scoreboard = document.getElementById("scoreboard");
const paddleLElem = document.getElementById("paddleL");
const paddleRElem = document.getElementById("paddleR");

function updateScore(model) {
    scoreboard.innerHTML = `${model.scoreL} : ${model.scoreR}`;
}

function draw_game(model) {
    // Clear the canvas at the start of each frame so the CSS background can show through.
    ctx.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
    // The paddles are now HTML elements, so we just update their position and size.
    update_paddles(model);
    draw_ball(ctx, model.ball);
}

function draw_ball(ctx, ball) {
    ctx.fillStyle = "white"; // Give the ball a color
    ctx.beginPath();
    // Use the ball's position and the global radius to draw a circle
    ctx.arc(ball.posx, ball.posy, BALL_RADIUS, 0, 2 * Math.PI);
    ctx.fill();
}

function update_paddles(model) {
    // Update the style for the left paddle
    paddleLElem.style.left = model.paddleL.posx + 'px';
    paddleLElem.style.top = model.paddleL.posy + 'px';
    paddleLElem.style.width = model.paddleL.width + 'px';
    paddleLElem.style.height = model.paddleL.height + 'px';

    // Update the style for the right paddle
    paddleRElem.style.left = model.paddleR.posx + 'px';
    paddleRElem.style.top = model.paddleR.posy + 'px';
    paddleRElem.style.width = model.paddleR.width + 'px';
    paddleRElem.style.height = model.paddleR.height + 'px';
}