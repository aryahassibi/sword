async function pickTheWord() {
  const response = await fetch('/pick');
  const jsonResponse = await response.json();
  const result = await jsonResponse.result
}

async function wordLength() {
  const response = await fetch('/length');
  const jsonResponse = await response.json();
  const result = await jsonResponse.result
  return result;
}

pickTheWord();

let word_length;
let number_of_tries;

const BG = 230;
const LIGHT_BG = 250;
const GREEN = [3, 222, 134]
const YELLOW = [255, 206, 99]
const BLUE = [22, 37, 131]
const LIGHTBLUE = [113, 128, 153]
const RED = [255, 62, 48]
const grayKey = 210
let gradient;

let attempts = ['']

let canvasH = () => { return height };
let canvasW = () => { return canvasH() / (number_of_tries * 2) * word_length };
let square_size = () => { return canvasW() / (word_length + 1) };
let wordSidePadding = () => { return (width - canvasW()) / 2 }
let wordPaddingSize = () => { return (canvasW() - square_size() * word_length) / (word_length + 1) };
let finish = false;
let notAnAcceptableWord = false;
let lastGuessColors = []



const keys = [['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'], ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'], ['Z', 'X', 'C', 'V', 'B', 'N', 'M']]
const unclassifiedKeys = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M']

let longestRowLength = Math.max(keys[0].length, keys[1].length, keys[2].length)

let keyboardCanvasH = () => { return height };
function keyboardCanvasW() {
  if (width / height > 3 / 4) {
    // return canvasH()/(number_of_tries*2)*word_length
    return canvasH() * 3 / 4
  }
  else {
    return width
  }
}

let buttonWidth = () => { return ((keyboardCanvasW() / longestRowLength) * 0.8) };
let buttonHeight = () => { return (buttonWidth() * 3 / 2) };
let keyPadding = () => { return ((keyboardCanvasW() / longestRowLength) * 0.1) };
let keyboardTopPadding = () => { return ((height - keys.length * (buttonHeight() + keyPadding())) * 0.975) };
let keyboardSidePadding = (ind) => { return ((width - keys[ind].length * buttonWidth() - (keys[ind].length - 1) * keyPadding()) / 2) }
let keyDefaultColor = [199, 231, 255]
keyDefaultColor = 255
let keyPressedColor = [161, 179, 207]
let unavailableColor = [202, 214, 232]
let aKeyIsDown = false
let firstPress = true
// the color info for each keyboard key
let keyboardKeyColors = {}
for (const key of unclassifiedKeys) {
  keyboardKeyColors[key] = keyDefaultColor
}
// the color info for the square tiles
let previousAttemptsColors = []

let wordDataBase;

function preload() {
  wordDataBase = loadStrings("english_words.txt")
}

async function theWordExists(givenWord) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain'
    },
    body: givenWord.toLowerCase()
  }
  const response = await fetch('/checkTheWord', options);
  const jsonResponse = await response.json();
  const result = await jsonResponse.result
  return result;
}
// getColor send the index of the attempt and the text associated with it to the server and recieves a json containing objects
// - The first object is an array containing the color of the latter tiles 
// - The second object is a dictionary containing the color info for the special keys on the keyboard
async function getColor(indexOfTheAttempt, lastGuess = false) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      currentAttempt: attempts[indexOfTheAttempt],
      indexOfTheAttempt,
      lastGuess,
      numberOfAllAttempts: attempts.length
    })
  };
  const response = await fetch('/pickColor', options);
  const jsonResponse = await response.json();
  let specialKeyColors = jsonResponse.specialKeyColors
  let colors = jsonResponse.colors;
  // changing the color of some keys ont he keyboard based on the recieved data
  for (let item in specialKeyColors) {
    keyboardKeyColors[item] = specialKeyColors[item]
  }
  return colors;
}

// sends the last attempt to the server and recieves a boolean indicating whether the answer is correct or not
async function theLastAttemptIsCorrect() {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain'
    },
    body: attempts[attempts.length - 1].toUpperCase()
  }
  const response = await fetch('/correct', options);
  const jsonResponse = await response.json();
  const result = await jsonResponse.result
  return result;
}

