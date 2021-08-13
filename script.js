const gameContainer = document.getElementById("game");
const h1 = document.querySelector("h1");
const startBtn = document.createElement("button");
startBtn.classList.add("btn");
startBtn.innerText = "Start";
let bestScore = 0;

// call a function handleCardClick when a div is clicked on
startBtn.addEventListener("click", function () {
  startBtn.style.visibility = 'hidden';
  playGame();
});

// append the div to the element with an id of game
h1.after(startBtn);

function playGame() {
  const IMAGES = [
    "arnold",
    "bugs",
    "dumbo",
    "LzsS",
    "mgmlion",
    "mickey",
    "pota",
    "rabbit",
    "tigger",
    "toto",
    //
    "arnold",
    "bugs",
    "dumbo",
    "LzsS",
    "mgmlion",
    "mickey",
    "pota",
    "rabbit",
    "tigger",
    "toto"
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

  // append the h3 after the start button
  startBtn.after(h3);

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

  let shuffledImages = shuffle(IMAGES);

  // this function loops over the array of images
  // it creates a new div and gives it a class with the value of the image
  // it also adds an event listener for a click for each card
  function createDivsForImages(imageArray) {
    let count = 0;
    for (let image of imageArray) {
      // create a new div
      const newDiv = document.createElement("div");

      // give it a class attribute for the value we are looping over
      newDiv.classList.add(image);

      newDiv.style.backgroundColor = "white";

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

      // Users should only be able to change at most two cards at a time => ctr < 2
      if (ctr < 2) {
        clicks += 1;
        clicksSpan.innerText = clicks;

        div.style.backgroundImage = `url(./images/${event.target.classList}.jpg)`;
        div.style.backgroundSize = "cover";

        ctr += 1;

        arrayObj = { image: event.target.classList.value, id: event.target.id };
        clickedArray.push(arrayObj);

        if (ctr > 1) {
          const firstFlip = document.getElementById(clickedArray[0].id);
          const secondFlip = document.getElementById(clickedArray[1].id);

          // start timer after second click
          let timerId = setTimeout(function () {
            ctr -= 2;
            firstFlip.style.backgroundImage = "";
            firstFlip.style.backgroundColor = "white";
            secondFlip.style.backgroundImage = "";
            secondFlip.style.backgroundColor = "white";
            clickedArray.splice(0, 2);
          }, 1000);

          // match logic
          if (clickedArray[0].image === clickedArray[1].image) {
            clearTimeout(timerId);
            matchedIdsArray.push(clickedArray[0].id);
            matchedIdsArray.push(clickedArray[1].id);

            firstFlip.style.backgroundImage = `url(./images/${event.target.classList}.jpg)`;
            firstFlip.style.backgroundSize = "cover";
            secondFlip.style.backgroundImage = `url(./images/${event.target.classList}.jpg)`;
            secondFlip.style.backgroundSize = "cover";

            clickedArray.splice(0, 2);
            ctr = 0;
            noOfMatches += 1;

            // game over logic
            if (IMAGES.length === noOfMatches * 2) {
              gameOver = true;

              const divs = document.querySelectorAll("div:not(#game)");

              for (let div of divs) {
                div.style.backgroundImage = `url(./images/${div.classList}.gif)`;
              }

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

              restartBtn.addEventListener("click", function () {

                // select all image divs
                const divs = document.querySelectorAll("div:not(#game)");

                for (let div of divs) {
                  div.remove();
                }
                // window.location.reload()
                restartBtn.remove();
                h3.remove();
                playGame()
              });

              // append the restart button where start button was
              h1.after(restartBtn);
            }
          }
        }
      }
    }
  }
  // when the DOM loads
  createDivsForImages(shuffledImages);
}