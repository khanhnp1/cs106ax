/*
 * File: Enigma.js
 * ---------------
 * This program implements a graphical simulation of the Enigma machine.
 */

"use strict";

/* Main program */

function Enigma() {
	let enigmaImage = GImage("EnigmaTopView.png");
	enigmaImage.addEventListener("load", function() {
		let gw = GWindow(enigmaImage.getWidth(), enigmaImage.getHeight());
		gw.add(enigmaImage);
		runEnigmaSimulation(gw);
   });
}

// You are responsible for filling in the rest of the code.  Your
// implementation of runEnigmaSimulation should perform the
// following operations:
//
// 1. Create an object that encapsulates the state of the Enigma machine.
// 2. Create and add graphical objects that sit on top of the image.
// 3. Add listeners that forward mouse events to those objects.

function runEnigmaSimulation(gw) {
   	// Fill this in, along with helper functions that decompose the work
	let enigma = {
		lamp_: [],
		rotor_: []
	};

	for (let i = 0; i < ROTOR_LOCATIONS.length; i++) {
		let rotor = {
			element_id :  0,
			permutations: "",
			inverpermute: "",
			offset: 0
		};
		let Rotor = createRotor(i, rotor);
		gw.add(Rotor, ROTOR_LOCATIONS[i].x - ROTOR_WIDTH / 2, ROTOR_LOCATIONS[i].y - ROTOR_HEIGHT / 2);
		enigma.rotor_.push(rotor);
	}

	for (let i = 0; i < KEY_LOCATIONS.length; i++) {
		let letter = String.fromCharCode('A'.charCodeAt(0) + i);
		let key = createKeyboard(i, letter);
		let lamp = createLamp(letter);
		
		gw.add(key,  KEY_LOCATIONS[i].x - KEY_RADIUS,   KEY_LOCATIONS[i].y - KEY_RADIUS);
		gw.add(lamp, LAMP_LOCATIONS[i].x - LAMP_RADIUS, LAMP_LOCATIONS[i].y - LAMP_RADIUS);
		enigma.lamp_.push(lamp);
	}

	let mousedownAction = function(e) {
		let obj = gw.getElementAt(e.getX(), e.getY());
		if (obj !== null && obj.mousedownAction !== undefined) {
			obj.mousedownAction(enigma);
		}
	};

	let mouseupAction = function(e) {
		let obj = gw.getElementAt(e.getX(), e.getY());
		if (obj !== null && obj.mouseupAction !== undefined) {
			obj.mouseupAction(enigma);
		}
	};
	
	let clickAction = function(e) {
		let obj = gw.getElementAt(e.getX(), e.getY());
		if (obj !== null && obj.advanceRotor !== undefined) {
			obj.advanceRotor(enigma);
		}
	};

	gw.addEventListener("click", clickAction);
	gw.addEventListener("mousedown", mousedownAction);
	gw.addEventListener("mouseup", mouseupAction);
	
}

function inverKey(permutation) {
	let invertpermute = "";
	for(let i = 0; i < permutation.length; i++) {
		let letter = String.fromCharCode('A'.charCodeAt(0) + i);
		let index = permutation.indexOf(letter);
		invertpermute += String.fromCharCode('A'.charCodeAt(0) + index);
	}
	return invertpermute;
}

function applyPermutation(index, enigma) {
	const NUM_ROTOR = 3;
	const MAX_INDEX_LETTER = 26;
	let permute_idx = index;
	let letter = "";

	function correct_permute_index () {
		if (permute_idx < 0)
			permute_idx += MAX_INDEX_LETTER;
		else if (permute_idx >= MAX_INDEX_LETTER)
			permute_idx -= MAX_INDEX_LETTER;
	}
	
	/* left to right rotor */
	for (let i = 0; i < NUM_ROTOR; i++) {
		let rotor = enigma.rotor_[2 - i];
		permute_idx += rotor.offset;
		correct_permute_index();
		letter = rotor.permutations[permute_idx];
		permute_idx = letter.charCodeAt(0) - 'A'.charCodeAt(0) - rotor.offset;
	}
	/* reflector */
	correct_permute_index();
	letter = REFLECTOR_PERMUTATION[permute_idx];
	permute_idx = letter.charCodeAt(0) - 'A'.charCodeAt(0);
	/* right to left rotor */
	for (let i = 0; i < NUM_ROTOR; i++) {
		let rotor = enigma.rotor_[i];
		permute_idx += rotor.offset;
		correct_permute_index();
		letter = rotor.inverpermute[permute_idx];
		permute_idx = letter.charCodeAt(0) - 'A'.charCodeAt(0) - rotor.offset;
	}
	correct_permute_index(permute_idx);
	return permute_idx;
}

