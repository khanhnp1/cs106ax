/*
 * File: Wordle.js
 * -----------------
 * This program implements the Wordle game.
 */
"use strict";
/**
 * GAME RULES CONSTANTS
 * ---------------------
 */
const NUM_LETTERS = 5;  // The number of letters in each guess 
const NUM_GUESSES = 6;  // The number of guesses the player has to win

/**
 * SIZING AND POSITIONING CONSTANTS
 * --------------------------------
 */
const SECTION_SEP = 32; // The space between the grid, alert, and keyboard sections
const GUESS_MARGIN = 8; // The space around each guess square
const GWINDOW_WIDTH = 400;  // The width of the GWindow

// The size of each guess square (computed to fill the entire GWINDOW_WIDTH)
const GUESS_SQUARE_SIZE =
  (GWINDOW_WIDTH - GUESS_MARGIN * 2 * NUM_LETTERS) / NUM_LETTERS;

// Height of the guess section in total
const GUESS_SECTION_HEIGHT =
  GUESS_SQUARE_SIZE * NUM_GUESSES + GUESS_MARGIN * NUM_GUESSES * 2;

// X and Y position where alerts should be centered
const ALERT_X = GWINDOW_WIDTH / 2;
const ALERT_Y = GUESS_SECTION_HEIGHT + SECTION_SEP;

// X and Y position to place the keyboard
const KEYBOARD_X = 0;
const KEYBOARD_Y = ALERT_Y + SECTION_SEP;

// GWINDOW_HEIGHT calculated to fit everything perfectly.
const GWINDOW_HEIGHT = KEYBOARD_Y + GKeyboard.getHeight(GWINDOW_WIDTH);


/**
 * STYLISTIC CONSTANTS
 * -------------------
 */
const COLORBLIND_MODE = false; // If true, uses R/G colorblind friendly colors

// Background/Border Colors
const BORDER_COLOR = "#3A3A3C"; // Color for border around guess squares
const BACKGROUND_DEFAULT_COLOR = "#121213";
const KEYBOARD_DEFAULT_COLOR = "#818384";
const BACKGROUND_CORRECT_COLOR = COLORBLIND_MODE ? "#E37E43" : "#618C55"; 
const BACKGROUND_FOUND_COLOR = COLORBLIND_MODE ? "#94C1F6" : "#B1A04C";
const BACKGROUND_WRONG_COLOR = "#3A3A3C";

// Text Colors
const TEXT_DEFAULT_COLOR = "#FFFFFF";
const TEXT_ALERT_COLOR = "#B05050";
const TEXT_WIN_COLOR = COLORBLIND_MODE ? "#94C1F6" : "#618C55";
const TEXT_LOSS_COLOR = "#B05050";

// Fonts
const GUESS_FONT = "700 36px HelveticaNeue";
const ALERT_FONT = "700 20px HelveticaNeue";


/**
 * Accepts a KeyboardEvent and returns
 * the letter that was pressed, or null
 * if a letter wasn't pressed.
 */
function getKeystrokeLetter(e) {
  if (e.altKey || e.ctrlKey || e.metaKey) return null;
  const key = e.key.toLowerCase();

  if (!/^[a-z]$/.exec(key)) return null;

  return key;
}

/**
 * Accepts a KeyboardEvent and returns true
 * if that KeyboardEvent was the user pressing
 * enter (or return), and false otherwise.
 */
function isEnterKeystroke(e) {
  return (
    !e.altKey &&
    !e.ctrlKey &&
    !e.metaKey &&
    (e.code === "Enter" || e.code === "Return")
  );
}

/**
 * Accepts a KeyboardEvent and returns true
 * if that KeyboardEvent was the user pressing
 * backspace (or delete), and false otherwise.
 */
function isBackspaceKeystroke(e) {
  return (
    !e.altKey &&
    !e.ctrlKey &&
    !e.metaKey &&
    (e.code === "Backspace" || e.code === "Delete")
  );
}

/**
 * Accepts a string, and returns if it is a valid English word.
 */
function isEnglishWord(str) {
  return _DICTIONARY.has(str) || _COMMON_WORDS.has(str);
}

/**
 * Returns a random common word from the English lexicon,
 * that is NUM_LETTERS long.
 * 
 * Throws an error if no such word exists.
 */
function getRandomWord() {
  const nLetterWords = [..._COMMON_WORDS].filter(
    (word) => word.length === NUM_LETTERS
  );

  if (nLetterWords.length === 0) {
    throw new Error(
      `The list of common words does not have any words that are ${NUM_LETTERS} long!`
    );
  }

  return nLetterWords[randomInteger(0, nLetterWords.length)];
}

