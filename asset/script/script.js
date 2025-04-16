/**
 * Point culture (en Français car je suis un peu obligé): 
 * Dans ce genre de jeu, un mot equivaut a 5 caractères, y compris les espaces. 
 * La precision, c'est le pourcentage de caractères tapées correctement sur toutes les caractères tapées.
 * 
 * Sur ce... Amusez-vous bien ! 
 */

const modeSelect = document.getElementById("mode");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");

let limit_temps = 0
let restant = 0
let highlight_index = 0;
let isHardcore = false;
let premier_appuie = false;
let initial_chrono = 0;
let inter;
let accum_wpm = 0;
let accum_accuracy = 0;
let accum_error = 0;
let accum_correct = 0;
let accum_totale = 0;
let List_number = 30;

let startTime = null, previousEndTime = null;
let currentWordIndex = 0;
const wordsToType = [];

const words = {
    easy: ["apple", "banana", "grape", "orange", "cherry"],
    medium: ["keyboard", "monitor", "printer", "charger", "battery"],
    hard: ["synchronize", "complicated", "development", "extravagant", "misconception"]
};

// Generate a random word from the selected mode
const getRandomWord = (mode) => {
    const wordList = words[mode];
    return wordList[Math.floor(Math.random() * wordList.length)];
};

// Initialize the typing test
const startTest = (wordCount = 50) => {
    wordsToType.length = 0; // Clear previous words
    wordDisplay.innerHTML = ""; // Clear display
    currentWordIndex = 0;
    startTime = null;
    previousEndTime = null;

    for (let i = 0; i < wordCount; i++) {
        wordsToType.push(getRandomWord(modeSelect.value));
    }

    wordsToType.forEach((word, index) => {
        const span = document.createElement("span");
        span.textContent = word + " ";
        if (index === 0) span.style.color = "red"; // Highlight first word
        wordDisplay.appendChild(span);
    });

    inputField.value = "";
    results.textContent = "";
};

// Start the timer when user begins typing
const startTimer = () => {
    if (!startTime) startTime = Date.now();
};

// ========== ACCURACY ==========
const fn_acc = () => {
    let correct = 0
    let err = 0
    let len_val_input = inputField.value.length
    let len_word = wordsToType[currentWordIndex].length
    let sum_totale = 0

    if (Math.min([len_val_input, len_word]) === len_val_input) {
        inputField.value.split("").forEach((letter, index) => {
            if(wordsToType[currentWordIndex][index] === letter)
                correct++
            else
                err++
        })
        sum_totale = correct + err
    }
    else {
        wordsToType[currentWordIndex].split("").forEach((letter, index) => {
            if(inputField.value[index] === letter)
                correct++
            else
                err++
         })
        sum_totale = correct + err
    }  
    return [correct / sum_totale, err, correct, sum_totale]
    
}

// ========== STATS ==========
const getCurrentStats = () => {
    accRatio = fn_acc();
    acc_err = fn_acc();
    acc_correct = fn_acc();
    acc_NumberChar = fn_acc()
    const elapsedTime = (Date.now() - previousEndTime) / 1000;
    const wpm = (wordsToType[currentWordIndex].length / 5) / (elapsedTime / 60);
    const accuracy = accRatio[0] * 100;
    const err = acc_err[1]
    const correct = acc_correct[2]
    const NumberChar = acc_NumberChar[3]
    return { wpm : wpm, accuracy: accuracy, error: err, correct: correct , totale: NumberChar };
};

// Move to the next word and update stats only on spacebar press
const updateWord = (event) => {
    if (event.key === " ") { // Check if spacebar is pressed
        if (inputField.value.trim() === wordsToType[currentWordIndex]) {
            if (!previousEndTime) previousEndTime = startTime;

            const { wpm, accuracy } = getCurrentStats();
            results.textContent = `WPM: ${wpm}, Accuracy: ${accuracy}%`;

            currentWordIndex++;
            previousEndTime = Date.now();
            highlightNextWord();

            inputField.value = ""; // Clear input field after space
            event.preventDefault(); // Prevent adding extra spaces
        }
    }
};

// Highlight the current word in red
const highlightNextWord = () => {
    const wordElements = wordDisplay.children;

    if (currentWordIndex < wordElements.length) {
        if (currentWordIndex > 0) {
            wordElements[currentWordIndex - 1].style.color = "black";
        }
        wordElements[currentWordIndex].style.color = "red";
    }
};

// Event listeners
// Attach `updateWord` to `keydown` instead of `input`
inputField.addEventListener("keydown", (event) => {
    startTimer();
    updateWord(event);
});
modeSelect.addEventListener("change", () => startTest());

// Start the test
startTest();
