/*
 * File: Hailstone.js
 * ------------------
 * This program displays the Hailstone sequence for a number.
 */
"use strict";

function TestHailstone() {
    hailstone(17);
	evaluateExpressions();
}

/*
 * Function: hailstone
 * -------------------
 * Accepts the supplied number and prints the sequence of numbers that lead the original
 * number down to 1 (along with information about how the intermediate numbers were computed).
 */
function hailstone(n) {
	while(n > 1) {
		if (n % 2 == 1) {
			console.log(n + " is odd, so I make 3n+1: " + (3*n+1));
			n = 3*n + 1;
		}
		else {
			console.log(n + " is even, so I take half: " + (n/2));
			n = n/2;
		}
	}
}
