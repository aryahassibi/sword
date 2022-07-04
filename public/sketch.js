// python3 -m http.server

async function pickTheWord() {
  const response = await fetch('/pick');
  const jsonResponse = await response.json();
  const result = await jsonResponse.result
  console.log(result)
}

async function wordLength() {
  const response = await fetch('/length');
  const jsonResponse = await response.json();
  const result = await jsonResponse.result
  return result;
}

pickTheWord();

let theWord = "happy";
let modif_word = theWord;
const word_length = theWord.length;
const number_of_tries = word_length + 1;

const BG = 230;
const LIGHT_BG = 250;
const GREEN = [3, 222, 134]
const YELLOW = [255, 206, 99]
const BLUE = [22, 37, 131]
const LIGHTBLUE = [113, 128, 153]
const RED = [255, 62, 48]
const grayKey = 210
let gradient = 255 / (number_of_tries + 1)

let attempts = ['']

let canvasH = () => { return height };
let canvasW = () => { return canvasH() / (number_of_tries * 2) * word_length };
let square_size = () => { return canvasW() / (word_length + 1) };
let wordSidePadding = () => { return (width - canvasW()) / 2 }
let wordPaddingSize = () => { return (canvasW() - square_size() * word_length) / (word_length + 1) };
let finish = false;
let notAnAcceptableWord = false;
let lastGuessColors = []



let keys = [['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'], ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'], ['Z', 'X', 'C', 'V', 'B', 'N', 'M']]

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
let specialKeyColors = {};
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

function giveColor(number_of_attempt, lastGuess = false) {
  let colors = []
  modif_word = theWord
  for (let i = 0; i < word_length; i++) {
    if (modif_word[i].toUpperCase() == attempts[number_of_attempt][i].toUpperCase()) {
      colors.push(GREEN)
      modif_word = modif_word.slice(0, i) + '_' + modif_word.slice(i + 1);
      specialKeyColors[attempts[number_of_attempt][i].toUpperCase()] = GREEN
    }
    else {
      if (!(attempts[number_of_attempt][i].toUpperCase() in specialKeyColors) && !theWord.toUpperCase().includes(attempts[number_of_attempt][i].toUpperCase())) {
        specialKeyColors[attempts[number_of_attempt][i].toUpperCase()] = grayKey
      }
      if (lastGuess) {
        colors.push(BLUE)

      }
      else {
        colors.push(BLUE.concat([gradient * (number_of_attempt + 1)]))
      }
    }
  }
  for (let i = 0; i < word_length; i++) {
    for (let k = 0; k < word_length; k++) {
      if (colors[i] != GREEN && modif_word[k].toUpperCase() == attempts[number_of_attempt][i].toUpperCase()) {
        colors[i] = YELLOW
        modif_word = modif_word.slice(0, k) + '_' + modif_word.slice(k + 1);
        if (!(attempts[number_of_attempt][i].toUpperCase() in specialKeyColors)) {
          specialKeyColors[attempts[number_of_attempt][i].toUpperCase()] = YELLOW
        }
        break;
      }
    }
  }
  return colors
}


function setup() {
  createCanvas(windowWidth, windowHeight);
}

async function draw() {

  rectMode(CENTER);
  //console.log(canvasH())
  resizeCanvas(windowWidth, windowHeight);
  background(BG);
  textSize(square_size() * 80 / 100);

  for (let i = 0; i < word_length; i++) {
    noStroke();
    fill(LIGHT_BG);
    square(wordSidePadding() + wordPaddingSize() * (i + 1) + square_size() * i + square_size() * 0.5, (height) / 2, square_size(), 5)
  }

  for (let i = 0; i < attempts[attempts.length - 1].length; i++) {
    if (finish) {
      fill(lastGuessColors[i])
    } else {
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

  for (let j = 0; j < attempts.length - 1; j++) {
    let colors = giveColor(j)

    for (let i = 0; i < word_length; i++) {
      fill(colors[i])

      square(wordSidePadding() + wordPaddingSize() * (i + 1) + square_size() * i + square_size() * 0.5, (height) / 2 - (attempts.length - j - 1) * (square_size() + wordPaddingSize()), square_size(), 5)

      fill(LIGHT_BG)
      textAlign(CENTER, CENTER);
      text(attempts[j].toUpperCase()[i], wordSidePadding() + wordPaddingSize() * (i + 1) + square_size() * i + square_size() * 0.5, (height) / 2 - (attempts.length - 1 - j) * (square_size() + wordPaddingSize()));
    }
  }

  rectMode(CORNER)
  for (let i = 0; i < keys.length; i++) {
    for (let j = 0; j < keys[i].length; j++) {

      fill(keyDefaultColor)
      if (keys[i][j] in specialKeyColors) {
        fill(specialKeyColors[keys[i][j]])
      }
      keyLeftSide = keyboardSidePadding(i) + j * (buttonWidth() + keyPadding())
      keyRightSide = keyLeftSide + buttonWidth()
      keyTopSide = keyboardTopPadding() + i * (buttonHeight() + keyPadding())
      keyBottomSide = keyTopSide + buttonHeight()
      if (mouseX >= keyLeftSide && mouseX <= keyRightSide && mouseY >= keyTopSide && mouseY <= keyBottomSide && aKeyIsDown) {
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
  if (mouseX >= keyLeftSide && mouseX <= keyRightSide && mouseY >= keyTopSide && mouseY <= keyBottomSide && aKeyIsDown) {
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
  if (mouseX >= keyLeftSide && mouseX <= keyRightSide && mouseY >= keyTopSide && mouseY <= keyBottomSide && aKeyIsDown) {
    fill(keyPressedColor)
    if (firstPress && attempts[attempts.length - 1].length == word_length) {
      if (await theWordExists(attempts[attempts.length - 1])) {
        if (attempts[attempts.length - 1].toUpperCase() == theWord.toUpperCase()) {
          finish = true
          lastGuessColors = giveColor(attempts.length - 1, true)
        }
        else if (attempts.length < number_of_tries) {
          attempts.push('');
        }
        else if (attempts.length == number_of_tries) {
          finish = true;
          lastGuessColors = giveColor(attempts.length - 1, true)
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
  await wordLength();
  if (keyCode == ENTER && attempts[attempts.length - 1].length == word_length) {
    if (await theWordExists(attempts[attempts.length - 1])) {
      if (attempts[attempts.length - 1].toUpperCase() == theWord.toUpperCase()) {
        finish = true
        lastGuessColors = giveColor(attempts.length - 1, true)
      }
      else if (attempts.length < number_of_tries) {
        attempts.push('');
      }
      else if (attempts.length == number_of_tries) {
        finish = true;
        lastGuessColors = giveColor(attempts.length - 1, true)
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
