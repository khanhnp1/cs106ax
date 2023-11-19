/**
 * File: Luhn.js
 * -------------
 * This program exports the isValid predicate method, which returns true
 * if and only if the number supplied as an argument could be a valid credit
 * card number according to Luhn's algorithm.
 */

"use strict";
const NUMBERS = [ 4460246643298726, 4460246643298627, 4460246643298727 ];

/* Main program */
function TestLuhnAlgorithm() {
	for (let i = 0; i < NUMBERS.length; i++) {
		console.log("Account number " + NUMBERS[i] + " -> " + (isValid(NUMBERS[i]) ? "valid" : "invalid"));
	}
}

/**
 * Function: isValid
 * -----------------
 * Returns true if and only if the supplied number
 * meets the requirements imposed by Luhn's algorithm.
 */
function isValid(number) {
   // replace the following line with the code that properly computes whether
   // the supplied number is a valid credit card number according to Luhn's algorithm.
   let sum = 0;
   let is_even = false;
   while (number > 0) {
      let temp = (number % 10)
      if (is_even == true) {
         temp = temp * 2;
         temp = (temp > 9) ? (temp - 9):temp;
      }
      is_even = !is_even;
      sum += temp;
      number = Math.floor(number / 10);
   }
   
   if ((sum % 10) == 0) {
      return true;
   }

   return false;
}
