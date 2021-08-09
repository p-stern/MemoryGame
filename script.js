const gameContainer = document.getElementById("game");
const h1 = document.querySelector("h1");
const startBtn = document.createElement("button");
startBtn.classList.add("btn");
startBtn.innerText = "Start";
let bestScore = 0;

// call a function handleCardClick when a div is clicked on
startBtn.addEventListener("click", function () {
  startBtn.remove();

  playGame();
});

// append the div to the element with an id of game
h1.after(startBtn);

function playGame() {
  const COLORS = [
    "red",
    "blue",
    "green",
    "orange",
    "purple",
    "yellow",
    "red",
    "blue",
    "green",
    "orange",
    "purple",
    "yellow"
  ];

  let ctr = 0;
  const clickedArray = [];
  const matchedIdsArray = [];
  let arrayObj = {};
  let noOfMatches = 0;
  let clicks = 0;
  let gameOver = false;

  const lsScore = JSON.parse(localStorage.getItem('BestScore'));
  const h3 = document.createElement("h3");

  if (lsScore === null) {
    h3.innerHTML = "<h3>Best: <span id='best'>0</span> Clicks: <span id='clicks'>0</span></h3>";
  }
  else {
    bestScore = parseInt(lsScore);
    h3.innerHTML = `<h3>Best: <span id='best'>${lsScore}</span> Clicks: <span id='clicks'>0</span></h3>`;
  }

  // append the h3 after the h1
  h1.after(h3);

  // here is a helper function to shuffle an array
  // it returns the same array with values shuffled
  // it is based on an algorithm called Fisher Yates if you want ot research more
  function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
      // Pick a random index
      let index = Math.floor(Math.random() * counter);

      // Decrease counter by 1
      counter--;

      // And swap the last element with it
      let temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }

    return array;
  }

  let shuffledColors = shuffle(COLORS);

  // this function loops over the array of colors
  // it creates a new div and gives it a class with the value of the color
  // it also adds an event listener for a click for each card
  function createDivsForColors(colorArray) {
    let count = 0;
    for (let color of colorArray) {
      // create a new div
      const newDiv = document.createElement("div");

      // give it a class attribute for the value we are looping over
      newDiv.classList.add(color);

      // give it a unique id for the value we are looping over
      newDiv.id = count;
      count += 1;

      // call a function handleCardClick when a div is clicked on
      newDiv.addEventListener("click", handleCardClick);

      // append the div to the element with an id of game
      gameContainer.append(newDiv);
    }
  }

  // TODO: Implement this function!
  function handleCardClick(event) {
    // you can use event.target to see which element was clicked
    // console.log("you just clicked", event.target);

    const div = document.getElementById(event.target.id);

    let alreadyClicked = false;
    for (let item of clickedArray) {
      if (item.id === div.id) {
        alreadyClicked = true;
      }
    }

    // clicking the same card twice shouldn’t count as a match!) => !alreadyClicked
    if ((!gameOver) && (!matchedIdsArray.includes(event.target.id)) && (!alreadyClicked)) {
      const clicksSpan = document.querySelector("#clicks");

      clicks += 1;
      clicksSpan.innerText = clicks;

      // Users should only be able to change at most two cards at a time => ctr < 2
      if (ctr < 2) {
        div.style.backgroundColor = event.target.classList;

        ctr += 1;

        let timer = setTimeout(function () {
          ctr -= 1;
          div.style.backgroundColor = "";

          for (let item of clickedArray) {
            if (item.id === div.id) {
              clickedArray.splice(item, 1);
            }
          }
        }, 1000);

        arrayObj = { color: event.target.classList.value, id: event.target.id, timerId: timer };
        clickedArray.push(arrayObj);

        if ((clickedArray.length === 2) && (clickedArray[0].color === clickedArray[1].color)) {
          clearTimeout(clickedArray[0].timerId);
          clearTimeout(clickedArray[1].timerId);

          const match0 = document.getElementById(clickedArray[0].id);
          const match1 = document.getElementById(clickedArray[1].id);
          matchedIdsArray.push(clickedArray[0].id);
          matchedIdsArray.push(clickedArray[1].id);

          match0.style.backgroundColor = event.target.classList;
          match1.style.backgroundColor = event.target.classList;

          clickedArray.splice(0, 2);
          ctr = 0;
          noOfMatches += 1;

          if (COLORS.length === noOfMatches * 2) {
            gameOver = true;

            const bestSpan = document.querySelector("#best");
            if ((bestScore === 0) || (bestScore > clicks)) {
              bestScore = clicks;
              bestSpan.innerText = bestScore;

              localStorage.clear();
              localStorage.setItem("BestScore", JSON.stringify(bestScore));
            }

            // create restart button
            const restartBtn = document.createElement("button");
            restartBtn.classList.add("btn");
            restartBtn.innerText = "Restart";

            // give it a class attribute for the value we are looping over
            // newDiv.classList.add(color);

            // call a function handleCardClick when a div is clicked on
            restartBtn.addEventListener("click", function () {

              // select all color divs
              const divs = document.querySelectorAll("div:not(#game)");

              for (let div of divs) {
                div.remove();
              }
              // window.location.reload()

              restartBtn.remove();
              h3.remove();
              playGame()
            });

            // append the div to the element with an id of game
            gameContainer.after(restartBtn);
          }
        }
      }
    }
  }

  // when the DOM loads
  createDivsForColors(shuffledColors);
}