/*
 * File: Breakout.js
 * -----------------
 * This program implements the Breakout game.
 */
"use strict";

/* Constants */
const GWINDOW_WIDTH = 360;           /* Width of the graphics window      */
const GWINDOW_HEIGHT = 600;          /* Height of the graphics window     */
const N_ROWS = 10;                   /* Number of brick rows              */
const N_COLS = 10;                   /* Number of brick columns           */
const BRICK_ASPECT_RATIO = 4 / 1;    /* Width to height ratio of a brick  */
const BRICK_TO_BALL_RATIO = 3 / 2;   /* Ratio of brick width to ball size */
const BRICK_TO_PADDLE_RATIO = 2 / 3; /* Ratio of brick to paddle width    */
const BRICK_SEP = 2;                 /* Separation between bricks         */
const TOP_FRACTION = 0.1;            /* Fraction of window above bricks   */
const BOTTOM_FRACTION = 0.05;        /* Fraction of window below paddle   */
const N_BALLS = 3;                   /* Number of balls in a game         */
const TIME_STEP = 10;                /* Time step in milliseconds         */
const INITIAL_Y_VELOCITY = 3.0;      /* Starting y velocity downward      */
const MIN_X_VELOCITY = 1.0;          /* Minimum random x velocity         */
const MAX_X_VELOCITY = 3.0;          /* Maximum random x velocity         */

/* Derived constants */
const BRICK_WIDTH = (GWINDOW_WIDTH - (N_COLS + 1) * BRICK_SEP) / N_COLS;
const BRICK_HEIGHT = BRICK_WIDTH / BRICK_ASPECT_RATIO;
const PADDLE_WIDTH = BRICK_WIDTH / BRICK_TO_PADDLE_RATIO;
const PADDLE_HEIGHT = BRICK_HEIGHT / BRICK_TO_PADDLE_RATIO;
const PADDLE_Y = (1 - BOTTOM_FRACTION) * GWINDOW_HEIGHT - PADDLE_HEIGHT;
const BALL_SIZE = BRICK_WIDTH / BRICK_TO_BALL_RATIO;

/* Main program */

function Breakout() {
    // You fill this in along with any helper and callback functions.
    let gw = GWindow(GWINDOW_WIDTH, GWINDOW_HEIGHT);
    let paddle_x = (GWINDOW_WIDTH - PADDLE_WIDTH) / 2;
    let pause = true;
    let start = false;
    let brick_cnt = N_COLS * N_ROWS;
    let n_balls = N_BALLS;
    let ball_x = (GWINDOW_WIDTH - BALL_SIZE / 2) / 2;
    let ball_y = PADDLE_Y - BALL_SIZE / 2;

    let top_brick = TOP_FRACTION * GWINDOW_HEIGHT;
    for (let row = 0; row < N_ROWS; row++) {
        for (let col = 0; col < N_COLS; col++) {
            let color = ["Red", "Orange", "Green", "Cyan", "Blue"]
            let brick = CreateBricks(color[Math.floor(row / 2)]);
            gw.add(brick, BRICK_SEP + col * (BRICK_WIDTH + BRICK_SEP), top_brick + row * (BRICK_HEIGHT + BRICK_SEP));
        }
    }

    let paddle = GRect( paddle_x, PADDLE_Y, PADDLE_WIDTH, PADDLE_HEIGHT);
    paddle.setFilled(true);
    gw.add(paddle);

    let ball = GOval(ball_x, ball_y, BALL_SIZE / 2, BALL_SIZE / 2);
    ball.setFilled(true);
    gw.add(ball);

    let vx = 1;
    let vy = 1;
    let step = function() {

        if (brick_cnt == 0 || n_balls == 0) {
            GameOver(gw);
            return;
        }

        if(pause || !start) 
            return;        

        vx = (ball_x >= (GWINDOW_WIDTH - BALL_SIZE/2) || ball_x <= 0) ? (-vx) : vx;
        vy = (ball_y <= 0) ? (-vy) : vy;        
        let check_x_lr = (vx > 0) ? (ball_x + vx + BALL_SIZE/2) : (ball_x + vx);
        let check_y_ud = (vy > 0) ? (ball_y + vy + BALL_SIZE/2) : (ball_y + vy);

        // check left right
        let obj = gw.getElementAt(check_x_lr , ball_y + vy + BALL_SIZE/4);
        if(obj != null) {
            vx = -vx;
            if(check_y_ud < (PADDLE_Y - PADDLE_HEIGHT)) {
                gw.remove(obj);
                brick_cnt--;
            }
        }
        // check up down        
        obj = gw.getElementAt(ball_x + vx + BALL_SIZE/4, check_y_ud);
        if(obj != null) {
            vy = -vy;
            if(check_y_ud < (PADDLE_Y - PADDLE_HEIGHT)) {
                gw.remove(obj);
                brick_cnt--;
            }
        }
        
        ball_x += vx;
        ball_y += vy;
        ball.move(vx, vy);

        if (ball_y > (GWINDOW_HEIGHT - BALL_SIZE / 2) && n_balls > 0) {
            paddle_x = (GWINDOW_WIDTH - PADDLE_WIDTH) / 2;            
            ball_x = paddle_x + PADDLE_WIDTH / 2 - BALL_SIZE / 4;
            ball_y = PADDLE_Y - BALL_SIZE / 2;

            paddle.setLocation(paddle_x, PADDLE_Y);
            ball.setLocation(ball_x, ball_y);
            start = false;
            pause = true;
            n_balls--;
        }
    }
    let timer = setInterval(step, TIME_STEP);

    let movePaddle = function(e) {
        if (e.getY() > (GWINDOW_HEIGHT / 2) && e.getX() < (GWINDOW_WIDTH - PADDLE_WIDTH) ) {
            paddle_x = e.getX();
            paddle.setLocation(paddle_x, PADDLE_Y);
            if(!start) {
                ball_x = paddle_x + PADDLE_WIDTH / 2 - BALL_SIZE / 4;
                ball.setLocation(ball_x, ball_y);
            }
        }
    }
    gw.addEventListener("mousemove", movePaddle);

    let clickAction = function() {
        start = true;
        pause = !pause;
    }
    gw.addEventListener("click", clickAction);
}

function CreateBricks(color) {
    let box = GCompound();
    let brick = GRect(BRICK_WIDTH, BRICK_HEIGHT);
    brick.setFilled(true);
    brick.setColor(color);
    box.add(brick);

    let border = GRect(BRICK_WIDTH, BRICK_HEIGHT);
    border.setColor("White");
    box.add(border);

    return box;
}

function GameOver(gw) {
    let text = GLabel("GameOver", GWINDOW_WIDTH/2, GWINDOW_HEIGHT/2);
    text.setTextAlign("center");
    text.setFilled(true);
    text.setColor("Red");
    gw.add(text);
}