/*
    CONSTANTS section
*/

//the number of the fish buttons initialized in the HTML file
const numButtonGame = 8 
//Array containing all the 5 fish buttons
const buttonGameArray = []
//Two buttons option (NEW - START)
const buttonOptionsArray = 2;

//Millisecond limit that the PC button illumination timer does not go down further
const minCapMillis = 300

//declaring various buttons and labels as constants for convenience
const musicSwitch = document.getElementById("musicSwitch")
const startButton = document.getElementById("startButton")
const scoreLabel = document.getElementById("scoreSpan")
const levelLabel = document.getElementById("levelSpan")
const recordLabel = document.getElementById("recordSpan")
const textModal = document.getElementById("textModal")
const textModal2 = document.getElementById("textModal2")
const gameState = document.getElementById("stateSpan")
const iframe = document.getElementById('myIframe');
// const diffInc = document.getElementById("diffInc")

//method defined as a constant used for the generation of random numbers
const equals = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/*
    FLAGS and VAR section
*/

//flag that indicates if the computer is playing the sequence
var SequenceisRunning = false
//An array of int which keeps track of the PC sequence
var sequenceArray = new Array(); 
//An array of int which keeps track of the USER sequence
var buttonUserArray = new Array();
var level = 1;
//value that indicates where it is in the array while lighting up the buttons
var numOfSequence = 0
//The number of buttons that the user clicked in a certain level
var buttonsClicked = 0
var points = 0
var personalRecord = 0
//Flag that indicates if the user can press the button start
var canPressStart = true
//Flag that indicates if the user can press the buttons of the game
var canPressSequenceButtons = false
var score = 0
//Rappresent the time in millis the amout of time of the button illumination for the PC
var millisDifficoulty = 1000
var cntDiff = 0

/*
    GAME STRUCTURE
*/

var sec = 0;
var min = 0;
var hrs = 0;
var t;
var timeInString = "00:00:00"

function tick(){
    sec++;
    if (sec >= 60) {
        sec = 0;
        min++;
        if (min >= 60) {
            min = 0;
            hrs++;
        }
    }
}
function add() {
    tick();
    timeInString = (hrs > 9 ? hrs : "0" + hrs) 
        	 + ":" + (min > 9 ? min : "0" + min)
       		 + ":" + (sec > 9 ? sec : "0" + sec);
    document.getElementById('timeSpan').innerHTML = timeInString;
    timer();
}
function timer() {
    t = setTimeout(add, 1000);
}


//Class of all the 5 buttons of the game
class myButtonGame{
    //constructor that recive the document.getElementById("ID") element
    constructor(btn){
        this.btn = btn
        this.id = this.btn.id
        this.btn.addEventListener("click", function(){
            //This eventListener adds the id of the button pressed to the array of buttons pressed by the user
            if(!SequenceisRunning && canPressSequenceButtons){
                //get the last character of the buttons ID (it's a number)
                let val = Number(this.id.slice(-1))
                //push the number in the array
                buttonUserArray.push(val);

                // console.log(`Get element ${val} preso`)
                // console.log(buttonUserArray)

                checkButtonInSequence(this.id)
            }
        })
        
        //Visual effect: if it's NOT the pc Turn you are able to see the yellow click effect of the buttons
        this.btn.onmousedown = function(){
            if(gameState.innerHTML == "Your turn" || gameState.innerHTML == "Press START"){
                document.getElementById(this.id).style.backgroundColor = "blue"
            }
        }
        this.btn.onmouseup = function(){
            if(gameState.innerHTML == "Your turn" || gameState.innerHTML == "Press START")
                document.getElementById(this.id).style.backgroundColor = "rgba(255, 255, 255, 0.7)"
        }
        this.btn.onmouseout = function(){
            if(gameState.innerHTML == "Your turn" || gameState.innerHTML == "Press START")
                document.getElementById(this.id).style.backgroundColor = "rgba(255, 255, 255, 0.7)"
        }
    }
}