/** Main Function */
function Wordle() {
  const gw = GWindow(GWINDOW_WIDTH, GWINDOW_HEIGHT); 

  // TODO: Implement Wordle!
  let secret_word = "";
  let element_id = [];
  let replay = false;
  let row_word = "";  
  let col = 0;
  let row = 0;
  let keyboard = null;
  let alert = null;

  function game_init () {
    secret_word = getRandomWord();
    element_id = [];
    drawGUI(gw, element_id);
    replay = false;
    row_word = "";
    col = 0;
    row = 0;
    keyboard = element_id.pop();
    alert = element_id.pop();
  }

  function GamePlay() {
    function keyClicked (key) {
      if (replay) {
        game_init();
        keyboard.addEventListener("keyclick", keyClicked);
        keyboard.addEventListener("enter", keyEnter);
        keyboard.addEventListener("backspace", keyBackSpace);
        return;
      }

      if (col < NUM_LETTERS) {
        UpdateGuessSquare(element_id, row, col++, null, key.toUpperCase());
        row_word += key;
      }    
    }
    keyboard.addEventListener("keyclick", keyClicked);
    
    function keyEnter() {
      if (row == NUM_GUESSES || !isEnglishWord(row_word) || col < NUM_LETTERS) {
        alert.setLabel((!isEnglishWord(row_word) && col == NUM_LETTERS) ? row_word.toUpperCase() + " is not an english word" : "");
        return;
      }
  
      for (let i = 0; i < NUM_LETTERS; i++) {
        let indx = secret_word.indexOf(row_word.charAt(i));
        if (indx < 0) {
          UpdateGuessSquare(element_id, row, i, BACKGROUND_WRONG_COLOR, null);
          keyboard.setKeyColor(row_word.charAt(i), BACKGROUND_WRONG_COLOR);
          continue;
        }
  
        let color = (indx == i) ? BACKGROUND_CORRECT_COLOR : BACKGROUND_FOUND_COLOR
        UpdateGuessSquare(element_id, row, i, color, null);
        keyboard.setKeyColor(row_word.charAt(i), color);
      }
  
      if(row_word == secret_word) {
        alert.setLabel("You won!");
        row = NUM_GUESSES;
        replay = true;
        return;
      }
  
      col = 0;
      row_word = "";
      row++;
      if (row == NUM_GUESSES) {
        alert.setLabel("Secret word: "+ secret_word.toUpperCase());
        replay = true;
      }
    }
    keyboard.addEventListener("enter", keyEnter);
  
    function keyBackSpace () {
      alert.setLabel("");
      if (col > 0) {
        UpdateGuessSquare(element_id, row, --col, null,"");
        row_word = row_word.slice(0, -1);
      }    
    }
    keyboard.addEventListener("backspace", keyBackSpace);
  
    let keyStrokeHandle = function(e) {
      if (isEnterKeystroke(e) || isBackspaceKeystroke(e)) {
        isEnterKeystroke(e) ? keyEnter() : keyBackSpace();
        return;
      } 
  
      let key = getKeystrokeLetter(e);
      if (key != null)
        keyClicked(key);
    };
    gw.addEventListener("keydown", keyStrokeHandle);
  }

  game_init();
  GamePlay();
}

function drawGUI(gw, element_id) {
  // Create Guess Grid
  gw.removeAll();
  for (let row = 0; row < NUM_GUESSES; row++) {
    let row_pos = GUESS_MARGIN + (GUESS_SQUARE_SIZE + 2 * GUESS_MARGIN) * row;
    for (let col = 0; col < NUM_LETTERS; col++) {
      let box = createGuessSquare(BACKGROUND_DEFAULT_COLOR, "");
      let col_pos = GUESS_MARGIN + (GUESS_SQUARE_SIZE + 2 * GUESS_MARGIN) * col;
      gw.add(box, col_pos, row_pos);
      element_id.push(box);
    }
  }

  // Create Alert
  let alert = GLabel("", ALERT_X, ALERT_Y);
  alert.setFont(ALERT_FONT);
  alert.setColor(TEXT_ALERT_COLOR);
  alert.setTextAlign("center");
  alert.setBaseline("middle");
  gw.add(alert);
  element_id.push(alert);
  
  // Create keyboard
  let keyboard = GKeyboard(KEYBOARD_X, KEYBOARD_Y, GWINDOW_WIDTH, TEXT_DEFAULT_COLOR, KEYBOARD_DEFAULT_COLOR);
  gw.add(keyboard);
  element_id.push(keyboard);
}


function UpdateGuessSquare(element_id, row, col, color, letter) {
  let box = element_id[row * NUM_LETTERS + col];
  let square = box.getElement(0);
  let label  = box.getElement(1);
  
  if(color != null) {
    square.setFilled(true);
    square.setColor(color);
  }

  if(letter != null)
    label.setLabel(letter);
}

function createGuessSquare(color, letter) {
  let box = GCompound();

  let square = GRect(GUESS_SQUARE_SIZE, GUESS_SQUARE_SIZE);
  square.setFilled(false);
  square.setColor(BORDER_COLOR);
  box.add(square);

  let label = GLabel(letter, GUESS_SQUARE_SIZE/2, GUESS_SQUARE_SIZE/2);
  label.setFont(GUESS_FONT);
  label.setColor(TEXT_DEFAULT_COLOR);
  label.setTextAlign("center");
  label.setBaseline("middle");
  box.add(label);

  return box;
}