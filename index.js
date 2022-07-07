const express = require('express');
const app = express();
var portNumber = process.env.PORT || 3000;
app.listen(port_number, () => console.log('listening at', portNumber));
app.use(express.static('public'))
app.use(express.text({ limit: '1mb' }))
app.use(express.json({ limit: "1mb" }))

let fs = require('fs')
let readData = fs.readFileSync('english_words.txt', 'utf8')
let englishWordsDataBase = readData.split('\n')
let theWord = englishWordsDataBase[Math.floor(Math.random() * englishWordsDataBase.length)];
// let theWord = "shades";
let wordLength = theWord.length;
let maxNumberOfAttempts = wordLength + 1;

// the keys and tiles colors
const GREEN = [3, 222, 134]
const YELLOW = [255, 206, 99]
const BLUE = [22, 37, 131]
const grayKey = 210
const gradient = 255 / (wordLength + 2);


app.post('/checkTheWord', (request, response) => {
  response.json({ result: englishWordsDataBase.includes(request.body) })
});

// picks a random word fromt he data base between the length of 4 and 7
app.get('/pick', (request, response) => {
  theWord = englishWordsDataBase[Math.floor(Math.random() * englishWordsDataBase.length)];
  wordLength = theWord.length
  while (wordLength < 4 || wordLength > 7) {
    theWord = englishWordsDataBase[Math.floor(Math.random() * englishWordsDataBase.length)];
    wordLength = theWord.length
  }
  response.json({ result: "succesful" })
});

app.get('/length', (request, response) => {
  response.json({ result: theWord.length })
});

// receives the users last attempts and return a boolean indicating wether the answer is correct or not.
app.post('/correct', (request, response) => {
  let currentAttempt = request.body
  response.json({ result: currentAttempt.toUpperCase() == theWord.toUpperCase() })
});

// Sending the a json file bck to the server containing two object based on the index of the attempt and the text associated with it.
// - The first object is an array containing the color of the latter tiles 
// - The second object is a dictionary containing the color info for the special keys on the keyboard
app.post('/pickColor', (request, response) => {
  console.log(request.body)
  let currentAttempt = request.body.currentAttempt
  let indexOfTheAttempt = request.body.indexOfTheAttempt
  let lastGuess = request.body.lastGuess
  let numberOfAllAttempts = request.body.numberOfAllAttempts
  specialKeyColors = {}
  let colors = []
  modifiableWordCopy = theWord
  for (let i = 0; i < wordLength; i++) {
    if (modifiableWordCopy[i].toUpperCase() == currentAttempt[i].toUpperCase()) {
      colors.push(GREEN)
      modifiableWordCopy = modifiableWordCopy.slice(0, i) + '_' + modifiableWordCopy.slice(i + 1);
      specialKeyColors[currentAttempt[i].toUpperCase()] = GREEN
    }
    else {
      if (!(currentAttempt[i].toUpperCase() in specialKeyColors) && !theWord.toUpperCase().includes(currentAttempt[i].toUpperCase())) {
        specialKeyColors[currentAttempt[i].toUpperCase()] = grayKey
      }
      if (lastGuess) {
        colors.push(BLUE)

      }
      else {
        colors.push(BLUE.concat([gradient * (maxNumberOfAttempts - numberOfAllAttempts + indexOfTheAttempt + 1)]))
      }
    }
  }
  for (let i = 0; i < wordLength; i++) {
    for (let k = 0; k < wordLength; k++) {
      if (colors[i] != GREEN && modifiableWordCopy[k].toUpperCase() == currentAttempt[i].toUpperCase()) {
        colors[i] = YELLOW
        modifiableWordCopy = modifiableWordCopy.slice(0, k) + '_' + modifiableWordCopy.slice(k + 1);
        if (!(currentAttempt[i].toUpperCase() in specialKeyColors)) {
          specialKeyColors[currentAttempt[i].toUpperCase()] = YELLOW
        }
        break;
      }
    }
  }
  console.log({ colors: colors, specialKeyColors })
  response.json({ colors: colors, specialKeyColors })
});