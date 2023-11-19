/*
 * File: SamplerQuilt.js
 * ---------------------
 * This program uses the object-oriented graphics model to draw
 * a Sampler Quilt to the screen. :)
 */

"use strict";

/* Constants */
const PATCH_DIMENSION = 75;
const NUM_ROWS = 7;
const NUM_COLUMNS = 7;
const BORDER_COLOR = "Black";
const BULLSEYE_BOLD_COLOR = "Red";
const BULLSEYE_MILD_COLOR = "White";
const LOG_COLOR = "Tan";
const LOVE_FRAME_COLOR = "Pink";
const LOVE_MAT_COLOR = "White";

/* Derived Constants */
const WINDOW_WIDTH = NUM_COLUMNS * PATCH_DIMENSION;
const WINDOW_HEIGHT = NUM_ROWS * PATCH_DIMENSION;

/*
 * Function: DrawSamplerQuilt
 * --------------------------
 * Draws a sampler quilt as outlined in the assignment handout.
 */

function DrawSamplerQuilt() {
   let gw = GWindow(WINDOW_WIDTH, WINDOW_HEIGHT);
   drawQuilt(gw);
}

/*
 * Function: drawQuilt
 * --------------------------
 * Inserts all of the sampler quilt into the supplied graphics window.
 */
function drawQuilt(gw) {
   for (let row = 0; row < NUM_ROWS; row++) {
      for (let col = 0; col < NUM_COLUMNS; col++) {
         let patch = createPlaceholderPatch();         
         gw.add(patch, col * PATCH_DIMENSION, row * PATCH_DIMENSION);

         let sum = col + row;
         if (sum % 4 == 0) {
            let bullseye = createBullseye();
            gw.add(bullseye,  col * PATCH_DIMENSION, row * PATCH_DIMENSION);
         }

         if (sum % 4 == 1) {
            let logcabin = createLogCabin();            
            gw.add(logcabin, col * PATCH_DIMENSION, row * PATCH_DIMENSION);
         }

         if (sum % 4 == 2) {
            let FlowerPatch = createFlowerPatch();
            gw.add(FlowerPatch, col * PATCH_DIMENSION, row * PATCH_DIMENSION);
         }

         if (sum % 4 == 3) {
            let Image = createImage();
            gw.add(Image, col * PATCH_DIMENSION, row * PATCH_DIMENSION);
         }
      }
   }
}

/**
 * Function: createPlaceholderPatch
 * --------------------------------
 * This function is only here to draw a simple rectangle of the correct
 * size to occupy the space where a more elaborate patch belongs.  You will
 * want to remove it after you've implemented everything.
 */
function createPlaceholderPatch() {
   return GRect(PATCH_DIMENSION, PATCH_DIMENSION);
}

function createBullseye() {
   const CIRCLE_GAP = 5;
   const CIRCLE_NUM = 8;

   let box = GCompound();
   for (let i = 1; i < CIRCLE_NUM; i++) {
      let circle_cor = CIRCLE_GAP * i;
      let circle_rad = PATCH_DIMENSION - circle_cor * 2;

      let oval = GOval(circle_cor , circle_cor, circle_rad, circle_rad);
      oval.setFilled(true);
      if (i % 2 == 1) 
         oval.setColor(BULLSEYE_BOLD_COLOR);
      else
         oval.setColor(BULLSEYE_MILD_COLOR);      
      box.add(oval);

      let border = GOval(circle_cor , circle_cor, circle_rad, circle_rad);
      box.add(border);
   }

   return box;
}

function createLogCabin() {
   const RECT_OFFSET = 8.3;

   let box = GCompound();
   let x = 4 * RECT_OFFSET;
   let y = 4 * RECT_OFFSET;

   let rect = GRect(x , y, PATCH_DIMENSION - 2 * x, PATCH_DIMENSION - 2 * y);
   box.add(rect);

   let border = GRect(x , y, PATCH_DIMENSION - 2 * x, PATCH_DIMENSION - 2 * y);
   box.add(border);

   for (let j = 0; j < 4; j++) {
      let r = j * RECT_OFFSET;
      let square_len = PATCH_DIMENSION - r;

      for (let i = 0; i < 4; i++) {
         let width  = (i % 2 == 1) ? RECT_OFFSET : (square_len - r - RECT_OFFSET);
         let height = (i % 2 == 0) ? RECT_OFFSET : (square_len - r - RECT_OFFSET);
         let t = (i == 2) ? (r + RECT_OFFSET) : (square_len - RECT_OFFSET);

         y = (i < 2) ? r : x;
         x = (i % 3) ? t : r;

         rect = GRect(x , y, width, height);
         rect.setFilled(true);
         rect.setColor(LOG_COLOR);
         box.add(rect);

         border = GRect(x , y, width, height);
         box.add(border);
      }  
   }
   return box;
}

function createFlowerPatch() {
   let box = GCompound();
   let x = PATCH_DIMENSION * 6 / 20;
   let y = PATCH_DIMENSION * 6 / 20;;

   let l_oval = GOval(x, y, PATCH_DIMENSION * 2 / 5, PATCH_DIMENSION * 2 / 5);
   l_oval.setFilled(true);
   l_oval.setColor(randomColor());

   let l_border = GOval(x, y, PATCH_DIMENSION * 2 / 5, PATCH_DIMENSION * 2 / 5);
   l_border.setColor(BORDER_COLOR);
   
   for (let i = 0; i < 4; i++) {
      x = (i % 3) ? (PATCH_DIMENSION * 11 / 20) : (PATCH_DIMENSION / 20);
      y = (i < 2) ? (PATCH_DIMENSION / 20) : (PATCH_DIMENSION * 11 / 20);
      let oval = GOval(x, y, PATCH_DIMENSION * 2 / 5, PATCH_DIMENSION * 2 / 5);     
      
      oval.setFilled(true);
      oval.setColor(randomColor());   
      box.add(oval);

      let border = GOval(x, y, PATCH_DIMENSION * 2 / 5, PATCH_DIMENSION * 2 / 5);
      box.add(border);
   }
   box.add(l_oval);
   box.add(l_border);
   
   return box;
}

function createImage() {
   let box = GCompound();
   let name = [ "ashlee", "artur", "colin", "kaia"]
   let image_url = "https://cs106ax.stanford.edu/img/" + name[Math.floor(Math.random() * 4)] + ".png";
   let Image = GImage(image_url);
   box.add(Image);

   const RECT_OFFSET = 8.3;

   for (let j = 0; j < 2; j++) {
      let r = j * RECT_OFFSET;
      let square_len = PATCH_DIMENSION - r;
      let x = 0;
      let y = 0;

      for (let i = 0; i < 4; i++) {
         let width  = (i % 2 == 1) ? RECT_OFFSET : (square_len - r - RECT_OFFSET);
         let height = (i % 2 == 0) ? RECT_OFFSET : (square_len - r - RECT_OFFSET);
         let t = (i == 2) ? (r + RECT_OFFSET) : (square_len - RECT_OFFSET);

         y = (i < 2) ? r : x;
         x = (i % 3) ? t : r;

         let rect = GRect(x , y, width, height);
         rect.setFilled(true);
         let corlor = (j == 1) ? LOVE_MAT_COLOR : LOVE_FRAME_COLOR;
         rect.setColor(corlor);
         box.add(rect);

         let border = GRect(x , y, width, height);
         box.add(border);
      }  
   }

   return box;
}