function createKeyboard (index, letter) {
	let box = GCompound();

	let border = GOval(2 * KEY_RADIUS, 2 * KEY_RADIUS);
	border.setColor(KEY_BORDER_COLOR);
	border.setLineWidth(KEY_BORDER);
	box.add(border);
	
	let key = GOval(2 * KEY_RADIUS, 2 * KEY_RADIUS);
	key.setFilled(true);
	key.setColor(KEY_BGCOLOR);
	box.add(key);

	let label = GLabel(letter, KEY_RADIUS, KEY_RADIUS + 3);
	label.setFont(KEY_FONT);
 	label.setColor(KEY_UP_COLOR);
  	label.setTextAlign("center");
  	label.setBaseline("middle");
	box.add(label);

	let permute_idx = -1;
	box.mousedownAction = function mousedownAction (enigma) {
		let rotor_indx = 2;
		let rotor_obj = enigma.rotor_[rotor_indx].element_id;
		let carry = rotor_obj.advanceRotor(enigma);

		while (carry && index > 0) {
			rotor_obj = enigma.rotor_[--rotor_indx].element_id;
			carry = rotor_obj.advanceRotor(enigma);
		}

		permute_idx = applyPermutation(index, enigma);
		let lamp = enigma.lamp_[permute_idx];
		lamp.label.setColor(LAMP_ON_COLOR);
		label.setColor(KEY_DOWN_COLOR);
	}

	box.mouseupAction = function mouseupAction (enigma) {
		let lamp = enigma.lamp_[permute_idx];
		lamp.label.setColor(LAMP_OFF_COLOR);
		label.setColor(KEY_UP_COLOR);
	}
	return box;
}

function createLamp (letter) {
	let box = GCompound();

	let lamp = GOval(2 * LAMP_RADIUS, 2 * LAMP_RADIUS);
	lamp.setFilled(true);
	lamp.setColor(LAMP_BGCOLOR);
	box.add(lamp);

	let border = GOval(2 * LAMP_RADIUS, 2 * LAMP_RADIUS);
	border.setColor(LAMP_BORDER_COLOR);
	box.add(border);

	let label = GLabel(letter, LAMP_RADIUS, LAMP_RADIUS + 2);
	label.setFont(LAMP_FONT);
 	label.setColor(LAMP_OFF_COLOR);
  	label.setTextAlign("center");
  	label.setBaseline("middle");
	box.add(label);
	box.label = label;

	return box;
}

function createRotor(index, rotor) {
	rotor.permutations = ROTOR_PERMUTATIONS[index];
	rotor.offset = 0;
	rotor.inverpermute = inverKey(ROTOR_PERMUTATIONS[index]);

	let box = GCompound();

	let letter = String.fromCharCode('A'.charCodeAt(0) + rotor.offset);
	let Rotor = GRect(ROTOR_WIDTH, ROTOR_HEIGHT);
	Rotor.setFilled(true);
	Rotor.setColor(ROTOR_BGCOLOR);
	box.add(Rotor);

	let label = GLabel(letter, ROTOR_WIDTH / 2, ROTOR_HEIGHT / 2);
	label.setFont(ROTOR_FONT);
 	label.setColor(ROTOR_COLOR);
  	label.setTextAlign("center");
  	label.setBaseline("middle");
	box.add(label);

	box.label = label;
	rotor.element_id = box;
	box.advanceRotor = function advanceRotor(enigma) {
		const MAX_INDEX_LETTER = 26;
		let rotor = enigma.rotor_[index];

		rotor.offset++;
		if (rotor.offset == MAX_INDEX_LETTER) 
			rotor.offset = 0;
		box.label.setLabel(String.fromCharCode('A'.charCodeAt(0) + rotor.offset));

		return (rotor.offset == 0);
	}
	return box;
}