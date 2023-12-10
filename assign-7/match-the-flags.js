/**
 * File: match-the-flag.js
 * -----------------------
 * Defines the controller for the MatchTheFlag application.
 */
"use strict";

function BootstrapMatchTheFlag() {

   /*
    * Function: shuffle
    * -----------------
    * Generically shuffles the supplied array so
    * that any single permutation of the elements
    * is equally likely.
    */
   function shuffle(array) {
      for (let lh = 0; lh < array.length; lh++) {
         let rh = lh + Math.floor(Math.random() * (array.length - lh));
         let temp = array[rh];
         array[rh] = array[lh];
         array[lh] = temp;
      }    
   }

   const ARRAY_FLAG_LEN = 16;
   let array_flag = [];
   let flags_open = 0;
   for (let i = 0; i < ARRAY_FLAG_LEN; i++) {
      array_flag.push(COUNTRIES[Math.floor(i / 2)].toLocaleLowerCase());
   }
   shuffle(array_flag);

   const board = document.getElementById("board");
   let img_cover = "images/cover.png";
   let img_transparent = "images/transparent.png";
   for (let i = 0; i < ARRAY_FLAG_LEN; i++) {
      let img = document.createElement("img");
      img.setAttribute("src", img_cover);
      img.setAttribute("data-img-name", "images/" + array_flag[i] + ".png");
      board.append(img);
   }

   let img_nodes = board.getElementsByTagName("img");
   let last_opens = null;
   function clickAction() {
      let img = this;
      let img_name = img.getAttribute("src");
      let is_open = !(img_name == img_cover);
      let is_transparent = (img_name == img_transparent)
      /* Open more than 2 flags is not allowed */
      if (is_transparent || !is_open && flags_open > 1)
         return
      /* Change flags after click */
      flags_open += (!is_open) ? 1 : -1;
      img_name = (is_open) ? img_cover : img.getAttribute("data-img-name");
      img.setAttribute("src", img_name);
      if (last_opens == null) {
         last_opens = img;
         return;
      }
   
      /* If match set transparent, if not back to cover */
      function delay () {
         img_name = (img_name == last_opens.getAttribute("src")) ? img_transparent : img_cover;
         last_opens.setAttribute("src", img_name);
         img.setAttribute("src", img_name);
         flags_open = 0;
         last_opens = null;
      }
      setTimeout(delay, 1000);
   }

   for(let i = 0; i < img_nodes.length; i++) {
      img_nodes[i].addEventListener("click", clickAction, false);
   }
}

/* Execute the above function when the DOM tree is fully loaded. */
document.addEventListener("DOMContentLoaded", BootstrapMatchTheFlag);
