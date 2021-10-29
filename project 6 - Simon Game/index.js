var buttonColours = ["red", "blue", "green", "yellow"];

var question = [];
var answer = [];
var count = 0;
var started = false;
var i = 0;

$(document).click(function() {
  if (started === false) {
    game();
    started = true;
  }
});

$(".btn").click(function() {

  var userChosenColour = $(this).attr("id");
  answer.push(userChosenColour);

  playSound(userChosenColour);
  animatePress(userChosenColour);

  checkAnswer(question.length);
});

function checkAnswer(currentlevel) {
  if (question[count] !== answer[count]) {
    gameOver();
  } else {
    count++;
    if (count === currentlevel) {
      setTimeout(function() {
        game();
      }, 1000);
    }
  }
}


function game() {
  console.log("hi");
  count = 0;
  answer = [];
  i++;
  $("#level-title").text("Level " + i);
  var r = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[r];
  question.push(randomChosenColour);

  setTimeout(async function() {
    for (var k = 0; k < i; k++) {
      $("#" + question[k]).fadeIn(100).fadeOut(100).fadeIn(100);
      playSound(question[k]);
      await timer(500);
    }
  }, 1);
}
const timer = ms => new Promise(res => setTimeout(res, ms))

function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");
  setTimeout(function() {
    $("#" + currentColor).removeClass("pressed");
  }, 100);
}

function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

function gameOver() {
  playSound("wrong");
  $("body").addClass("game-over");
  $("#level-title").text("Game Over, Press Any Key to Restart");
  setTimeout(function() {
    $("body").removeClass("game-over");
  }, 2000);

  i = 0;
  question = [];
  setTimeout(function() {
    started = false;
  }, 1000);

}
