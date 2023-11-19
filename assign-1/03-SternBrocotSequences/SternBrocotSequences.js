/*
 * File: SternBrocotSequences.js
 * -----------------------------
 * Exports a function that generates Stern-Brocot sequences for
 * arbitrary real numbers between 0 and 1.
 */

"use strict";

function TestSternBrocotSequences() {
   console.log("sbs(0.5) -> " + sbs(0.5));
   console.log("sbs(0.125) -> " + sbs(0.125));
   console.log("sbs(0.65) -> " + sbs(0.65));
   console.log("sbs(Math.E - 2) -> " + sbs(Math.E - 2));
   console.log("sbs(Math.PI - 3) -> " + sbs(Math.PI - 3));
   console.log("sbs(Math.PI - 3, 100) -> " + sbs(Math.PI - 3, 100));
   console.log("");
   console.log("Now use the console to test the function for arbitrary positive numbers.");
   evaluateExpressions();
}

/*
 * Function: sbs
 * -------------
 * Accepts the provided number and an optional max length and returns
 * the Stern-Brocot sequence best representing it.  We assume the supplied
 * number is between 0 and 1, and that max, if supplied, is a reasonably small
 * (in the hundreds).
 */

const DEFAULT_MAX_LENGTH = 500;
function sbs(num, max) {
   let nl = 0;
   let dl = 1;
   let nr = 1;
   let dr = 1;
   let old_gap = 0;
   let count = 1;
   let fraction = 0.5;
   let result = '"';

   if (max === undefined) max = DEFAULT_MAX_LENGTH; // second argument is missing? use 500 as a default
   // replace the following line with your implementation, writing helper functions as necessary
   while(fraction != num) {      
      let gap = (fraction < num) ? (num - fraction) : (fraction - num);
      let direct = (fraction < num) ? "R" : "L";

      if (result.slice(-1) == direct) {
         if (gap > old_gap) {
            result += (count > 1) ? count.toString() : "";
            break;
         }
         count += 1;
      }
      else {
         result = (count > 1) ? result.concat(count) : result;
         result = result.concat(" ", direct);
         count = 1;
      }
      
      nl = (fraction < num) ? (nl + nr) : nl;
      dl = (fraction < num) ? (dl + dr) : dl;
      nr = (fraction > num) ? (nl + nr) : nr;
      dr = (fraction > num) ? (dl + dr) : dr;

      fraction = (nl + nr) / (dl + dr);
      old_gap = gap;
   }

   result = (count > 1) ? result.concat(count) : result;
   result += '"'
   
   return result;
}