//This function check step by step the sequence of the computer with the sequence of the player
function checkButtonInSequence(buttonId){
    
    //Check with each click of the button the id of the button pressed (last number) corresponds with the sequence of the pc
    if(sequenceArray[buttonsClicked] == buttonUserArray[buttonsClicked]){
        buttonsClicked++
        score++
        scoreLabel.innerHTML = score
    }
    else{
        /*
            There is a chance that the button pressed from the player is pushed in the array
            while the PC is showing the sequence, to obviate this: if it's the
            PC turn I'll skip this function with return
        */
        if(gameState.innerHTML == "PC turn")
            return

        //Set the text output of the modal (pop-up)
        textModal.innerHTML = `Final score: ${score}`
        textModal2.innerHTML = `Level reached: ${level}`
        
        document.getElementById('times').value = document.getElementById('timeSpan').innerHTML
        document.getElementById('scores').value = score;
        document.getElementById('levelss').value = level;

        // console.log(score)
        // console.log(level)

        //Showing the modal (pop-up)
        // console.log("A")
        document.getElementById('id01').style.display='block'
        // console.log("B")
        resetGame()
        return
    }

    /*
        If the length of the user array is the same of the PC (user ended successfully the sequence)
        I will incrase the level and call the startLevel function
    */
    if(buttonsClicked == sequenceArray.length){
        level++
        levelLabel.textContent = level;
        gameState.innerHTML = "PC turn"
        setTimeout("startLevel()", 650)
    }
}

//Random number generator function
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

/*
    Every time a new level starts, this function will push a random number 
    (corresponds of the last char of the ID button) in the PC array
*/
function createSequence(){
    numOfSequence = 0
    sequenceArray.push(getRandomInt(numButtonGame));
    // console.log(sequenceArray);
}

//This function inizializate all the buttons present on the page
function inizializeButtons(){
    let cnt = 0
    let tempButton

    musicSwitch.checked = true
    // musicSwitch.toggle()
    gameState.style.color = "red"

    /*
        The buttons game (5 fish buttons) have a particoular ID, they start all with
        "buttongame" and to distinguish them there is an unique number at the end
        so It's easy to inizialize them with a while loop
    */
    while(cnt < numButtonGame){
        tempButton = document.getElementById("button" + (cnt))
        buttonGameArray[cnt] = new myButtonGame(tempButton)
        cnt++
    }

    //Adding an event listener to the START button
    startButton.addEventListener("click", function(){
        if(canPressStart && gameState.innerHTML == "Press START"){
            timer();
            startButton.innerHTML = "New"
            startLevel()
        }
        if(gameState.innerHTML == "Your turn"){
            startButton.innerHTML = "Start"
            resetGame()
        }
    })

}

//function that restores the button to its basic color
function resetColor(value){
    document.getElementById(value).style.backgroundColor = "rgba(255, 255, 255, 0.7)"
}

/*
    this function recive 3 parameters ID color and time and change the color
    of the given ID button for an amount of time (millis)
*/

function changeColorButton(value, color, time){
    document.getElementById(value).style.backgroundColor = color
    setTimeout("resetColor(value)", time);
}


//this is a recursive function that call it self for each element of the PC sequence array 
function runSequence(){
    //concatenating the two strings to form the real button ID
    value = "button" + sequenceArray[numOfSequence]
    //changing the color of the button
    changeColorButton(value, "yellow", millisDifficoulty)
    numOfSequence++
    //check if the index it's not out of bounds
    if(numOfSequence < sequenceArray.length){
        //if it's not, i'll call the function for the next value of the PC button sequence
        setTimeout("runSequence()", millisDifficoulty + 100)
    }
    else{
        /*
            If it showed all the buttons of the sequence il set the flags
            and change the turn for the player move
        */
        setTimeout("SequenceisRunning = false", millisDifficoulty + 100)
        setTimeout("gameState.innerHTML = `Your turn`", millisDifficoulty + 100)
        setTimeout("gameState.style.color = 'blue'", millisDifficoulty + 100)
        setTimeout("canPressSequenceButtons = true", millisDifficoulty + 100)
        return
    }
}

