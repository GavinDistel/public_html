const SIDE = { NONE: 0, LEFT: 1, RIGHT: 2 };

class Paddle {
    posx;
    posy;
    width;
    height;
    color;
    constructor(posx, posy, width, height, side, color) {
        this.posx = posx;
        this.posy = posy;
        this.width = width;
        this.height = height;
        this.color = color;
        this.side = side;
        this.vely = 0;
    }

    move(is_cpu, ball) {
        // If CPU mode is on, the paddles will be controlled by AI
        if (is_cpu) {
            const paddleCenter = this.posy + this.height / 2;

            // If the ball is significantly above the paddle center, move up
            if (ball.posy < paddleCenter - PADDLE_VELOCITY) {
                this.vely = -PADDLE_VELOCITY;
            }
            // If the ball is significantly below the paddle center, move down
            else if (ball.posy > paddleCenter + PADDLE_VELOCITY) {
                this.vely = PADDLE_VELOCITY;
            } else {
                this.vely = 0; // Stop moving to prevent jitter
            }
        }
        this.posy = Math.min(BOARD_HEIGHT - this.height, Math.max(0, this.posy + this.vely));
    }

    bounce(ball) {
        let bounce_dir = Math.sign(BOARD_WIDTH / 2 - this.posx);

        // A collision can only happen if the ball is moving towards the paddle.
        if (ball.velx * bounce_dir >= 0) {
            return SIDE.NONE;
        }

        // Check for AABB (Axis-Aligned Bounding Box) collision.
        if (ball.posx - BALL_RADIUS < this.posx + this.width &&
            ball.posx + BALL_RADIUS > this.posx &&
            ball.posy - BALL_RADIUS < this.posy + this.height &&
            ball.posy + BALL_RADIUS > this.posy) {
            ball.velx = bounce_dir * PADDLE_FORCE * Math.abs(ball.velx);
            return SIDE.NONE;
        }

        return SIDE.NONE;
    }
}

// function bounceRightPaddle(paddle) {
//     if (this.posx + BALL_RADIUS < paddle.posx) return SIDE.NONE;
//     if (this.posx + BALL_RADIUS > paddle.posx + paddle.width) return SIDE.LEFT; // Someone got a point...
//     if (this.posy < paddle.posy) return SIDE.NONE;
//     if (this.posy > paddle.posy + paddle.height) return SIDE.NONE;
//     if (this.velx > 0) {
//         this.velx = -PADDLE_FORCE * Math.abs(this.velx);
//         // add other spin, etc.
//         // add sound?
//     }
//     return SIDE.NONE;
// }
