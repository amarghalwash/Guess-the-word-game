// setting game name
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector(
  "footer"
).innerHTML = `${gameName} game <br /> Created by <a href="https://www.linkedin.com/in/amar-ghalwash-80aa70277/" target="_blank">Ammar Ghalwash</a>
  <br /> Under the supervision of <a href="https://www.linkedin.com/in/osamaelzero/" target="_blank">El-Zero</a>
`;

// setting game options
let noOfTries = 6;
let noOfLetters = 6;
let currentTry = 1;
let noOfHints = 2;

// Words Management
const words = [
  "Ammar",
  "Yaser",
  "apple",
  "grape",
  "lemon",
  "mango",
  "peach",
  "happy",
  "angry",
  "world",
  "water",
  "study",
  "house",
  "river",
  "cloud",
  "earth",
  "climb",
  "bread",
  "fruit",
  "green",
  "black",
  "white",
  "chair",
  "table",
  "phone",
  "mouse",
  "phone",
  "egypt",
  "cairo",
];
let wordToGuess = "";
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
let messageArea = document.querySelector(".message");

// Hints managment
document.querySelector(".hint span").innerHTML = noOfHints;
const hintButton = document.querySelector(".hint");
hintButton.addEventListener("click", handleHints);

function generateInputs() {
  const inputsContainer = document.querySelector(".inputs");
  // create main div
  for (let i = 1; i <= noOfTries; i++) {
    let tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    tryDiv.innerHTML = `<span>Try ${i} </span>`;
    if (i != 1) tryDiv.classList.add("disabled-inputs");

    // create letter input fields
    for (let j = 1; j < noOfLetters; j++) {
      let input = document.createElement("input");
      input.type = "text";
      input.id = `guess-${i}-letter-${j}`;
      input.maxLength = 1;
      tryDiv.appendChild(input);
    }

    inputsContainer.appendChild(tryDiv);
  }
  // Focus on first input in first try element
  inputsContainer.children[0].children[1].focus(); //children[1] because first child is the SPAN
  console.log("amar");

  // Disabling inputs
  const inputsInDisabledDiv = document.querySelectorAll(
    ".disabled-inputs input"
  );
  inputsInDisabledDiv.forEach((input) => (input.disabled = true));

  const inputs = document.querySelectorAll("input");
  inputs.forEach((input, index) => {
    input.addEventListener("input", (e) => {
      e.target.value = e.target.value.toUpperCase();
      const nextInput = inputs[index + 1];
      if (nextInput) nextInput.focus();
    });

    input.addEventListener("keydown", (e) => {
      const currentIndex = Array.from(inputs).indexOf(e.target);
      if (e.key === "ArrowRight") {
        const nextInput = currentIndex + 1;
        if (nextInput < inputs.length) inputs[nextInput].focus();
      }
      if (e.key === "ArrowLeft") {
        const previousIndex = currentIndex - 1;
        if (previousIndex >= 0) inputs[previousIndex].focus();
      }
    });
  });
}

// CheckWord
const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", handleGuesses);
console.log(wordToGuess);
function handleGuesses() {
  let successGuess = true;
  for (let i = 1; i < noOfLetters; i++) {
    const inputField = document.getElementById(
      `guess-${currentTry}-letter-${i}`
    );
    const letter = inputField.value.toLowerCase();
    const actualLetter = wordToGuess[i - 1];

    // Game logic
    if (actualLetter === letter) {
      inputField.classList.add("yes-in-place");
    } else if (wordToGuess.includes(letter) && letter !== "") {
      inputField.classList.add("not-in-place");
      successGuess = false;
    } else {
      inputField.classList.add("no");
      successGuess = false;
    }
  }

  // check if game is over & win
  if (successGuess) {
    messageArea.innerHTML = `Good job! You won in your ${
      currentTry === 1
        ? "first try"
        : currentTry === 2
        ? "second try"
        : currentTry === 3
        ? "third try"
        : currentTry === 4
        ? "fourth try"
        : currentTry === 5
        ? "fifth try"
        : "last try"
    }  and the word was <span>${wordToGuess}</span>`;
    // Disable inputs and guess button after win
    let allTries = document.querySelectorAll(".inputs > div");
    allTries.forEach((tryDiv) => tryDiv.classList.add("disabled-inputs"));

    guessButton.disabled = true;
    hintButton.disabled = true;
  } else {
    document
      .querySelector(`.try-${currentTry}`)
      .classList.add("disabled-inputs");
    const currentTryInputs = document.querySelectorAll(
      `.try-${currentTry} input`
    );
    currentTryInputs.forEach((input) => (input.disabled = true));

    currentTry++;

    const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
    nextTryInputs.forEach((input) => (input.disabled = false));

    let element = document.querySelector(`.try-${currentTry}`);
    if (element) {
      document
        .querySelector(`.try-${currentTry}`)
        .classList.remove("disabled-inputs");
      element.children[1].focus();
    } else {
      messageArea.innerHTML = `You lost! The word was <span>${wordToGuess}</span>`;
      guessButton.disabled = true;
      hintButton.disabled = true;
    }
  }
}

function handleHints() {
  if (noOfHints > 0) {
    noOfHints--;
    document.querySelector(".hint span").innerHTML = noOfHints;
  }
  if (noOfHints === 0) {
    hintButton.disabled = true;
  }
  const enabledInputs = document.querySelectorAll("input:not([disabled])");
  const emptyEnabledInputs = Array.from(enabledInputs).filter(
    (input) => input.value === ""
  );

  if (emptyEnabledInputs.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
    const randomInput = emptyEnabledInputs[randomIndex];
    const indexToFill = Array.from(enabledInputs).indexOf(randomInput); // if you use randomIndex a bug appears(gives the same letter hint in different input fields)
    if (indexToFill !== -1) {
      randomInput.value = wordToGuess[indexToFill].toUpperCase();
    }
  }
}

function handleBackSpace(e) {
  if (e.key === "Backspace") {
    const inputs = document.querySelectorAll("input:not([disabled])");
    const currentIndex = Array.from(inputs).indexOf(document.activeElement);
    if (currentIndex !== -1) {
      const currentInput = inputs[currentIndex];
      const previousInput = inputs[currentIndex - 1];
      currentInput.value = "";
      previousInput.focus();
    }
  }
}

document.addEventListener("keydown", handleBackSpace);
window.onload = function () {
  generateInputs();
};