async function setup() {
  createCanvas(windowWidth, windowHeight);
  word_length = await wordLength();
  number_of_tries = word_length + 1;
  gradient = 255 / (number_of_tries + 1)

}

async function draw() {
  rectMode(CENTER);
  resizeCanvas(windowWidth, windowHeight);
  background(BG);
  textSize(square_size() * 80 / 100);

  for (let i = 0; i < word_length; i++) {
    noStroke();
    fill(LIGHT_BG);
    square(wordSidePadding() + wordPaddingSize() * (i + 1) + square_size() * i + square_size() * 0.5, (height) / 2, square_size(), 5)
  }

  for (let i = 0; i < attempts[attempts.length - 1].length; i++) {
    // the game has finished and the colors has been fetched completely from the server
    if (finish && lastGuessColors[i] !== undefined) {
      fill(lastGuessColors[i])
    }
    else {
      if (notAnAcceptableWord) {
        fill(RED)
      }
      else {
        fill(BLUE)
      }

    }
    square(wordSidePadding() + wordPaddingSize() * (i + 1) + square_size() * i + square_size() * 0.5, (height) / 2, square_size(), 5)
    fill(LIGHT_BG)
    textAlign(CENTER, CENTER);
    text(attempts[attempts.length - 1].toUpperCase()[i], wordSidePadding() + wordPaddingSize() * (i + 1) + square_size() * i + square_size() * 0.5, (height) / 2);
  }
  // all of the colors has been fetched from the server
  if (previousAttemptsColors.length == attempts.length - 1) {
    for (let j = 0; j < attempts.length - 1; j++) {
      let colors = previousAttemptsColors[j]
      for (let i = 0; i < word_length; i++) {
        fill(colors[i])

        square(wordSidePadding() + wordPaddingSize() * (i + 1) + square_size() * i + square_size() * 0.5, (height) / 2 - (attempts.length - j - 1) * (square_size() + wordPaddingSize()), square_size(), 5)

        fill(LIGHT_BG)
        textAlign(CENTER, CENTER);
        text(attempts[j].toUpperCase()[i], wordSidePadding() + wordPaddingSize() * (i + 1) + square_size() * i + square_size() * 0.5, (height) / 2 - (attempts.length - 1 - j) * (square_size() + wordPaddingSize()));
      }
    }
  }

  rectMode(CORNER)
  for (let i = 0; i < keys.length; i++) {
    for (let j = 0; j < keys[i].length; j++) {
      fill(keyboardKeyColors[keys[i][j]])
      keyLeftSide = keyboardSidePadding(i) + j * (buttonWidth() + keyPadding())
      keyRightSide = keyLeftSide + buttonWidth()
      keyTopSide = keyboardTopPadding() + i * (buttonHeight() + keyPadding())
      keyBottomSide = keyTopSide + buttonHeight()
      if (mouseX >= keyLeftSide && mouseX <= keyRightSide && mouseY >= keyTopSide && mouseY <= keyBottomSide && mouseIsPressed) {
        fill(keyPressedColor)
        if (firstPress && attempts[attempts.length - 1].length < word_length) {
          attempts[attempts.length - 1] += keys[i][j]
          firstPress = false
        }
      }
      rect(keyboardSidePadding(i) + j * (buttonWidth() + keyPadding()), keyboardTopPadding() + i * (buttonHeight() + keyPadding()), buttonWidth(), buttonHeight(), 10)



      fill(0)
      textSize(buttonWidth() * 0.6)
      textAlign(CENTER, CENTER);
      text(keys[i][j], buttonWidth() / 2 + keyboardSidePadding(i) + j * (buttonWidth() + keyPadding()), keyboardTopPadding() + buttonHeight() / 2 + i * (buttonHeight() + keyPadding()))

    }
  }
  let bigButtonWidth = buttonWidth() + keyboardSidePadding(1) - keyboardSidePadding(0)
  keyLeftSide = keyboardSidePadding(1) + (keys[1].length - 1) * (buttonWidth() + keyPadding())
  keyRightSide = keyLeftSide + bigButtonWidth

  keyTopSide = keyboardTopPadding() + 2 * (buttonHeight() + keyPadding())
  keyBottomSide = keyTopSide + buttonHeight()


  // BACKSPACE BUTTON
  fill(keyDefaultColor)
  if (mouseX >= keyLeftSide && mouseX <= keyRightSide && mouseY >= keyTopSide && mouseY <= keyBottomSide && mouseIsPressed) {
    fill(keyPressedColor)
    if (firstPress && !finish) {
      attempts[attempts.length - 1] = attempts[attempts.length - 1].slice(0, -1);
      firstPress = false
      notAnAcceptableWord = false
    }
  }
  rect(keyboardSidePadding(1) + (keys[1].length - 1) * (buttonWidth() + keyPadding()), keyboardTopPadding() + 2 * (buttonHeight() + keyPadding()), bigButtonWidth, buttonHeight(), 10)

  fill(0)
  text("⌫", buttonHeight() / 2 + keyboardSidePadding(1) + (keys[1].length - 1) * (buttonWidth() + keyPadding()), bigButtonWidth / 2 + keyboardTopPadding() + 2 * (buttonHeight() + keyPadding()))


  // ENTER BUTTON
  keyLeftSide = keyboardSidePadding(0)
  keyRightSide = keyLeftSide + bigButtonWidth

  fill(keyDefaultColor)
  if (mouseX >= keyLeftSide && mouseX <= keyRightSide && mouseY >= keyTopSide && mouseY <= keyBottomSide && mouseIsPressed) {
    fill(keyPressedColor)
    if (firstPress && attempts[attempts.length - 1].length == word_length) {
      if (await theWordExists(attempts[attempts.length - 1])) {
        if (await theLastAttemptIsCorrect()) {
          finish = true
          lastGuessColors = await getColor(attempts.length - 1, true)
        }
        // if there are tries left and the last attempt has not already been sent to server ( ... != "")
        else if (attempts.length < number_of_tries && attempts[attempts.length - 1] != "") {
          attempts.push('');
          // fetching the color of the square tiles from the server
          previousAttemptsColors = []
          for (let j = 0; j < attempts.length - 1; j++) {
            previousAttemptsColors.push(await getColor(j))
          }
        }
        else if (attempts.length == number_of_tries) {
          finish = true;
          lastGuessColors = await getColor(attempts.length - 1, true)
        }
        firstPress = false
      }
      else {
        notAnAcceptableWord = true;
      }
    }
  }
  rect(keyboardSidePadding(0), keyboardTopPadding() + 2 * (buttonHeight() + keyPadding()), buttonWidth() + keyboardSidePadding(1) - keyboardSidePadding(0), buttonHeight(), 10)

  textSize(bigButtonWidth / 4)
  fill(0)
  text("ENTER", buttonHeight() / 2 + keyboardSidePadding(0), bigButtonWidth / 2 + keyboardTopPadding() + 2 * (buttonHeight() + keyPadding()))

}

