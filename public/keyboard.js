let keys = [['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'], ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'], ['Z', 'X', 'C', 'V', 'B', 'N', 'M']]
let longestRowLength = Math.max(keys[0].length, keys[1].length, keys[2].length)


let canvasH = () => { return height };
let canvasW = () => { return width };

let buttonWidth = () => { return ((canvasW() / longestRowLength) * 0.8)};
let buttonHeight = () => {return (buttonWidth()*3/2)};
let keyPadding = () => {return ((canvasW() / longestRowLength) * 0.1)};
let keyboardTopPadding = () => {return ((height - (keys.length*buttonHeight() + (keys.length-1)*keyPadding()))/2)};
let keyboardSidePadding = (ind) => {return ((canvasW() - keys[ind].length*buttonWidth() - (keys[ind].length-1)*keyPadding() )/2)}
let keyDefaultColor = [199, 231, 255]
let keyPressedColor = [161, 179, 207]

let aKeyIsDown = false
let txt = ""
let firstPress = true

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(237, 244, 255)
}

function draw() {
  noStroke()
  resizeCanvas(windowWidth, windowHeight);
  background(237, 244, 255)
  for (let i = 0; i < keys.length; i++){
    for (let j = 0; j < keys[i].length; j++){

      fill(keyDefaultColor)
      keyLeftSide = keyboardSidePadding(i)+j*(buttonWidth() + keyPadding())
      keyRightSide = keyLeftSide + buttonWidth()
      keyTopSide = keyboardTopPadding()+i*(buttonHeight() + keyPadding())
      keyBottomSide =  keyTopSide + buttonHeight()
      if (mouseX >= keyLeftSide && mouseX <= keyRightSide && mouseY >= keyTopSide && mouseY <= keyBottomSide && aKeyIsDown){
        fill(keyPressedColor)
        if (firstPress){
          txt += keys[i][j]
          firstPress = false
        }
      }
      rect(keyboardSidePadding(i)+j*(buttonWidth() + keyPadding()), keyboardTopPadding()+i*(buttonHeight() + keyPadding()), buttonWidth(), buttonHeight(), 5)



      fill(0)
      textSize(buttonWidth()*0.6)
      textAlign(CENTER, CENTER);
      text(keys[i][j], buttonWidth()/2 +keyboardSidePadding(i)+j*(buttonWidth() + keyPadding()), keyboardTopPadding() + buttonHeight()/2 + i*(buttonHeight() + keyPadding()))
      text(txt, width/2, height/4)

    }
  }
  let bigButtonWidth = buttonWidth() + keyboardSidePadding(1)- keyboardSidePadding(0)
  keyLeftSide = keyboardSidePadding(1)+(keys[1].length-1)*(buttonWidth() + keyPadding())
  keyRightSide = keyLeftSide + bigButtonWidth

  keyTopSide = keyboardTopPadding()+ 2 * (buttonHeight() + keyPadding())
  keyBottomSide =  keyTopSide + buttonHeight()


  // BACKSPACE BUTTON
  fill(keyDefaultColor)
  if (mouseX >= keyLeftSide && mouseX <= keyRightSide && mouseY >= keyTopSide && mouseY <= keyBottomSide && aKeyIsDown){
    fill(keyPressedColor)
    if (firstPress){
      txt = txt.slice(0, -1);
      firstPress = false
    }
  }
  rect(keyboardSidePadding(1)+(keys[1].length-1)*(buttonWidth() + keyPadding()), keyboardTopPadding()+2*(buttonHeight() + keyPadding()),bigButtonWidth,buttonHeight(), 5)

  fill(0)
  text("⌫", buttonHeight()/2 + keyboardSidePadding(1)+(keys[1].length-1)*(buttonWidth() + keyPadding()), bigButtonWidth/2 +keyboardTopPadding()+2*(buttonHeight() + keyPadding()))


  // ENTER BUTTON
  keyLeftSide = keyboardSidePadding(0)
  keyRightSide = keyLeftSide + bigButtonWidth

  fill(keyDefaultColor)
  if (mouseX >= keyLeftSide && mouseX <= keyRightSide && mouseY >= keyTopSide && mouseY <= keyBottomSide && aKeyIsDown){
    fill(keyPressedColor)
    if (firstPress){
      txt += " "
      firstPress = false
    }
  }
  rect(keyboardSidePadding(0), keyboardTopPadding()+2*(buttonHeight() + keyPadding()),buttonWidth() + keyboardSidePadding(1)- keyboardSidePadding(0),buttonHeight(), 5)

  textSize(bigButtonWidth/4)
  fill(0)
  text("ENTER", buttonHeight()/2 + keyboardSidePadding(0), bigButtonWidth/2 +keyboardTopPadding()+2*(buttonHeight() + keyPadding()))






}
function mousePressed(){
  aKeyIsDown = true
}

function mouseReleased(){
  aKeyIsDown = false
  firstPress = true
}