function resetGame(){
    /*
        There is a problem with the script, if it's PC turn and you press
        new it will glitch the script, to obviate this problem the program
        will check if it's  the PC Turn and in this case skip the function 
        returning nothing
    */
    if(gameState.innerHTML == "PC turn")
        return

    //Resetting all the flags, arrays , saving score, rewriting the labels ecc.
    gameState.innerHTML = "Press START"
    gameState.style.color = "red"
    startButton.innerHTML = "Start"
    score = 0
    scoreLabel.innerHTML = score
    canPressSequenceButtons = false
    canPressStart = true

    //Checking if there is a new record
    if(level > personalRecord){
        personalRecord = level
        recordLabel.textContent = personalRecord
    }

    millisDifficoulty = 1100
    level = 1
    levelLabel.textContent = level
    points = 0
    sequenceArray = []
    buttonUserArray = []
    // console.clear();

    //Resetting timer
    clearTimeout(t);
    var timeInString = "00:00:00"
    document.getElementById('timeSpan').innerHTML = "00:00:00";
    sec = 0; 
    min = 0; 
    hrs = 0;
}

//Every 5 levels the time of the buttons lighting for PC is reduced up to a human reaction (600 millis)
function changeDifficoulty(){
    if(level % 5 == 0 && millisDifficoulty > minCapMillis){
        millisDifficoulty -= 100
        //showDifficultyLabel()
    }
}

function showDifficultyLabel(){
    if(cntDiff % 2 == 0)
        diffInc.innerHTML = "Difficulty increased"
    else
        diffInc.innerHTML = ""

    if(cntDiff < 7){
        cntDiff++
        setTimeout("showDifficultyLabel(cntDiff)", 450)
    }
    else{
        cntDiff = 0
        return
    }

}

function startLevel(){
    console.time("Response time")
    //Resetting the user sequence and setting the flags
    canPressSequenceButtons = false
    buttonUserArray = []
    buttonsClicked = 0
    /*
        if the computer is running his sequence I can do nothing
        if I didn't lost i cant call the startLevel manually (with START button)
    */
    if(SequenceisRunning)
        return

    changeDifficoulty()

    //setting flags and turn
    SequenceisRunning = true
    gameState.innerHTML = "PC turn"
    gameState.style.color = "yellow"
    canPressStart = false


    //push a new element to the PC array
    createSequence()
    
    console.log(sequenceArray)

    //run the sequence with the new element pushed
    runSequence(numOfSequence)
}

/*
    When the scipt starts it will automatically inizialize all the buttons
    and provide the playar to play the game
*/
inizializeButtons()

var x = document.getElementById("audio");

// Get the modal
var modal = document.getElementById("id02");

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function leaderBoardFunction(){
    document.getElementById('id02').style.display='block'
}

function updatePHP(event) {

    // form values
    var names = event.names.value
    var scores = event.scores.value
    var levelss = event.levelss.value;
    var times = event.times.value;
    var http = new XMLHttpRequest();

    
    
    console.log(scores)
    console.log(levelss)

    var url = 'formInsert.php';
    var params = 'username=' + names + '&score=' + scores + '&level=' + levelss + '&time=' + times;
    console.log(params);
    http.open('POST', url, true);

    //Send the header information
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    http.onreadystatechange = function() {
        if (http.readyState == 4 && http.status == 200) {

            //alert("Form submitted successfully");

            var iframe = document.getElementById('myIframe');
            iframe.src = iframe.src;

            document.getElementById('id01').style.display='none'
            document.getElementById("formData").reset();
            console.log(http.responseText);
        }
    }
    // Send params with request
    http.send(params);
}

musicSwitch.addEventListener('change', function(){
    if(!musicSwitch.checked){
        const elems = document.querySelectorAll("video, audio");
        for (const el of elems) {
          el.muted = true
          el.pause()
        }
    }
    else{
        const elems = document.querySelectorAll("video, audio");
        for (const el of elems) {
          el.muted = false
          el.play()
        }
    }
})