async function keyTyped() {
  if (keyCode == ENTER && attempts[attempts.length - 1].length == word_length) {
    if (await theWordExists(attempts[attempts.length - 1])) {
      if (await theLastAttemptIsCorrect()) {
        finish = true
        lastGuessColors = await getColor(attempts.length - 1, true)
      }
      else if (attempts.length < number_of_tries) {
        attempts.push('');
        // fetching the color of the square tiles from the server
        previousAttemptsColors = []
        for (let j = 0; j < attempts.length - 1; j++) {
          previousAttemptsColors.push(await getColor(j))
        }
      }
      else if (attempts.length == number_of_tries) {
        finish = true;
        lastGuessColors = await getColor(attempts.length - 1, true)
      }
    }
    else {
      notAnAcceptableWord = true;
    }
  }
  else if (((unchar(key) >= unchar('a') && unchar(key) <= unchar('z')) || (unchar(key) >= unchar('A') && unchar(key) <= unchar('Z'))) && attempts[attempts.length - 1].length < word_length) {
    attempts[attempts.length - 1] += key
  }
}

function keyPressed() {
  if (keyCode == BACKSPACE && !finish) {
    attempts[attempts.length - 1] = attempts[attempts.length - 1].slice(0, -1);
    notAnAcceptableWord = false
  }
}

function mousePressed() {
  // window.location.replace("http://stackoverflow.com");
  aKeyIsDown = true
}

function mouseReleased() {
  aKeyIsDown = false
  firstPress = true
}
