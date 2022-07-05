const express = require('express');
const app = express();
app.listen(3000, () => console.log('listening at 3000'))
app.use(express.static('public'))
app.use(express.text({ limit: '10mb' }))
let fs = require('fs')
let readData = fs.readFileSync('english_words.txt', 'utf8')
let englishWordsDataBase = readData.split('\n')
// let theWord = englishWordsDataBase[Math.floor(Math.random() * englishWordsDataBase.length)];
let theWord = "abcdef";

console.log(englishWordsDataBase)

app.post('/checkTheWord', (request, response) => {
  console.log(englishWordsDataBase.includes(request.body))
  response.json({ result: englishWordsDataBase.includes(request.body) })
});

app.get('/pick', (request, response) => {
  theWord = englishWordsDataBase[Math.floor(Math.random() * englishWordsDataBase.length)];
  console.log(theWord)
  response.json({ result: "succesful" })
});

app.get('/length', (request, response) => {
  console.log(theWord, theWord.length)
  response.json({ result: theWord.length })
});
